import { endTurn, Score, createScore, addPoints } from '../../x01/score';

describe('endTurn', () => {
  it('should handle nulls', () => {
      expect(endTurn(null)).toBeNull();
  });

  it('should end the current turn', () => {
      let score = createScore();
      score = addPoints(score, 60, 3);
      score = endTurn(score);
      expect(score.isPending).toEqual(false);
      expect(score.turns).toEqual([
          { points: 60, darts: 3 }
      ]);
  });

  it('should return same score when there are no turns', () => {
      const score = <Score>{};
      expect(score).toBe(score);
  });

  it('should set isPending to false when there are no turns', () => {
    const score = <Score>{ isPending: true };
    expect(endTurn(score).isPending).toBe(false);
  });

  it('should be immutable', () => {
      const score = createScore();
      expect(endTurn).toBeImmutable([score]);
  });
});
