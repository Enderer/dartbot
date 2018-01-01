import { Game } from '../../x01/game';
import { isWon as isScoreWon } from '../../x01/score';
import * as R from 'ramda';

/**
 * Returns true if the game has been won by a team
 * @param game X01 game
 */
export const isWon = (game: Game): boolean => {
    if (game == null) { return false; }
    if (!(R.type(game.scores) === 'Array')) { return false; }
    const score = findWon(game.scores);
    return !!score;
};

const findWon = R.find(isScoreWon);
