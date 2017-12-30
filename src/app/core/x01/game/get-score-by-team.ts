import { Game } from '../game';
import { Score } from '../score';
import { Team } from '../../player';

/**
 * Gets the score for the given team
 * @param game X01 game that contains scores
 * @param team Team that a score should be returned for
 */
export const getScoreByTeam = (game: Game, team: Team): Score => {
    if (game == null || game.scores == null) { return null; }
    if (team == null) { return null; }
    const score = game.scores.find(s => s.team === team);
    return score || null;
};
