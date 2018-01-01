import { Team } from '../../player';
import { Game } from '../../x01/game';
import { isWon } from '../../x01/score';
import * as R from 'ramda';

/**
 * Returns the team that has won the game.
 * Returns null if no team has won.
 * @param game X01 game
 */
export const getWinner = (game: Game): Team => {
    if (game == null) { return null; }
    if (!(R.type(game.scores) === 'Array')) { return null; }
    const score = game.scores.find(s => isWon(s));
    return score ? score.team || null : null;
};

const findWon = R.find(isWon);
