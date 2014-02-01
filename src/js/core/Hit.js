var Hit = (function() {
'use strict';

/**
 * Hit - Represents a hit to a specific area of the board.
 * The area is represented by the sector and ring type
 * @constructor
 * @param {number} sector .
 * @param {number} ring .
 * @param {Object=} point .
 */
function Hit(sector, ring, point) {
    this.SectorIndex = sector;
    this.Ring = ring;
    this.Point = point || Board.GetTargetPoint(sector, ring);
}

/** Does this hit count as a double in **/
Hit.prototype.IsDouble = function() {
    return this.Ring === RingType.Double || this.Ring === RingType.DoubleBull;
};

/** Returns a string representation of the hit */
Hit.prototype.toString = function() {
    // Bullseye and out of bounds
    if (this.Ring === RingType.DoubleBull) return 'DB';
    else if (this.Ring === RingType.SingleBull) return 'SB';
    else if (this.Ring === RingType.OOB) return 'OOB';

    var s = [];
    s[RingType.ThinSingle] = 'S';
    s[RingType.Treble] = 'T';
    s[RingType.FatSingle] = 'S';
    s[RingType.Double] = 'D';

    var str = s[this.Ring];
    str += Board.GetSectorValue(this.SectorIndex);
    return str;
};

/** Returns true if hits are equal */
Hit.prototype.equals = function(hit) {
    if (this.Ring !== hit.Ring) return false;
    else if (this.Ring === RingType.DoubleBull) return true;
    else if (this.Ring === RingType.SingleBull) return true;
    else if (this.Ring === RingType.OOB) return true;
    return this.SectorIndex === hit.SectorIndex;
};

return Hit;
}());
