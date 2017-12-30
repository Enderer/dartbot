import { Score } from '../../x01/score';

/**
 * Ends the in-progress turn and adds it to the turn list
 */
export const endTurn = (score: Score): Score => {
    if (score && score.isPending) { 
        return { ...score, isPending: false }; 
    }
    return score;
};
