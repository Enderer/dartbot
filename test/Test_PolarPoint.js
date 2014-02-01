(function() {
'use strict';

module('PolarPoint');

test('Constructor', function() {
    var point = new PolarPoint(100, 10);
    equal(point.Radius, 100, 'Radius is 100');
    equal(point.Angle, 10, 'Angle is 10');
});

test('GetCartesian', function () {
  
    var point = PolarPoint.GetCartesian(new PolarPoint(0, 0));
    ok(point.X === 0 && point.Y === 0, '(0,0)');

    point = PolarPoint.GetCartesian(new PolarPoint(100, 2 * Math.PI));
    ok(Math.round(point.X) === 100 && Math.round(point.Y) === 0, '(100,0)');

    point = PolarPoint.GetCartesian(new PolarPoint(100, Math.PI));
    ok(Math.round(point.X) === -100 && Math.round(point.Y) === 0, '(-100,0)');

    point = PolarPoint.GetCartesian(new PolarPoint(100, Math.PI / 2));
    ok(Math.round(point.X) === 0 && Math.round(point.Y) === 100, '(0,100)');

    point = PolarPoint.GetCartesian(new PolarPoint(100, Math.PI / 4));
    ok(Math.round(point.X) === 71 && Math.round(point.Y) === 71, '(70,70)');
});

test('GetFromCartesian', function () {
    var point = PolarPoint.GetFromCartesian(100, 0);
    ok(point.Radius === 100 && point.Angle === 0, '(100,0)');

    point = PolarPoint.GetFromCartesian(0, 100);
    ok(point.Radius === 100 && point.Angle === Math.PI / 2, '(0,100)');

    point = PolarPoint.GetFromCartesian(0, -100);
    ok(point.Radius === 100 && point.Angle ===  Math.PI * 6/4, '(0,-100');
});

test('AddPoints', function () {
    var p1 = new PolarPoint(0, 0),
        p2 = new PolarPoint(100, 0),
        p3 = new PolarPoint(-100, 0),
        p4 = new PolarPoint(100, Math.PI);

    var point = PolarPoint.AddPoints(p1, p1);
    ok(point.Radius === 0 && point.Angle === 0, 'p1+p1');

    point = PolarPoint.AddPoints(p2, p1);
    ok(point.Radius === 100 && point.Angle === 0, 'p2+p1');

    point = PolarPoint.AddPoints(p3, p1);
    ok(point.Radius === 100 && point.Angle === Math.PI, 'p3+p1');

    point = PolarPoint.AddPoints(p2, p4);
    ok(Math.round(point.Radius) === 0 && point.Angle === Math.PI / 2, 'p2+p4');
});

}());
