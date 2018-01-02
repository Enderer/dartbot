import { getLastTurn, getPointsLastTurn } from './get-last-turn';
import { Score, createScore, addPoints } from '../score';

describe('getLastTurn', () => {
    it('should get the last turn', () => {
        let score = createScore();
        score = addPoints(score, 60, 3);
        const turn = getLastTurn(score);
        expect(turn.points).toEqual(60);
        expect(turn.darts).toEqual(3);
    });

    it('should return null for no turns', () => {
        expect(getLastTurn(createScore())).toBeNull();
    });

    it('should handle nulls', () => {
        expect(getLastTurn(null)).toBeNull();
        expect(getLastTurn(undefined)).toBeNull();
        expect(getLastTurn(<Score>{})).toBeNull();
    });
});

describe('getPointsLastTurn', () => {
    it('should return correct points', () => {
        let score = createScore();
        score = addPoints(score, 60, 3);
        const points = getPointsLastTurn(score);
        expect(points).toEqual(60);
    });

    it('should return null for no turns', () => {
        expect(getPointsLastTurn(createScore())).toBeUndefined();
    });

    it('should handle nulls', () => {
        expect(getPointsLastTurn(null)).toBeUndefined();
        expect(getPointsLastTurn(undefined)).toBeUndefined();
        expect(getPointsLastTurn(<Score>{})).toBeUndefined();
    });
});
