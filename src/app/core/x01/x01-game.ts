import * as R from 'ramda';
import * as _ from 'lodash';
import { curry } from 'ramda';

export interface Player {
    name: string;
}

export interface Team {
    players: Player[];
}

/** One turn by a player of an X01 game */
export interface Turn {
    /** Points hits this turn */
    points: number;
    /** Darts thrown this turn */
    darts: number;
}

/** Score of an X01 game for a single team */
export interface Score {
    /** Team this score is recording for */
    team: Team;
    /** Number of starting points */
    points: number;
    /** List of turns taken by this team */
    turns: Turn[];
    /** Current turn in progress  */
    current: Turn;
}

/** Game state for an X01 game */
export interface X01Game {
    /** List of scores for each team playing the game */
    scores: Score[];
    /** True if double in is required */
    doubleIn: boolean;
    /** True if double out is requried */
    doubleOut: boolean;
}

/** Initializes a turn */
export const createTurn = (points = 0, darts = 0): Turn => {
    return { points, darts };
};

/** Initializes a score */
export const createScore = (points = 0): Score => {
    return { 
        team: null, 
        points, 
        turns: [], 
        current: null 
    };
};

/**
 * Get turns from a score
 */
export const getTurns = R.prop('turns');

/**
 * Get the most recent turn from a score
 */
export const lastTurn = R.pipe<Score, Turn[], Turn>(getTurns, R.last);

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

    if (score == null) { return null; }
    if (!(points > 0 || darts > 0)) { return score; }
    
    const c = score.current || createTurn();
    const d = c.darts + darts;
    const p = c.points + points;
    const current = { ...c, points: p, darts: d };

    return { ...score, current };
});

/**
 * Ends the in-progress turn and adds it to the turn list
 */
export const endTurn = (score: Score): Score => {
    if (score == null) { return null; }
    const current = score.current || { darts: 0, points: 0 };
    const oldTurns = score.turns || [];

    const turns = [...oldTurns, current];
    return { ...score, current: null, turns };
};

/**
 * Cancels the most recent turn for a given score
 * @param score Score to cancel the turn from
 */
export const cancelTurn = (score: Score): Score => {
    if (score == null) { return score; }

    // Cancel the in progress turn
    if (score.current && score.current.darts > 0) {
        return { ...score, current: null  };
    } 
    // Cancel the last completed turn
    if (score.turns && score.turns.length > 0) {
        return { ...score, turns: R.dropLast(1, score.turns) }; 
    }
    return score;
};

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
