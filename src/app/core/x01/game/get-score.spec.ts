import { getScore } from './get-score';
import { createGame, Game } from '.';
import { Team, Player } from '../../player';

describe('getScore', () => {

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
        expect(getScore(games[0], teams[0])).toBe(games[0].scores[0]);
        expect(getScore(games[0], teams[1])).toBe(games[0].scores[1]);
    });

    it('should handle nulls', () => {
        expect(getScore(null, null)).toBeNull();
        expect(getScore(undefined, undefined)).toBeNull();
        expect(getScore(games[0], null)).toBeNull();
        expect(getScore(games[0], undefined)).toBeNull();
        expect(getScore(null, teams[0])).toBeNull();
        expect(getScore(undefined, teams[0])).toBeNull();
    });

    it('should return null for no scores', () => {
        expect(getScore(<Game>{}, teams[0])).toBeNull();
        expect(getScore(<Game>{ scores: []}, teams[0])).toBeNull();
    });

    it('should return null when team is not present', () => {
        expect(getScore(games[0], teams[2])).toBeNull();
        expect(getScore(games[1], teams[0])).toBeNull();
    });
});
