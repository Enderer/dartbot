import { isWon, Score, createScore, addPoints, endTurn } from '../../x01/score';

describe('isWon', () => {
    it('should handle nulls', () => {
        expect(isWon(null)).toBe(false);
        expect(isWon(<Score>{})).toBe(false);
        expect(isWon(<Score>{})).toBe(false);
    });

    it('should be false when points are still needed', () => {
        let score = createScore();
        score = addPoints(score, 60, 3);
        score = endTurn(score);
        expect(isWon(score)).toBe(false);
    });

    it('should be false when turn is in progress', () => {
        let score = createScore({ points: 501 });
        score = addPoints(score, 501, 25);
        expect(isWon(score)).toBe(false);
    });  

    it('should be true when all points are scored', () => {
        let score = createScore({ points: 501 });
        score = addPoints(score, 501, 25);
        score = endTurn(score);
        expect(isWon(score)).toBe(true);
    });

    it('should be false when points are greater than needed', () => {
        let score = createScore({ points: 501 });
        score = addPoints(score, 601, 25);
        score = endTurn(score);
        expect(isWon(score)).toBe(false);
    });
});
