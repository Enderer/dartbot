(function() {
'use strict';

module('Board' );

test('SectorWidth', function() {
    equal(Board.SectorWidth.toFixed(6), .314159, 'Board.SectorWidth is valid');
});

test('RadiansToDegrees', function() {
    equal(Board.RadiansToDegrees(2 * Math.PI), 360, '2 Pi is 360 degrees');
    equal(Board.RadiansToDegrees(Math.PI), 180, 'Pi is 180 degrees');
    equal(Board.RadiansToDegrees(Math.PI / 2), 90, 'Pi / 2 is 90 degrees');
    equal(Board.RadiansToDegrees(4 * Math.PI), 720, '4 Pi is 270 degrees');
});

test('GetSectorValue', function () {
    equal(Board.GetSectorValue(0), 20, 'Sector[0] is 20 points');
    equal(Board.GetSectorValue(9), 19, 'Sector[9] is 19 points');
    equal(Board.GetSectorValue(18), 18, 'Sector[18] is 18 points');
    equal(Board.GetSectorValue(11), 17, 'Sector[11] is 17 points');
    equal(Board.GetSectorValue(7), 16, 'Sector[7] is 16 points');
    equal(Board.GetSectorValue(13), 15, 'Sector[13] is 15 points');
});

test('GetSectorIndex', function () {
    equal(Board.GetSectorIndex(20), 0, 'Sector[0] is 20 points');
    equal(Board.GetSectorIndex(19), 9, 'Sector[9] is 19 points');
    equal(Board.GetSectorIndex(18), 18, 'Sector[18] is 18 points');
    equal(Board.GetSectorIndex(17), 11, 'Sector[11] is 17 points');
    equal(Board.GetSectorIndex(16), 7, 'Sector[7] is 16 points');
    equal(Board.GetSectorIndex(15), 13, 'Sector[13] is 15 points');
});

test('GetHit', function () {
    var hit = Board.GetHit(new PolarPoint(0,0));
    equal(hit.Ring, RingType.DoubleBull, '(0,0) is a DoubleBull hit');

    hit = Board.GetHit(new PolarPoint(100, 1.57));
    equal(hit.Ring, RingType.Treble, '(100, 1.57) hits treble 20');
    equal(hit.SectorIndex, 0, '(100, 1.57) hits treble 20');
    
    hit = Board.GetHit(new PolarPoint(500, 1.57));
    equal(hit.Ring, RingType.OOB, '(500, 1.57) hits out-of-bounds');

    hit = Board.GetHit(new PolarPoint(100, 1.57 + (Math.PI * 2)));
    equal(hit.Ring, RingType.Treble, '(100, 2 pi) hits treble 20');
    equal(hit.SectorIndex, 0, '(100, 2 pi) hits treble 20');
});

test('GetTargetPoint', function () {
    var target = Board.GetTargetPoint(0, RingType.DoubleBull)
    equal(target.Radius, 0, 'Target double bull has radius 0');
    
    target = Board.GetTargetPoint(0, RingType.Treble);
    equal(target.Radius, 103, 'Target treble 20 has radius 103');
    equal(target.Angle.toFixed(2), 1.57, 'Target treble 20 has angle 1.57');
});

test('GetRingCenter', function () {
    var rings = [
        { r: RingType.DoubleBull, c: 0 },
        { r: RingType.SingleBull, c: 0 },
        { r: RingType.ThinSingle, c: 57 },
        { r: RingType.Treble, c: 103 },
        { r: RingType.FatSingle, c: 134 },
        { r: RingType.Double, c: 166 },
        { r: RingType.OOB, c: 175 }
    ];

    for(var i = 0; i < rings.length; i++) {
        var ring = rings[i];
        var c = Board.GetRingCenter(ring.r);
        equal(parseInt(c), ring.c, 'Ring ' + ring.r + ' center is ' + ring.c);
    }
});

test('GetHitPoints', function () {
    var hit = new Hit(0, RingType.DoubleBull);
    var points = Board.GetHitPoints(hit);
    equal(points, 50, 'DoubleBull is 50 points');

    hit = new Hit(0, RingType.SingleBull);
    points = Board.GetHitPoints(hit);
    equal(points, 25, 'SingleBull is 25 points');

    hit = new Hit(0, RingType.ThinSingle);
    points = Board.GetHitPoints(hit);
    equal(points, 20, 'ThinSingle is 20 points');

    hit = new Hit(0, RingType.Treble);
    points = Board.GetHitPoints(hit);
    equal(points, 60, 'Treble is 60 points');

    hit = new Hit(0, RingType.FatSingle);
    points = Board.GetHitPoints(hit);
    equal(points, 20, 'FatSingle is 20 points');

    hit = new Hit(0, RingType.Double);
    points = Board.GetHitPoints(hit);
    equal(points, 40, 'Double is 40 points');

    hit = new Hit(0, RingType.OOB);
    points = Board.GetHitPoints(hit);
    equal(points, 0, 'OOB is 0 points');
});

test('GetRingMultiple', function () {
    equal(Board.GetRingMultiple(RingType.OOB), 0, 'OOB multiple is 0');
    equal(Board.GetRingMultiple(RingType.Double), 2, 'OOB multiple is 2');
    equal(Board.GetRingMultiple(RingType.Treble), 3, 'OOB multiple is 3');
    equal(Board.GetRingMultiple(RingType.SingleBull), 1, 'OOB multiple is 1');
    equal(Board.GetRingMultiple(RingType.DoubleBull), 2, 'OOB multiple is 2');
    equal(Board.GetRingMultiple(RingType.FatSingle), 1, 'OOB multiple is 1');
    equal(Board.GetRingMultiple(RingType.ThinSingle), 1, 'OOB multiple is 1');
});

}());
