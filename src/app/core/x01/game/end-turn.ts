import { Game, getScoreByTeam, setScore } from '../game';
import { Score } from '../../x01';
import { Team } from '../../player';

/**
 * End the turn for the given team
 * @param game X01 game
 * @param team Team to end the turn for
 */
export const endTurn = (game: Game, team: Team): Game => {
    const score = getScoreByTeam(game, team);
    const nextScore = Score.endTurn(score);
    if (nextScore == null) { return game; }
    return setScore(game, team, nextScore);
};
