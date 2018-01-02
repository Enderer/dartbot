import { Player, Team } from '../../player';
import { Game } from './game';
import { setScore } from './set-score';
import { getScore } from './get-score';
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
    const score = getScore(game, team);
    if (score == null) { return game; }
    const nextScore = addPointsToScore(score, points, darts);
    return setScore(game, team, nextScore);
};
// export const addPoints = (game: Game, team: Team, points: number, darts: number): Game => {
//     const h = R.compose(setScore(game, team), addPointsToScore(getScore(game, team)));
//     return h(points, darts);
// };
