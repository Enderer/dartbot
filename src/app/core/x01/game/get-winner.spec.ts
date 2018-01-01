import { getWinner } from './get-winner';
import { Game, createGame, addPoints, endTurn } from '../game';

const players = [
    { name: 'one' },
    { name: 'two' },
    { name: 'three' },
    { name: 'four' }
];

const teams = [
    { players: [players[0], players[1]] },
    { players: [players[2], players[3]] }
];

describe('getWinner', () => {
    it('should handle nulls', () => {
        expect(getWinner(null)).toBe(null);
        expect(getWinner(undefined)).toBe(null);
        expect(getWinner(<Game>{})).toBe(null);
    });

    it('should return the winning team if a game is won', () => {
        let game = createGame({ points: 501, teams });
        game = addPoints(game, game.scores[0].team, 501, 25);
        game = endTurn(game, game.scores[0].team);
        expect(getWinner(game)).toBe(teams[0]);
    });

    it('should be null if the game is not won', () => {
        let game = createGame({ points: 501, teams });
        game = addPoints(game, game.scores[0].team, 401, 25);
        game = endTurn(game, game.scores[0].team);
        expect(getWinner(game)).toBeNull();
    });
});
