import * as _ from 'lodash';
import * as R from 'ramda';
import { compose, curry, path } from 'ramda';
import { PolarPoint } from '../board';

/**
 * Represents a dart board defined by a collection of rings and segments.
 * Provides functions for calculating hits and getting target points and
 * score values for certain areas of the board.
 */
export interface Board {

    /** Radius of the outer board edge in mm */
    readonly radius: number;

    /** List of rings and their outer radii */
    readonly rings: Ring[];

    /** List of sectors and their point values */
    readonly sectors: Sector[];

    /** List of all individual sections of the board */
    readonly sections: Section[];
}

/**
 * Represents a ring in of the board
 * Bull, Treble, Double
 */
export interface Ring {
    /** Inner radius of the ring in mm*/
    start: number;

    /** Outer radius of the ring in mm */
    end: number;

    /** Points multiplier for the ring (triple, double, etc...) */
    multiplier?: number;

    /** Points assigned to this ring (25 in case of single, bull) */
    points?: number;
}

/** Represents a wedge area of the board */
export interface Sector {
    /** Point value assigned to the sector */
    value: number;
}

/** 
 * A specific scorable area of the board (ring and sector).
 */
export interface Section {
    ring: Ring;
    sector: Sector;
}

/**
 * Represents a hit for a singel throw
 */
export interface Hit {
    /** Section of the board that was hit */
    section: Section;

    /** Specific point that was hit */
    point?: PolarPoint;
}

/** Converts radians to degrees */
export const radiansToDegrees = (radians: number): number => {
    if (radians == null) { return NaN; }
    return radians * (180 / Math.PI);
};

/** The size of the angle for a single board sector */
export const sectorWidth = (b: Board): number => {
    if (b == null || b.sectors == null) { return NaN; }
    return (2 * Math.PI) / b.sectors.length;
};

/** Gets the radius that lies in the exact center point of the ring */
export const ringCenter = (ring: Ring): number => {
    if (ring == null || ring.start == null || ring.end == null) { 
        return NaN;
    }

    // If the ring starts at 0 then this is the center of the board
    // so the center point is also 0, i.e. double bull ring.
    if (ring.start === 0) { return 0; }

    // Return the radius halfway between the start and end of the ring
    return ((ring.end - ring.start) / 2) + ring.start;
};

/** Gets the ring that the point lies in */
export const ringFromPoint = curry((b: Board, point: PolarPoint): Ring => {
    const getRings = R.pathOr<Ring[]>([], ['rings']);
    const getRadius = R.path<number>(['radius']);
    const getStart = R.path<number>(['start']);
    const pointRadius = getRadius(point);
    if (pointRadius == null) { return null; }
    if (!(pointRadius >= 0)) { return null; }
    const rings = getRings(b);
    const innerRings = rings.filter(r => r.end >= pointRadius);
    const minRing = _.minBy(innerRings, getStart);
    return minRing || null;
});

/** Gets the index position of the given sector */
export const indexBySector = curry((b: Board, sector: Sector): number => {
    if (b == null || sector == null) { return null; }
    return b.sectors.indexOf(sector);
});

/** Gets the sector at the given index */
export const sectorByIndex = curry((b: Board, i: number): Sector => {
    if (i == null) { return null; }
    if (b == null || b.sectors == null) { return null; }
    return b.sectors[i] || null;
});

/** Gets the sector that has the given point value */
export const sectorByValue = curry((b: Board, v: number): Sector => {
    if (b == null || b.sectors == null) { return null; }
    return b.sectors.find(s => s.value === v) || null;
});

/** Gets the index of the sector the point lies in */
export const sectorIndexFromPoint = curry((b: Board, point: PolarPoint): number => {
    if (b == null || point == null) { return null; }
    
    // If the point is outside the board rings, return null
    const ring = ringFromPoint(b, point);
    if (ring == null) { return null; }

    // Rotate the board so the first sector is centered vertically
    const sWidth = sectorWidth(b);
    const pi2 = Math.PI * 2;

    // Make sure the angle is between 0 and 2 pi
    let angle = point.angle;
    if (Math.abs(angle) >= pi2) { angle %= pi2; }
    if (angle < 0) { angle += pi2; }
    if (angle === -0) { angle = 0; }

    // Get the ring and sector the point falls on
    const index = Math.floor(angle / sWidth);
    return index;
});

/** Gets the sector that a point lies in */
export const sectorFromPoint = curry((b: Board, point: PolarPoint): Sector => {
    const s = sectorIndexFromPoint(b);
    const i = sectorByIndex(b);
    const c = compose(i, s);
    return c(point);
});

/** Get the section of the board the given point lies in */
export const sectionFromPoint = curry((b: Board, point: PolarPoint): Section => {
    if (b == null || point == null) { return null; }
    const ring = ringFromPoint(b, point);
    const sector = sectorFromPoint(b, point);
    if (ring == null || sector == null) { return null; }
    return { sector, ring };
});

/**  Gets the point coordinate of the center of a given area */
export const targetPoint = curry((board: Board, section: Section): PolarPoint => {
    if (board == null || section == null) { return null; }
    const { sector, ring } = section;
    const sw = sectorWidth(board);
    const index = indexBySector(board, sector);
    const rightBound = index * sw;
    let angle = rightBound + (sw / 2);

    // Rotate 90 deg minus half a segment width
    const rotateAngle = (Math.PI / 2) - sw;
    angle += rotateAngle;
    const radius = ringCenter(ring);
    return { radius, angle };
});

/** 
 * Gets the point value that corresponds to the given area of the board 
 * Treble 20 = 60 points, Double 16 = 32 points
 */
export const scoreFromSection = (section: Section): number => {
    if (section == null) { return NaN; }
    const { ring, sector } = section;
    if (ring == null || sector == null) { return NaN; }
    const points = ring.points != null ? ring.points : sector.value;
    const mult = ring.multiplier == null ? 1 : ring.multiplier;
    return points * mult;
};

/** Gets a hit object describing the area of the board where the point is located */
export const hitFromPoint = curry((b: Board, point: PolarPoint): Hit => {
    if (b == null || point == null) { return null; }
    const section = sectionFromPoint(b, point);
    if (section == null) { return null; }
    return { section, point };
});
