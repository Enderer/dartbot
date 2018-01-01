import { Score } from '../../x01/score';
import { getPointsHit, getPointsLeft } from '../../x01/x01-game';

/**
 * Returns true if the current score is won.
 * All points have been scored and turn has finished
 * @param score Score to check for a win
 */
export const isWon = (score: Score): boolean => {
    if (score == null) { return false; }
    const pointsLeft = getPointsLeft(score);
    return (!score.isPending && pointsLeft === 0);
};
