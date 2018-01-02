import { setScore } from './set-score';
import { Game, createGame } from '../game';
import { Score, createScore } from '../score';
import { Team } from '../../player';

describe('setScore', () => {
    it('should update the score for the correct team', () => {
        const game = createGame({ teams: [
            { players: [{ name: 'one' }, { name: 'two' }]},
            { players: [{ name: 'three' }, { name: 'four' }]}
        ]});
        const score1 = game.scores[0];
        const score2 = createScore();
        const nextGame = setScore(game, game.scores[0].team, score2);
        expect(nextGame.scores[0]).toBe(score2);
        expect(nextGame.scores[0]).not.toBe(score1);
    });

    it('should handle nulls', () => {
        expect(setScore(null, null, null)).toBeNull();
        expect(setScore(undefined, undefined, undefined)).toBeUndefined();
        expect(setScore(<Game>{}, <Team>{}, <Score>{})).toEqual({});
    });
});
