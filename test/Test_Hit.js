(function() {
'use strict';

module('Hit');

test('Constructor', function () {
    var hit = new Hit(0, RingType.Treble);
    equal(hit.Ring, RingType.Treble, 'Ring initializes');
    equal(hit.SectorIndex, 0, 'Sector initializes');
    equal(hit.Point.Angle.toFixed(2), 1.57, 'Angle initializes');
    equal(hit.Point.Radius.toFixed(2), 103, 'Radius initializes');

    var hit = new Hit(0, RingType.OOB);
    equal(hit.Point.Angle.toFixed(2), 1.57, 'Angle initializes');
    equal(hit.Point.Radius.toFixed(2), 175, 'Radius initializes');
});

test('IsDouble', function () {
    var hit = new Hit(0, RingType.Double);
    equal(hit.IsDouble(), true, 'Double 20 is a double');

    hit = new Hit(0, RingType.DoubleBull);
    equal(hit.IsDouble(), true, 'DoubleBull is a double');

    hit = new Hit(0, RingType.SingleBull);
    equal(hit.IsDouble(), false, 'SingleBull is not a double');

    hit = new Hit(0, RingType.FatSingle);
    equal(hit.IsDouble(), false, 'Single 20 is not a double');

    hit = new Hit(0, RingType.ThinSingle);
    equal(hit.IsDouble(), false, 'Single 20 is not a double');

    hit = new Hit(0, RingType.Treble);
    equal(hit.IsDouble(), false, 'Treble 20 is not a double');

    hit = new Hit(0, RingType.OOB);
    equal(hit.IsDouble(), false, 'Out of bounds is not a double');
});

test('toString', function () {
    var hit = new Hit(Board.GetSectorIndex(20), RingType.Double);
    equal(hit.toString(), 'D20', 'Double 20 is D20');

    hit = new Hit(Board.GetSectorIndex(20), RingType.FatSingle);
    equal(hit.toString(), 'S20', 'FatSingle 20 is S20');

    hit = new Hit(Board.GetSectorIndex(20), RingType.ThinSingle);
    equal(hit.toString(), 'S20', 'ThinSingle 20 is S20');

    hit = new Hit(Board.GetSectorIndex(20), RingType.Treble);
    equal(hit.toString(), 'T20', 'Treble 20 is T20');

    hit = new Hit(Board.GetSectorIndex(4), RingType.Treble);
    equal(hit.toString(), 'T4', 'Treble 4 is T4');

    hit = new Hit(Board.GetSectorIndex(4), RingType.Double);
    equal(hit.toString(), 'D4', 'Double 4 is D4');

    hit = new Hit(Board.GetSectorIndex(4), RingType.FatSingle);
    equal(hit.toString(), 'S4', 'FatSingle 4 is S4');

    hit = new Hit(Board.GetSectorIndex(20), RingType.DoubleBull);
    equal(hit.toString(), 'DB', 'Double Bull is DB');

    hit = new Hit(Board.GetSectorIndex(20), RingType.SingleBull);
    equal(hit.toString(), 'SB', 'Single Bull is SB');

    hit = new Hit(Board.GetSectorIndex(20), RingType.OOB);
    equal(hit.toString(), 'OOB', 'Out of bounds is OOB');
});

test('equals', function () {
    var hit1 = new Hit(Board.GetSectorIndex(20), RingType.Double);
    var hit2 = new Hit(Board.GetSectorIndex(20), RingType.Double);
    ok(hit1.equals(hit2), 'Hits are equal: ' + hit1 + ', ' + hit2);

    hit1 = new Hit(Board.GetSectorIndex(20), RingType.FatSingle);
    hit2 = new Hit(Board.GetSectorIndex(20), RingType.FatSingle);
    ok(hit1.equals(hit2), 'Hits are equal: ' + hit1 + ', ' + hit2);

    hit1 = new Hit(Board.GetSectorIndex(20), RingType.DoubleBull);
    hit2 = new Hit(Board.GetSectorIndex(20), RingType.DoubleBull);
    ok(hit1.equals(hit2), 'Hits are equal: ' + hit1 + ', ' + hit2);

    hit1 = new Hit(Board.GetSectorIndex(20), RingType.DoubleBull);
    hit2 = new Hit(Board.GetSectorIndex(5), RingType.DoubleBull);
    ok(hit1.equals(hit2), 'Hits are equal: ' + hit1 + ', ' + hit2);

    hit1 = new Hit(Board.GetSectorIndex(20), RingType.OOB);
    hit2 = new Hit(Board.GetSectorIndex(5), RingType.OOB);
    ok(hit1.equals(hit2), 'Hits are equal: ' + hit1 + ', ' + hit2);

    hit1 = new Hit(Board.GetSectorIndex(20), RingType.FatSingle);
    hit2 = new Hit(Board.GetSectorIndex(20), RingType.ThinSingle);
    ok(!hit1.equals(hit2), 'Fat and thin single are not equal');

    hit1 = new Hit(Board.GetSectorIndex(20), RingType.Treble);
    hit2 = new Hit(Board.GetSectorIndex(5), RingType.Treble);
    ok(!hit1.equals(hit2), 'Hits are not equal: ' + hit1 + ', ' + hit2);

    hit1 = new Hit(Board.GetSectorIndex(20), RingType.Treble);
    hit2 = new Hit(Board.GetSectorIndex(20), RingType.OOB);
    ok(!hit1.equals(hit2), 'Hits are not equal: ' + hit1 + ', ' + hit2);
});

}());
