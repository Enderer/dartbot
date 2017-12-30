import { getScoreByTeam } from './get-score-by-team';
import { createGame, Game } from '.';
import { Team, Player } from '../../player';

describe('getScoreByTeam', () => {

let players: Player[], teams: Team[], games: Game[];

    beforeEach(() => {
        players = [
            { name: 'one' },
            { name: 'two' },
            { name: 'three' },
            { name: 'four' }
        ];
        
        teams = [
            { players: [players[0], players[1]]},
            { players: [players[2], players[3]]},
        ];
        
        games = [
            createGame({ teams: [teams[0], teams[1]] })
        ];
    });

    it('should return the correct score', () => {
        expect(getScoreByTeam(games[0], teams[0])).toBe(games[0].scores[0]);
        expect(getScoreByTeam(games[0], teams[1])).toBe(games[0].scores[1]);
    });

    it('should handle nulls', () => {
        expect(getScoreByTeam(null, null)).toBeNull();
        expect(getScoreByTeam(undefined, undefined)).toBeNull();
        expect(getScoreByTeam(games[0], null)).toBeNull();
        expect(getScoreByTeam(games[0], undefined)).toBeNull();
        expect(getScoreByTeam(null, teams[0])).toBeNull();
        expect(getScoreByTeam(undefined, teams[0])).toBeNull();
    });

    it('should return null for no scores', () => {
        expect(getScoreByTeam(<Game>{}, teams[0])).toBeNull();
        expect(getScoreByTeam(<Game>{ scores: []}, teams[0])).toBeNull();
    });

    it('should return null when team is not present', () => {
        expect(getScoreByTeam(games[0], teams[2])).toBeNull();
        expect(getScoreByTeam(games[1], teams[0])).toBeNull();
    });
});
