import { PolarPoint, getCartesian, getFromCartesian, addPoints } from './polar-point';

describe('PolarPoint', () => {
    describe('getCartesian', () => {
        it('should calculate (0, 0)', () => {
            expect(getCartesian({ radius: 0, angle: 0 })).toEqual({ x: 0, y: 0 });
        });

        it('should handle null and undefined', () => {
            expect(getCartesian({ radius: null, angle: null })).toEqual({ x: 0, y: 0 });
            expect(getCartesian({ radius: undefined, angle: undefined })).toEqual({ x: NaN, y: NaN });
        });

        it('should calculate correct cartesian points', () => {
            let point = getCartesian({ radius: 100, angle: 2 * Math.PI });
            expect(point.x).toBeCloseTo(100);
            expect(point.y).toBeCloseTo(0);

            point = getCartesian({ radius: 100, angle: Math.PI });
            expect(point.x).toBeCloseTo(-100);
            expect(point.y).toBeCloseTo(0);

            point = getCartesian({ radius: 100, angle: Math.PI / 2 });
            expect(point.x).toBeCloseTo(0);
            expect(point.y).toBeCloseTo(100);

            point = getCartesian({ radius: 100, angle: Math.PI / 4 });
            expect(point.x).toBeCloseTo(70.7, .1);
            expect(point.y).toBeCloseTo(70.7, .1);
        });
    });

    describe('getFromCartesian', () => {
        it('should handle null and undefind', () => {
            expect(getFromCartesian(null, null)).toEqual({ radius: 0, angle: 0 });
            expect(getFromCartesian(undefined, undefined)).toEqual({ radius: NaN, angle: NaN });
        });

        it('should calculate correct polar points', () => {
            expect(getFromCartesian(100, 0)).toEqual({ radius: 100, angle: 0 });
            expect(getFromCartesian(0, 100)).toEqual({ radius: 100, angle: Math.PI / 2 });
            expect(getFromCartesian(0, -100)).toEqual({ radius: 100, angle: Math.PI * 1.5 });
        });
    });

    describe('addPoints', () => {
        const p1 = { angle: 0, radius: 0 };
        const p2 = { angle: 0, radius: 100 };
        const p3 = { angle: 0, radius: -100 };
        const p4 = { angle: Math.PI, radius: 100 };

        it('should handle null and undefind', () => {
            expect(addPoints(p1, p1)).toEqual({ radius: 0, angle: 0 });
            expect(addPoints(p1, p2)).toEqual({ radius: 100, angle: 0 });
            expect(addPoints(p2, p1)).toEqual({ radius: 100, angle: 0 });
            expect(addPoints(p3, p1)).toEqual({ radius: 100, angle: Math.PI });
            const point = addPoints(p2, p4);
            expect(point.angle).toBeCloseTo(Math.PI / 2);
            expect(point.radius).toBeCloseTo(0);
        });
    });
});
