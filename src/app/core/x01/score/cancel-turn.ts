import { Score } from '../../x01/score';

/**
 * Cancels the most recent turn for a given score
 * @param score Score to cancel the turn from
 */
export const cancelTurn = (score: Score): Score => {
    // If the score is null or has no turns, return the input
    if (score == null) { return score; }
    if (!(score.turns && score.turns.length > 0)) {
        return score;
    }

    // Remove the the last turn and set isPending to false
    const turns = score.turns.slice(0, -1);
    return { ...score, turns, isPending: false };
};
