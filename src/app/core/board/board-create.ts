import { Board, Ring, Sector, Section } from '../board';
import { last } from 'ramda';
import * as _ from 'lodash';

export const createRings = (ringData): Ring[] => {
    return _.reduce(ringData, (rings: Ring[], d: any) => {
        const lastRing = last(rings);
        const lastRadius = lastRing ? lastRing.end : 0;
        const {r, m = 1, p} =  d;
        const ring: Ring = { 
            start: lastRadius, 
            end: r, 
            multiplier: m
        };
        if (p != null) { ring.points = p; }
        return [...rings, ring];
    }, []);
};

export const createSectors = (values: number[]): Sector[] => {
    const numSectors = values.length;
    const width = 2 * Math.PI / numSectors;
    return values.map((v, i) => ({
        index: i,
        value: v,
        width: width
    }));
};

export const createSections = (rings: Ring[], sectors: Sector[]): Section[] => {
    const sections = [];
    rings.forEach(ring => {
        sectors.forEach(sector => {
            sections.push({ ring, sector });
        });
    });
    return sections;
};

export const createBoard = (s: number[], ringData, radius: number): Board => {
    const rings = createRings(ringData);
    const sectors = createSectors(s);
    const sections = createSections(rings, sectors);
    return { sections, radius, sectors, rings };
};
