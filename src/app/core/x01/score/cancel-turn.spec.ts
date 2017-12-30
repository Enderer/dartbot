import { Score, createScore, cancelTurn, addPoints, endTurn } from '../../x01/score';
import { getPointsHit } from '../x01-game';

describe('cancelTurn', () => {
    it('should cancel in progress turns', () => {
        let score = createScore();
        score = addPoints(score, 60, 3);
        score = endTurn(score);
        score = addPoints(score, 60, 3);

        expect(score.isPending).toEqual(true);
        expect(getPointsHit(score)).toEqual(120);
        score = cancelTurn(score);
        expect(score.isPending).toBe(false);
        expect(getPointsHit(score)).toEqual(60);
    });

    it('should cancel completed turns', () => {
        let score = createScore();
        score = addPoints(score, 60, 3);
        score = endTurn(score);
        score = addPoints(score, 60, 3);
        score = endTurn(score);

        expect(score.isPending).toEqual(false);
        expect(getPointsHit(score)).toEqual(120);
        score = cancelTurn(score);
        expect(score.isPending).toBe(false);
        expect(getPointsHit(score)).toEqual(60);
    });

    it('should handle no turns', () => {
        const score = createScore();
        const newScore = cancelTurn(score);
        expect(score.isPending).toBe(false);
        expect(score.turns.length).toBe(0);
    });

    it('should handle null score', () => {
        expect(cancelTurn(null)).toBeNull();
        expect(cancelTurn(<Score>{})).toEqual(<Score>{});
    });

    it('should be immutable', () => {
        let score = createScore();
        score = addPoints(score, 60, 3);
        score = endTurn(score);
        expect(cancelTurn).toBeImmutable([score]);
    });
});
