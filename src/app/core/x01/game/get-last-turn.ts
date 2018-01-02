import { Game, getScore } from '../game';
import { getLastTurn as getLastTurnFromScore } from '../score';
import { getPointsLastTurn as getPointsLastTurnFromScore } from '../score';
import { Team } from '../../player';
import * as R from 'ramda';

// export const getLastTurn = (game: Game, team: Team): Score => {};
export const getLastTurn = R.curry(R.pipe(getScore, getLastTurnFromScore));
export const getPointsLastTurn = R.curry(R.pipe(getScore, getPointsLastTurnFromScore));
