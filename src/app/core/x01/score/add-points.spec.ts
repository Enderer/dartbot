import { addPoints } from './add-points';
import { Score, createScore } from '../score';

describe('addPoints', () => {
  it('should handle null score', () => {
      expect(addPoints(null, null, null)).toBeNull();
      expect(addPoints(undefined, null, null)).toBeUndefined();
  });

  it('should handle null points', () => {
      const s1 = <Score>{ turns: [{ points: 60, darts: 3 } ]};
      const s2 = addPoints(s1, null, null);
      expect(s2).toBe(s2);
  });

  it('should add a current turn, when one doesn\'t exist', () => {
      const score = addPoints(<Score>{}, 20, 1);
      expect(score.turns).toEqual([{ points: 20, darts: 1 }]);
      expect(score.isPending).toEqual(true);
  });

  it('should add points', () => {
      let score = createScore();
      score = addPoints(score, 20, 1);
      score = addPoints(score, 20, 1);
      score = addPoints(score, 20, 1);

      expect(score.turns).toEqual([{ points: 60, darts: 3 }]);
      expect(score.isPending).toEqual(true);
  });

  it('should be immutable', () => {
      expect(addPoints).toBeImmutable([createScore(), 100, 2]);
  });

});
