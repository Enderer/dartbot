import * as Board from './board';
import { board } from './board-default';
import { PolarPoint } from './polar-point';

const PI = Math.PI;
const PI2 = Math.PI * 2;

describe('Board', () => {

    let sw = 0, angles = [], radii = [];

    beforeEach(() => {
        sw = Board.sectorWidth(board);
        angles = board.sectors.map((s, i) => (i * sw));
        radii = board.rings.map(r => r.end);
    });

    describe('sectorWidth', () => {  
        it('should return NaN for nulls', () => {
            expect(Board.sectorWidth(null)).toEqual(NaN);
            expect(Board.sectorWidth(undefined)).toEqual(NaN);
            expect(Board.sectorWidth(<Board.Board>{ rings: [] })).toEqual(NaN);
            expect(Board.sectorWidth(<Board.Board>{ rings: [] })).toEqual(NaN);
        });
        it ('should calculate correct width', () => {
            expect(Board.sectorWidth(board)).toEqual(.3141592653589793);
        });
    });

    describe('radiansToDegrees', () => {  
        it('should return NaN for nulls', () => {
            expect(Board.radiansToDegrees(null)).toEqual(NaN);
            expect(Board.radiansToDegrees(undefined)).toEqual(NaN);
        });
        it ('should calculate correct degrees', () => {
            expect(Board.radiansToDegrees(0)).toEqual(0);
            expect(Board.radiansToDegrees(Math.PI * 0.5)).toEqual(90);
            expect(Board.radiansToDegrees(Math.PI * 1)).toEqual(180);
            expect(Board.radiansToDegrees(Math.PI * 1.5)).toEqual(270);
            expect(Board.radiansToDegrees(Math.PI * 2)).toEqual(360);
        });
        it ('should calculate radians greater than 360 degrees', () => {
            expect(Board.radiansToDegrees(Math.PI * 2.5)).toEqual(450);
            expect(Board.radiansToDegrees(Math.PI * 3)).toEqual(540);
            expect(Board.radiansToDegrees(Math.PI * 3.5)).toEqual(630);
            expect(Board.radiansToDegrees(Math.PI * 4)).toEqual(720);
        });
        it ('should calculate negative radians', () => {
            expect(Board.radiansToDegrees(-0)).toEqual(-0);
            expect(Board.radiansToDegrees(Math.PI * -0.5)).toEqual(-90);
            expect(Board.radiansToDegrees(Math.PI * -1)).toEqual(-180);
            expect(Board.radiansToDegrees(Math.PI * -1.5)).toEqual(-270);
            expect(Board.radiansToDegrees(Math.PI * -2)).toEqual(-360);
            expect(Board.radiansToDegrees(Math.PI * -2.5)).toEqual(-450);
            expect(Board.radiansToDegrees(Math.PI * -3)).toEqual(-540);
            expect(Board.radiansToDegrees(Math.PI * -3.5)).toEqual(-630);
            expect(Board.radiansToDegrees(Math.PI * -4)).toEqual(-720);
        });
    });

    describe('Ring', () => {
        describe('ringCenter', () => {
            it('should return null', () => {
                expect(Board.ringCenter(null)).toBeNaN();
                expect(Board.ringCenter(undefined)).toBeNaN();
            });
    
            it('should return 0 for first ring', () => {
                expect(Board.ringCenter({ start: 0, end: 100 })).toBe(0);
            });
    
            it('should return 0 for first ring', () => {
                expect(Board.ringCenter({ start: 0, end: 100 })).toBe(0);
            });
    
            it('should return center point', () => {
                expect(Board.ringCenter({ start: 20, end: 40 })).toBe(30);
                expect(Board.ringCenter({ start: 100, end: 300 })).toBe(200);
                expect(Board.ringCenter({ start: undefined, end: 300 })).toBeNaN();
                expect(Board.ringCenter({ start: 100, end: undefined })).toBeNaN();
                expect(Board.ringCenter({ start: null, end: null })).toBeNaN();
            });
        });
    });

    describe('indexBySector', () => {
        it('should return null for null', () => {
            expect(Board.indexBySector(null, null)).toEqual(null);
            expect(Board.indexBySector(board, null)).toEqual(null);
            expect(Board.indexBySector(null, board.sectors[0])).toEqual(null);
                    
            expect(Board.indexBySector(undefined, undefined)).toEqual(null);
            expect(Board.indexBySector(board, undefined)).toEqual(null);
            expect(Board.indexBySector(undefined, board.sectors[0])).toEqual(null);
        });

        it('should return the correct sector', () => {
            board.sectors.forEach((s, i) => {
                expect(Board.sectorByIndex(board, i)).toEqual(s);
            });
        });
    });

    describe('sectorByIndex', () => {
        it('should return null for null', () => {
            expect(Board.sectorByIndex(null, null)).toEqual(null);
            expect(Board.sectorByIndex(board, null)).toEqual(null);
            expect(Board.sectorByIndex(null, 0)).toEqual(null);
            expect(Board.sectorByIndex(board, -1)).toEqual(null);
        });

        it('should return the correct sector', () => {
            board.sectors.forEach((s, i) => {
                expect(Board.sectorByIndex(board, i)).toEqual(s);
            });
        });
    });

    describe('sectorByValue', () => {
        it('should return null for null', () => {
            expect(Board.sectorByValue(null, null)).toEqual(null);
            expect(Board.sectorByValue(board, null)).toEqual(null);
            expect(Board.sectorByValue(null, 0)).toEqual(null);
            expect(Board.sectorByValue(board, -1)).toEqual(null);
        });

        it('should return the correct sector', () => {
            board.sectors.forEach((s, i) => {
                expect(Board.sectorByValue(board, s.value)).toEqual(s);
            });
        });
    });

    describe('ringFromPoint', () => {  
        it('should return null for nulls', () => {
            expect(Board.ringFromPoint(null, null)).toEqual(null);
            expect(Board.ringFromPoint(null, <PolarPoint>{})).toEqual(null);
            expect(Board.ringFromPoint(board, null)).toEqual(null);
            expect(Board.ringFromPoint(null, { radius: 0, angle: 0 })).toEqual(null);
            
        });

        it('should return correct ring', () => {
            expect(Board.ringFromPoint(board, { radius: 0, angle: 0 })).toEqual(board.rings[0]);
            expect(Board.ringFromPoint(board, { radius: 5, angle: 0 })).toEqual(board.rings[0]);
            expect(Board.ringFromPoint(board, { radius: 10, angle: 0 })).toEqual(board.rings[1]);
            expect(Board.ringFromPoint(board, { radius: 90, angle: 0 })).toEqual(board.rings[2]);
            expect(Board.ringFromPoint(board, { radius: 100, angle: 0 })).toEqual(board.rings[3]);
            expect(Board.ringFromPoint(board, { radius: 150, angle: 0 })).toEqual(board.rings[4]);
            expect(Board.ringFromPoint(board, { radius: 165, angle: 0 })).toEqual(board.rings[5]);
            expect(Board.ringFromPoint(board, { radius: 170, angle: 0 })).toEqual(board.rings[5]);
        });

        it('should return null for OOB', () => {
            expect(Board.ringFromPoint(board, { radius: 175, angle: 0 })).toEqual(null);
            expect(Board.ringFromPoint(board, { radius: 190, angle: 0 })).toEqual(null);
            expect(Board.ringFromPoint(board, { radius: 300, angle: 0 })).toEqual(null);
            expect(Board.ringFromPoint(board, { radius: Infinity, angle: 0 })).toEqual(null);
        });

        it('should return null for negative radius', () => {
            expect(Board.ringFromPoint(board, { radius: -1, angle: 0 })).toEqual(null);
            expect(Board.ringFromPoint(board, { radius: -10, angle: 0 })).toEqual(null);
            expect(Board.ringFromPoint(board, { radius: -100, angle: 0 })).toEqual(null);
            expect(Board.ringFromPoint(board, { radius: -200, angle: 0 })).toEqual(null);
        });
    });

    describe('sectorIndexFromPoint', () => {
        
        it('should return null for nulls', () => {
            expect(Board.sectorIndexFromPoint(null, null)).toEqual(null);
            expect(Board.sectorIndexFromPoint(null, <PolarPoint>{})).toEqual(null);
            expect(Board.sectorIndexFromPoint(board, null)).toEqual(null);
            expect(Board.sectorIndexFromPoint(null, { radius: 0, angle: 0 })).toEqual(null); 
        });

        it('should return correct sector index', () => {
            const sectorIndexFromPoint = Board.sectorIndexFromPoint(board);
            angles.forEach((angle, i) => {
                const point = { radius: 0, angle };
                expect(sectorIndexFromPoint(point)).toEqual(i);
            });
        });        
        
        it('should normalize angles greater than 360 degrees', () => {
            const sectorIndexFromPoint = Board.sectorIndexFromPoint(board);
            angles.forEach((angle, i) => {
                const point = { radius: 0, angle: angle + PI2 };
                const index = sectorIndexFromPoint(point);
                expect(index).toEqual(i);
            });
        });

        it('should normalize angles less than 0', () => {
            const sectorIndexFromPoint = Board.sectorIndexFromPoint(board);
            angles.forEach((angle, i) => {
                const point = { radius: 0, angle: angle - (PI2 * 2) };
                const index = sectorIndexFromPoint(point);
                expect(index).toBe(i);
            });
        });

        it('should return null for OOB', () => {
            expect(Board.sectorIndexFromPoint(board, { radius: 175, angle: 0 })).toEqual(null);
            expect(Board.sectorIndexFromPoint(board, { radius: 190, angle: 0 })).toEqual(null);
            expect(Board.sectorIndexFromPoint(board, { radius: 300, angle: 0 })).toEqual(null);
            expect(Board.sectorIndexFromPoint(board, { radius: Infinity, angle: 0 })).toEqual(null);
        });

        it('should return null for negative radius', () => {
            expect(Board.sectorIndexFromPoint(board, { radius: -1, angle: 0 })).toEqual(null);
            expect(Board.sectorIndexFromPoint(board, { radius: -10, angle: 0 })).toEqual(null);
            expect(Board.sectorIndexFromPoint(board, { radius: -100, angle: 0 })).toEqual(null);
            expect(Board.sectorIndexFromPoint(board, { radius: -200, angle: 0 })).toEqual(null);
        });
    });

    describe('sectorFromPoint', () => {
        it('should return null for nulls', () => {
            expect(Board.sectorFromPoint(null, null)).toEqual(null);
            expect(Board.sectorFromPoint(null, <PolarPoint>{})).toEqual(null);
            expect(Board.sectorFromPoint(board, null)).toEqual(null);
            expect(Board.sectorFromPoint(null, { radius: 0, angle: 0 })).toEqual(null); 
        });

        it('should return correct sector', () => {
            angles.forEach((v, i) => {
                const p = { radius: 0, angle: v };
                expect(Board.sectorFromPoint(board, p)).toEqual(board.sectors[i]);
            });
        });        
        
        it('should normalize angles greater than 360 degrees', () => {
            angles.forEach((v, i) => {
                const p = { radius: 0, angle: v + PI2 };
                expect(Board.sectorFromPoint(board, p)).toEqual(board.sectors[i]);            });
        });

        it('should return null for OOB', () => {
            expect(Board.sectorFromPoint(board, { radius: 175, angle: 0 })).toEqual(null);
            expect(Board.sectorFromPoint(board, { radius: 190, angle: 0 })).toEqual(null);
            expect(Board.sectorFromPoint(board, { radius: 300, angle: 0 })).toEqual(null);
            expect(Board.sectorFromPoint(board, { radius: Infinity, angle: 0 })).toEqual(null);
        });

        it('should return null for negative radius', () => {
            expect(Board.sectorFromPoint(board, { radius: -1, angle: 0 })).toEqual(null);
            expect(Board.sectorFromPoint(board, { radius: -10, angle: 0 })).toEqual(null);
            expect(Board.sectorFromPoint(board, { radius: -100, angle: 0 })).toEqual(null);
            expect(Board.sectorFromPoint(board, { radius: -200, angle: 0 })).toEqual(null);
        });
    });

    describe('sectionFromPoint', () => {
        it('should return null for nulls', () => {
            expect(Board.sectionFromPoint(null, null)).toEqual(null);
            expect(Board.sectionFromPoint(board, null)).toEqual(null);
            expect(Board.sectionFromPoint(board, { angle: null, radius: null})).toEqual(null);
            expect(Board.sectionFromPoint(null, { angle: 0, radius: 0})).toEqual(null);

            expect(Board.sectionFromPoint(undefined, undefined)).toEqual(null);
            expect(Board.sectionFromPoint(board, undefined)).toEqual(null);
            expect(Board.sectionFromPoint(board, { angle: undefined, radius: undefined})).toEqual(null);
            expect(Board.sectionFromPoint(undefined, { angle: 0, radius: 0})).toEqual(null);
        });

        it('should return correct section', () => {
            const sectionFromPoint = Board.sectionFromPoint(board);
            const sectorCount = board.sectors.length;
            radii.forEach((radius, r) => {
                angles.forEach((angle, a) => {
                    const point = { radius, angle };
                    const i = (sectorCount * r) + a;
                    const expected = board.sections[i];
                    const section = sectionFromPoint(point);
                    expect(section).toEqual(expected);
                });
            });
        });
    });

    describe('targetPoint', () => {
        it('should return null for nulls', () => {
            expect(Board.targetPoint(null, null)).toEqual(null);
            expect(Board.targetPoint(board, null)).toEqual(null);
            expect(Board.targetPoint(null, board.sections[0]));
        
            expect(Board.targetPoint(undefined, undefined));
            expect(Board.targetPoint(board, undefined));
            expect(Board.targetPoint(undefined, board.sections[0]));
        });


        it('should return null for off the board', () => {
            const points = [
                { p: { radius: 171, angle: 0 }, s: null },
                { p: { radius: 200, angle: 0 }, s: null },
                { p: { radius: 225, angle: 0 }, s: null }
            ];
            points.forEach(({ p, s }) => {
                expect(Board.targetPoint(board, s)).toEqual(null);
            });
        });

        it('should return the correct point', () => {
            const targetPoint = Board.targetPoint(board);
            const points = [
                { p: { radius: 0, angle: 1.4137 }, s: board.sections[0] },
                { p: { radius: 0, angle: 1.7278 }, s: board.sections[1] },
                { p: { radius: 0, angle: 2.0420 }, s: board.sections[2] },
                { p: { radius: 0, angle: 2.3561 }, s: board.sections[3] },
                { p: { radius: 11.175, angle: 1.4137 }, s: board.sections[20] },
                { p: { radius: 11.175, angle: 1.7278 }, s: board.sections[21] },
                { p: { radius: 11.175, angle: 2.0420 }, s: board.sections[22] },
                { p: { radius: 11.175, angle: 2.3561 }, s: board.sections[23] },
                { p: { radius: 57.50, angle: 1.4137 }, s: board.sections[40] },
                { p: { radius: 57.50, angle: 1.7278 }, s: board.sections[41] },
                { p: { radius: 57.50, angle: 2.0420 }, s: board.sections[42] },
                { p: { radius: 57.50, angle: 2.3561 }, s: board.sections[43] },
                { p: { radius: 103.0, angle: 1.4137 }, s: board.sections[60] },
                { p: { radius: 103.0, angle: 1.7278 }, s: board.sections[61] },
                { p: { radius: 103.0, angle: 2.0420 }, s: board.sections[62] },
                { p: { radius: 103.0, angle: 2.3561 }, s: board.sections[63] },
            ];
            points.forEach(({ p, s }) => {
                const expected = targetPoint(s);
                expect(expected.radius).toBeCloseTo(p.radius);
                expect(expected.angle).toBeCloseTo(p.angle);
            });
        });
    });

    describe('scoreFromSection', () => {
        const getSection = (p, m, start, end) => ({
            ring: { multiplier: m, start, end },
            sector: { value: p }
         });

        it('should return NaN for nulls', () => {
            expect(Board.scoreFromSection(null)).toEqual(NaN);
            expect(Board.scoreFromSection({ ring: null, sector: null })).toEqual(NaN);
            expect(Board.scoreFromSection({ ring: board.rings[0], sector: null })).toEqual(NaN);
            expect(Board.scoreFromSection({ ring: null, sector: board.sectors[0] })).toEqual(NaN);
        });

        it('should return correct points', () => {
            const scores = [
                { points: 20, p: 20, m: 1 },
                { points: 40, p: 20, m: 2 },
                { points: 60, p: 20, m: 3 },
                { points: -60, p: -20, m: 3 },
                { points: 0, p: 0, m: 1 },
                { points: 0, p: 20, m: 0 },
                { points: NaN, p: NaN, m: 3 },
                { points: NaN, p: 20, m: NaN },
                { points: Infinity, p: Infinity, m: 3 },
                { points: Infinity, p: 20, m: Infinity }
            ];
            scores.forEach(score => {
                const section = getSection(score.p, score.m, 0, 100);
                expect(Board.scoreFromSection(section)).toEqual(score.points);
            });
        });

        it('should default multiplier to 1', () => {
            const scores = [
                { points: 20, p: 20, m: null },
                { points: 20, p: 20, m: undefined },
            ];
            scores.forEach(score => {
                const section = getSection(score.p, score.m, 0, 100);
                expect(Board.scoreFromSection(section)).toEqual(score.points);
            });
        });

        it('should use ring points when present', () => {
            const scores = [
                { points: 25, p: 20, rp: 25, m: 1 },
                { points: 50, p: 20, rp: 25, m: 2 }
            ];
            const start = 0, end = 100;
            scores.forEach(score => {
                expect(Board.scoreFromSection({
                    ring: { multiplier: score.m, points: score.rp, start, end },
                    sector: { value: score.p }
                 })).toEqual(score.points);
            });
        });
    });

    describe('hitFromPoint', () => {
        it('should return null for nulls', () => {
            expect(Board.hitFromPoint(null, null)).toEqual(null);
            expect(Board.hitFromPoint(board, null)).toEqual(null);
            expect(Board.hitFromPoint(null, { radius: 0, angle: 0 }));
        
            expect(Board.hitFromPoint(undefined, undefined));
            expect(Board.hitFromPoint(board, undefined));
            expect(Board.hitFromPoint(undefined, { radius: 0, angle: 0 }));
        });


        it('should return correct hit', () => {
            const points = [
                { radius: 0, angle: 0 },
                { radius: 10, angle: 0 },
                { radius: 100, angle: 0 },
                { radius: 150, angle: 0 },
                { radius: 165, angle: 0 },
            ];
            const hitFromPoint = Board.hitFromPoint(board);
            points.forEach((point) => {
                const section = Board.sectionFromPoint(board, point);
                const hit = hitFromPoint(point);
                expect(hit.point).toEqual(point);
                expect(hit.section).toEqual(section);
            });
        });

        it('should return null for off the board', () => {
            const points = [
                { radius: 171, angle: 0 },
                { radius: 200, angle: 0 },
                { radius: 250, angle: 0 },
                { radius: 300, angle: 0 },
                { radius: Infinity, angle: 0 },
            ];
            const hitFromPoint = Board.hitFromPoint(board);
            points.forEach((point) => {
                const section = Board.sectionFromPoint(board, point);
                const hit = hitFromPoint(point);
                expect(hit).toEqual(null);
            });
        });
    });
});
