import { Game } from '../../x01/game';
import { Score } from '../../x01/score';
import { Team } from '../../player';
import * as R from 'ramda';

/**
 * Set the score for the given team. Replace the existing score
 * @param game X01 game
 * @param team Team to set the score for
 * @param score Updated score
 */
export const setScore = (game: Game, team: Team, score: Score) => {
    const scoreIndex = game.scores.findIndex(s => s.team === team);
    const scores = R.update(scoreIndex, score, game.scores);
    return { ...game, scores };
};
