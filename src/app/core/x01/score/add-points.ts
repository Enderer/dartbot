import { Score } from '../score';
import { createTurn, lastTurn } from '../x01-game';
import * as R from 'ramda';

/**
 * Add points and darts to the current turn
 * @param score Score to add points to
 * @param points Points to add to the current score
 * @param darts Number of darts used to score the given points
 */
export const addPoints = R.curry((
    score: Score, 
    points: number, 
    darts: number
): Score => {

    points = points || 0;
    darts = darts || 0;

    // If the score is null return the score
    if (score == null) { return score; }

    // If points are darts are 0 then make no change
    if (!(points > 0 || darts > 0)) { return score; }
    
    let { isPending, turns } = score;
    turns = turns || [];

    // No turn is in progress, start a new one
    if (!isPending) {
        isPending = true;
        turns = [...turns, { points: 0, darts: 0 }];
    }

    // No turns exist, create a new one
    if (!(turns && turns.length > 0)) {
        turns = [{ points: 0, darts: 0 }];
    }

    // Get the current turn and add points to it
    const currentTurn = R.last(turns);
    const d = currentTurn.darts + darts;
    const p = currentTurn.points + points;
    const turn = { ...currentTurn, points: p, darts: d };
    const i = turns.length - 1;
    turns = R.update(i, turn, turns);
    return { ...score, turns, isPending };
});
