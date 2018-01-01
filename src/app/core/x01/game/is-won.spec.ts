import { isWon } from './is-won';
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

describe('isWon', () => {
    it('should handle nulls', () => {
        expect(isWon(null)).toBe(false);
        expect(isWon(undefined)).toBe(false);
        expect(isWon(<Game>{})).toBe(false);
    });

    it('should be true if a score is won', () => {
        let game = createGame({ points: 501, teams });
        game = addPoints(game, game.scores[0].team, 501, 25);
        game = endTurn(game, game.scores[0].team);
        expect(isWon(game)).toBe(true);
    });

    it('should be false if a score is not won', () => {
        let game = createGame({ points: 501, teams });
        game = addPoints(game, game.scores[0].team, 301, 25);
        game = endTurn(game, game.scores[0].team);
        expect(isWon(game)).toBe(false);
    });
});
