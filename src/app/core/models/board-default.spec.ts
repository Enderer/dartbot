import { board } from './board-default';
import * as R from 'ramda';

describe('board-default', () => {
    let rings, sectors, sections;

    beforeEach(() => {
        rings = [
            { start: 0, end: 6.35, multiplier: 2, points: 25 },
            { start: 6.35, end: 16, multiplier: 1, points: 25 },
            { start: 16, end: 99, multiplier: 1 },
            { start: 99, end: 107, multiplier: 3 },
            { start: 107, end: 162, multiplier: 1 },
            { start: 162, end: 170, multiplier: 2 },
        ];
        const sw = Math.PI * 2 / 20;
        sectors = [
            { index: 0,  value: 20, width: sw },
            { index: 1,  value: 5,  width: sw },
            { index: 2,  value: 12, width: sw },
            { index: 3,  value: 9,  width: sw },
            { index: 4,  value: 14, width: sw },
            { index: 5,  value: 11, width: sw },
            { index: 6,  value: 8,  width: sw },
            { index: 7,  value: 16, width: sw },
            { index: 8,  value: 7,  width: sw },
            { index: 9,  value: 19, width: sw },
            { index: 10, value: 3,  width: sw },
            { index: 11, value: 17, width: sw },
            { index: 12, value: 2,  width: sw },
            { index: 13, value: 15, width: sw },
            { index: 14, value: 10, width: sw },
            { index: 15, value: 6,  width: sw },
            { index: 16, value: 13, width: sw },
            { index: 17, value: 4,  width: sw },
            { index: 18, value: 18, width: sw },
            { index: 19, value: 1,  width: sw }
        ];

        sections = R.map(
            ([ring, sector]) => ({ ring, sector }),
            R.xprod(rings, sectors)
        );
    });

    it('should exist', () => {
        expect(board).toBeTruthy();
    });

    it('should have correct radius', () => {
        expect(board.radius).toEqual(225);
    });

    it('should have correct rings', () => {
        expect(board.rings).toBeDefined();
        expect(board.rings instanceof Array).toBe(true);
        expect(board.rings).toEqual(rings);
    });    
    
    it('should have correct sectors', () => {
        expect(board.sectors).toBeDefined();
        expect(board.sectors instanceof Array).toBe(true);
        expect(board.sectors).toEqual(sectors);
    });

    it('should have correct sections', () => {
        expect(board.sections).toBeDefined();
        expect(board.sections instanceof Array).toBe(true);
        expect(board.sections).toEqual(sections);
    });
});
