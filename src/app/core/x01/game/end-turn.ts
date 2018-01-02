import { Game, getScore, setScore } from '../game';
import { Score } from '../../x01';
import { Team } from '../../player';
import * as R from 'ramda';

/**
 * End the turn for the given team
 * @param game X01 game
 * @param team Team to end the turn for
 */
export const endTurn = (game: Game, team: Team): Game => {
    const score = getScore(game, team);
    if (score == null) { return game; }
    const nextScore = Score.endTurn(score);
    return setScore(game, team, nextScore);
};
