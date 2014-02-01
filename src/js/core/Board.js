var Board = (function() {
'use strict';

/**
 * Board
 * Represents a dart board defined by a collection of rings and segments.
 * Provides functions for calculating hits and getting target points and
 * score values for certain areas of the board.
 * @constructor
 */
function Board() { }

/** Radius of the outer board edge */
Board.Radius = 225;

/** List of rings and their outer radius */
Board.Rings = [
    6.35,       // Double Bull
    16,         // Single Bull
    99,         // Skinny Single
    107,        // Treble
    162,        // Fat Single
    170         // Double and edge of score-able area
];

/** List of sectors and their point values */
Board.Sectors = [
    20, 5, 12, 9, 14, 11, 8, 16, 7, 19,
    3, 17, 2, 15, 10, 6, 13, 4, 18, 1
];

/** The size of the angle for a single board sector */
Board.SectorWidth = (2 * Math.PI) / Board.Sectors.length;

/** Converts radians to degrees */
Board.RadiansToDegrees = function(radians) {
    return radians * (180 / Math.PI);
};

/** Gets the point value for the sector at the given index */
Board.GetSectorValue = function(sectorIndex) {
    return Board.Sectors[sectorIndex];
};

/** Get the index of the sector that has the given value */
Board.GetSectorIndex = function(sectorValue) {
    for (var i = 0; i < Board.Sectors.length; i++) {
        if (Board.Sectors[i] === sectorValue) { return i; }
    }
    // Board doesn't contain a sector with this value
    throw 'No sector on the board has this value ' + sectorValue;
};

/** Gets a hit object describing the area of the board the point is located */
Board.GetHit = function(point) {
    // Rotate the board so the first sector is centered vertically
    var pi2 = Math.PI * 2;
    var rotateAngle = (Math.PI / 2) - (Board.SectorWidth / 2);
    var nAngle = point.Angle - rotateAngle;

    // Make sure the angle is between 0 and 2 pi
    if (Math.abs(nAngle) > pi2) { nAngle = nAngle % pi2; }
    if (nAngle < 0) { nAngle = pi2 + nAngle; }

    // Get the ring and sector the point falls on
    var sectorIndex = Math.floor(nAngle / Board.SectorWidth);
    var ring = RingType.OOB;
    for (var r = 0; r < Board.Rings.length; r++) {
        if (Board.Rings[r] > point.Radius) {
            ring = r;
            break;
        }
    }
    return new Hit(sectorIndex, ring, point);
};

/**
 *  Gets the point coordinate of the position in the center of a
 *  given area of the board defined by the sector and ring
 */
Board.GetTargetPoint = function(sector, ring) {
    var rightBound = Board.SectorWidth * sector;
    var targetBound = rightBound + (Board.SectorWidth / 2);
    var rotateAngle = (Math.PI / 2) - (Math.PI / Board.Sectors.length);
    targetBound += rotateAngle;
    var radius = Board.GetRingCenter(ring);
    return new PolarPoint(radius, targetBound);
};

/** Gets the distance from center that is the center point of the ring */
Board.GetRingCenter = function(ring) {
    if (ring === RingType.DoubleBull || ring === RingType.SingleBull) return 0;
    if (ring === RingType.OOB) return Board.Rings[Board.Rings.length - 1] + 5;
    var thisRing = Board.Rings[ring];
    var lastRing = Board.Rings[ring - 1];
    return ((thisRing - lastRing) / 2) + lastRing;
};

/** Gets the point value that corresponds to the given area of the board */
Board.GetHitPoints = function(hit) {
    var points = Board.GetSectorValue(hit.SectorIndex);
    var mult = Board.GetRingMultiple(hit.Ring);

    // Get the point multiplier based on the ring segment. Double=2,Treble=3...
    var thin = RingType.ThinSingle,
        fat = RingType.FatSingle;
    if (hit.Ring === RingType.OOB) mult = 0;
    else if (hit.Ring === RingType.Double) mult = 2;
    else if (hit.Ring === RingType.Treble) mult = 3;
    else if (hit.Ring === RingType.SingleBull) mult = 1;
    else if (hit.Ring === RingType.DoubleBull) mult = 2;
    else if (hit.Ring === thin || hit.Ring === fat) mult = 1;
    else throw 'Invalid Segment Type';

    // Calculate the points hit this throw
    if (hit.Ring === RingType.SingleBull) return 25;
    if (hit.Ring === RingType.DoubleBull) return 50;
    return points * mult;
};

/** Gets the multiple for a ring of the board (single, double, triple) */
Board.GetRingMultiple = function(ring) {
    var mult = 1;
    if (ring === RingType.OOB) { mult = 0; }
    else if (ring === RingType.Double) { mult = 2; }
    else if (ring === RingType.Treble) { mult = 3; }
    else if (ring === RingType.SingleBull) { mult = 1; }
    else if (ring === RingType.DoubleBull) { mult = 2; }
    else if (ring === RingType.FatSingle || ring === RingType.ThinSingle) {
        mult = 1;
    }
    else throw 'Invalid Segment Type';
    return mult;
};

return Board;
}());

var RingType = {
    DoubleBull: 0,
    SingleBull: 1,
    ThinSingle: 2,
    Treble: 3,
    FatSingle: 4,
    Double: 5,
    OOB: 6
};
