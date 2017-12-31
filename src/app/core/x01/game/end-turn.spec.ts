import { endTurn } from './end-turn';
import { Player, Team } from '../../player';
import { Game, createGame, getScoreByTeam } from '../game';
import { addPoints } from './add-points';
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

describe('endTurn', () => {    
    
    it('should end the in progress turn', () => {
        let game = games[0];
        game = addPoints(game, teams[0], 60, 3);
        game = endTurn(game, teams[0]);
        const score = getScoreByTeam(game, teams[0]);
        expect(getPointsHit(score)).toEqual(60);
        expect(getDarts(score)).toEqual(3);
        expect(getPointsHit(getScoreByTeam(game, teams[1]))).toEqual(0);
        expect(getDarts(getScoreByTeam(game, teams[1]))).toEqual(0);
    });

    it('should end the in progress turn', () => {
        let game = games[0];
        const team = game.scores[0].team;
        game = endTurn(game, team);
        const score = getScoreByTeam(game, team);
        expect(score.turns.length).toBe(0);
        expect(score.isPending).toBe(false);
    });

    it('should handle nulls', () => {
        expect(endTurn(null, null)).toBeNull();
        expect(endTurn(undefined, undefined)).toEqual(undefined);
    });

    it('should make no change when team is not part of game', () => {
        expect(endTurn(games[0], teams[5])).toBe(games[0]);
        expect(endTurn(games[0], null)).toBe(games[0]);
        expect(endTurn(games[0], teams[5])).toBe(games[0]);
    });
});
