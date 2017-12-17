/** Represents a point as a Polar coordinate */
export interface PolarPoint {
    radius: number;
    angle: number;
}

/** Standard (x, y) Cartesian coordinate */
export interface Point {
    x: number;
    y: number;
}

/**
 * Gets a Cartesian point (x, y) from the polar point
 * @param polar Polar point to convert into a x,y point
 */
export const getCartesian = (polar: PolarPoint): Point => {
    return {
        x: getCartesianX(polar),
        y: getCartesianY(polar)
    };
 };

/**
 * Get the X value of the Cartesian point
 * @param polar Polar point to return the X coordinate from
 */
export const getCartesianX = (polar: PolarPoint): number => {
    return polar.radius * Math.cos(polar.angle);
};

/**
 * Get the Y value of the Cartesian point
 * @param point Polar point to return the Y coordinate of
 */
export const getCartesianY = (point: PolarPoint): number => {
    return point.radius * Math.sin(point.angle);
};

/**
 * Gets a polar point from Cartesian coordinates
 * @param x X value of the cartesian point
 * @param y Y value of the cartesian point
 */
export const getFromCartesian = (x: number, y: number): PolarPoint => {
    // Convert the x,y coordinates in to their polar equivalents
    const radius = Math.sqrt((x * x) + (y * y));
    let angle = Math.atan2(y, x);

    // If the angle is negative add 360 degrees to make it positive
    if (angle < 0)  {
        angle += (Math.PI * 2);
    }
    // Return the new polar point
    return { radius, angle };
};

/**
 * Add two polar points together and return a new polar
 * point that that is the vector of the first two points
 * @param point1 First polar point to add
 * @param point2 Second polar point to add
 */
export const addPoints = (point1: PolarPoint, point2: PolarPoint): PolarPoint => {
    // Convert Polar coordinates to Cartesian grid
    const xOff = getCartesianX(point2);
    const yOff = getCartesianY(point2);
    const xTarg = getCartesianX(point1);
    const yTarg = getCartesianY(point1);
    // Add target and offset vectors to get our actual hit
    const xHit = xTarg + xOff;
    const yHit = yTarg + yOff;
    // Create the point and convert it back to polar system
    return getFromCartesian(xHit, yHit);
};
