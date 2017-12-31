import { addPoints } from './add-points';
import { Player, Team } from '../../player';
import { Game, createGame, getScoreByTeam } from '../game';
import { getPointsHit, getDarts } from '../x01-game';

let players: Player[], teams: Team[], games: Game[];

beforeEach(() => {
    players = [
        { name: 'one' },
        { name: 'two' },
        { name: 'three' },
        { name: 'four' },
        { name: 'five' }
    ];
    
    teams = [
        { players: [players[0], players[1]] },
        { players: [players[2], players[3]] },
        { players: [players[4]] }
    ];
    
    games = [
        createGame({ teams: [teams[0], teams[1]] })
    ];
});

describe('addPoints', () => {    
    
    it('should add points to the correct score', () => {
        const game = addPoints(games[0], teams[0], 60, 3);
        const score = getScoreByTeam(game, teams[0]);
        expect(getPointsHit(score)).toEqual(60);
        expect(getDarts(score)).toEqual(3);
        expect(getPointsHit(getScoreByTeam(game, teams[1]))).toEqual(0);
        expect(getDarts(getScoreByTeam(game, teams[1]))).toEqual(0);
    });

    it('should handle nulls', () => {
        expect(addPoints(null, null, null, null)).toBeNull();
        expect(addPoints(undefined, undefined, undefined, undefined)).toEqual(undefined);
    });


    it('should make no change when team is not part of game the', () => {
        expect(addPoints(games[0], teams[5], 60, 3)).toBe(games[0]);
        expect(addPoints(games[0], null, 60, 3)).toBe(games[0]);
        expect(addPoints(games[0], teams[5], null, null)).toBe(games[0]);
    });
});
