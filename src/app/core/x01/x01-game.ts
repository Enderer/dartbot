import * as R from 'ramda';
import * as _ from 'lodash';
import { curry } from 'ramda';
import { Player, Team } from '../player';
import { Game } from './';
import { Score } from './score';

/** One turn by a player of an X01 game */
export interface Turn {
    /** Points hits this turn */
    points: number;
    /** Darts thrown this turn */
    darts: number;
}

/** Initializes a turn */
export const createTurn = (points = 0, darts = 0): Turn => {
    return { points, darts };
};

/**
 * Get turns from a score
 */
export const getTurns = R.prop('turns');

/**
 * Get the most recent turn from a score
 */
export const lastTurn = R.pipe<Score, Turn[], Turn>(getTurns, R.last);

/** Gets the total number of darts thrown */
export const getDarts = (score: Score): number => {
    const a = R.pipe<Score, Turn[], Turn[], any, number[], number>(
        R.path(['turns']),
        R.ifElse(R.isNil, R.always([]), R.identity),
        R.map(R.prop('darts')),
        // R.reject(R.isNil),
        R.map(R.ifElse(R.is(Number), R.identity, R.always(NaN))),
        R.sum
    );

    const b = R.ifElse(R.isNil, R.always(NaN), a);
    const darts = b(score);
    return darts;
};

/** Gets the total points hit  */
export const getPointsHit = (score: Score): number => {
    if (score == null) { return NaN; }
    const turns = score.turns || [];

    const a = R.pipe<Turn[], number[], number[], number>(
        R.map(t => t.points),
        R.map(R.ifElse(R.is(Number), R.identity, R.always(NaN))),
        R.sum
    );
    return a(turns);
};

/** Gets the remaining points that need to be hit */
export const getPointsLeft = (score: Score): number => { 
    if (score == null) { return NaN; }
    const startPoints = score.points;
    const pointsHit = getPointsHit(score);
    return startPoints - pointsHit;
};

/** Gets the number of points hit on the last turn */
export const getPointsLastTurn = (score: Score): number => {
    if (score == null) { return NaN; }
    if (score.turns == null || _.isEmpty(score.turns)) { return 0; }
    const turn = lastTurn(score);
    if (turn.points == null) { return NaN; }
    return turn.points;
};

/** Get the player whos turn it is for a given score */
export const getCurrentPlayer = (score: Score): Player => {
    const players = R.path<Player[]>(['team', 'players'], score);
    const isEmpty = R.isEmpty(players);
    if (players == null || isEmpty) { return null; }
    const turns = R.path<Turn[]>(['turns'], score) || [];
    const p = turns.length % players.length;
    return score.team.players[p];
};
