import { Score  } from '../score';
import { Turn } from '../x01-game';
import * as _ from 'lodash';
import * as R from 'ramda';

/**
 * Get the last turn taken for this score
 * @param score X01 score
 */
export const getLastTurn = (score: Score): Turn => {
    if (score == null) { return null; }
    if (!_.isArray(score.turns)) { return null; }
    return _.last(score.turns) || null;
};

/**
 * Get the number of points scored last turn
 */
export const getPointsLastTurn = R.pipe(getLastTurn, R.path<number>(['points']));
