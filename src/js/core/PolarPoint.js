var PolarPoint = (function() {
'use strict';

/**
 * PolarPoint
 * Represents a point in space defined by polar coordinates (radius, angle)
 * @constructor
 */
function PolarPoint(radius, angle) {
    this.Radius = radius;
    this.Angle = angle;
 }

// Gets a Cartesian point (x, y) from the polar point
PolarPoint.GetCartesian = function(point) {
    return {
        X: PolarPoint.GetCartesianX(point),
        Y: PolarPoint.GetCartesianY(point)
    };
 };

// Get the X value of the Cartesian point
PolarPoint.GetCartesianX = function(point) {
    return point.Radius * Math.cos(point.Angle);
};

// Get the Y value of the Cartesian point
 PolarPoint.GetCartesianY = function(point) {
    return point.Radius * Math.sin(point.Angle);
 };

// Gets a polar point from Cartesian coordinates
PolarPoint.GetFromCartesian = function(x, y) {
    var radiusHit = Math.sqrt((x * x) + (y * y));
    var angleHit = Math.atan2(y, x);

    if (radiusHit < 0) {
        radiusHit = Math.abs(radiusHit);
        angleHit += Math.PI;
    }
    if (angleHit < 0) angleHit += (Math.PI * 2);
    return new PolarPoint(radiusHit, angleHit);
};

// Returns a polar point that is the vector of the two other points
PolarPoint.AddPoints = function(point1, point2) {
    // Convert Polar coordinates to Cartesian grid
    var xOff = PolarPoint.GetCartesianX(point2);
    var yOff = PolarPoint.GetCartesianY(point2);
    var xTarg = PolarPoint.GetCartesianX(point1);
    var yTarg = PolarPoint.GetCartesianY(point1);
    // Add target and offset vectors to get our actual hit
    var xHit = xTarg + xOff;
    var yHit = yTarg + yOff;
    // Create the point and convert it back to polar system
    return PolarPoint.GetFromCartesian(xHit, yHit);
};

return PolarPoint;
}());
