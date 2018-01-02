import { createGame } from './create-game';
import { Game } from '.';
import { Score } from '../score';

describe('createGame', () => {
    it('should handle nulls', () => {
        expect(createGame(null)).toEqual({
            doubleIn: false,
            doubleOut: true,
            scores: []
        });
        expect(createGame()).toEqual({
            doubleIn: false,
            doubleOut: true,
            scores: []
        });
    });

    it('should create a game', () => {
        const defaultGame: Game = {
            doubleIn: true,
            doubleOut: true,
            scores: [<Score>{
                points: 501,
                isPending: false,
                turns: [],
                team: {
                    players: [
                        { name: 'player one' }
                    ]
                }
            }]
        };

        expect(createGame({ 
            points: 501,
            doubleIn: true, 
            doubleOut: true,
            teams: [
                {
                    players: [
                        { name: 'player one' }
                    ]
                }
            ]
        })).toEqual(defaultGame);
    });
});
