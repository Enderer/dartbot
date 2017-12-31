import { Player, Team } from '../../player';
import { Game } from './game';
import { setScore } from './set-score';
import { getScoreByTeam } from './get-score-by-team';
import { addPoints as addPointsToScore } from '../../x01/score';
import * as R from 'ramda';

/**
 * Add points to a teams score
 * @param game Current X01 game
 * @param team Team to add points for
 * @param points Number of points to add
 * @param darts Number of darts to add
 */
export const addPoints = (game: Game, team: Team, points: number, darts: number): Game => {
    const score = getScoreByTeam(game, team);
    const nextScore = addPointsToScore(score, points, darts);
    if (nextScore == null) { return game; }
    return setScore(game, team, nextScore);
};
