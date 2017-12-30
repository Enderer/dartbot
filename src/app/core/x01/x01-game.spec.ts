///<reference path="../../../test/immutable.matcher.d.ts"/>
import * as X01 from './x01-game';
import { Score, createScore } from './score';
import { Player, Team } from '../player';
import * as _ from 'lodash';
import { immutableMatcher } from '../../../test/immutable.matcher.spec';

beforeAll(function() {
    jasmine.addMatchers(immutableMatcher);
});

describe('X01Game', () => {
                
    let score1, score2, score3;

    beforeEach(() => {
        score1 = <Score>{
            points: 501,
            team: null,
            current: null,
            turns: [
                { darts: 3, points: 60 },
                { darts: 3, points: 60 },
            ],
        };
    
        score2 = <Score>{
            points: 501,
            team: null,
            current: null,
            turns: [
                { darts: 3, points: 60 },
                { darts: null, points: null },
            ],
        };
    
        score3 = <Score>{
            points: 501,
            team: null,
            current: null,
            turns: [
                { darts: 3, points: 60 },
                <X01.Turn>{ },
            ],
        };
    });

    describe('createTurn', () => {
        it('should default to 0', () => {
            expect(X01.createTurn()).toEqual({ points: 0, darts: 0});
            expect(X01.createTurn(0)).toEqual({ points: 0, darts: 0});
            expect(X01.createTurn(0, 0)).toEqual({ points: 0, darts: 0});
            expect(X01.createTurn(undefined)).toEqual({ points: 0, darts: 0});
            expect(X01.createTurn(undefined, undefined)).toEqual({ points: 0, darts: 0});
        });

        it('should set points and darts', () => {
            expect(X01.createTurn(60, 3)).toEqual({ points: 60, darts: 3});
            expect(X01.createTurn(180, 3)).toEqual({ points: 180, darts: 3});
        });
    });

    describe('getTurns', () => {
        it('should return the turns', () => {
            expect(X01.getTurns(<Score>{ 
                turns: [
                    { points: 60, darts: 3 },
                    { points: 25, darts: 3 }
                ]
            })).toEqual([
                { points: 60, darts: 3 },
                { points: 25, darts: 3 }
            ]);
        });
    });

    describe('lastTurn', () => {
        const score = createScore();
        it('should return null for no turns', () => {
            expect(X01.lastTurn(score)).toEqual(undefined);
        });

        it('should return the last turn', () => {
            expect(X01.lastTurn(<Score>{ 
                turns: [
                    { points: 60, darts: 3 },
                    { points: 25, darts: 3 }
                ]
            })).toEqual({ points: 25, darts: 3 });
        });
    });

    describe('getDarts', () => {
        it('should handle nulls', () => {
            expect(X01.getDarts(null)).toBeNaN();
            expect(X01.getDarts(undefined)).toBeNaN();
        });

        it('should return number of darts', () => {
            const score = <Score>{
                turns: [
                    { darts: 3, points: 0 },
                    { darts: 3, points: 0 },
                ],
            };
            expect(X01.getDarts(score)).toEqual(6);
        });

        it('should return NaN when darts is not numeric', () => {
            const score = <Score>{
                turns: [
                    { darts: 3, points: 0 },
                    { darts: null, points: 0 },
                ],
            };
            expect(X01.getDarts(score)).toBeNaN();
        });
        
        it('should return 0 for no turns', () => {
            expect(X01.getDarts(<Score>{})).toBe(0);
            expect(X01.getDarts(<Score>{ turns: null })).toBe(0);
            expect(X01.getDarts(<Score>{ turns: [] })).toBe(0);
        });
    });

    describe('getPointsHit', () => {
        it('should handle nulls', () => {
            expect(X01.getPointsHit(null)).toBeNaN();
            expect(X01.getPointsHit(undefined)).toBeNaN();
        });

        it('should return 0 for no turns', () => {
            expect(X01.getPointsHit(<Score>{})).toBe(0);
            expect(X01.getPointsHit(<Score>{ turns: null })).toBe(0);
            expect(X01.getPointsHit(<Score>{ turns: [] })).toBe(0);
        });

        it('should return number of points hit', () => {
            expect(X01.getPointsHit(score1)).toBe(120);
        });

        it('should return NaN for invalid points', () => {
            expect(X01.getPointsHit(score2)).toBeNaN();
            expect(X01.getPointsHit(score3)).toBeNaN();
        });
    });

    describe('getPointsLeft', () => {
        it('should handle nulls', () => {
            expect(X01.getPointsLeft(null)).toBeNaN();
            expect(X01.getPointsLeft(undefined)).toBeNaN();
        });

        it('should return starting points for no turns', () => {
            expect(X01.getPointsLeft(<Score>{ points: 501})).toBe(501);
            expect(X01.getPointsLeft(<Score>{ points: 501, turns: null })).toBe(501);
            expect(X01.getPointsLeft(<Score>{ points: 501, turns: [] })).toBe(501);
        });

        it('should return number of points hit', () => {
            expect(X01.getPointsLeft(score1)).toBe(381);
        });

        it('should return NaN for invalid points', () => {
            expect(X01.getPointsLeft(score2)).toBeNaN();
            expect(X01.getPointsLeft(score3)).toBeNaN();
        });
    });

    describe('getPointsLastTurn', () => {
        it('should handle nulls', () => {
            expect(X01.getPointsLastTurn(null)).toBeNaN();
            expect(X01.getPointsLastTurn(undefined)).toBeNaN();
        });

        it('should return 0 for no turns', () => {
            expect(X01.getPointsLastTurn(<Score>{})).toBe(0);
            expect(X01.getPointsLastTurn(<Score>{ turns: null })).toBe(0);
            expect(X01.getPointsLastTurn(<Score>{ turns: [] })).toBe(0);
        });

        it('should return number of points from the last turn', () => {
            expect(X01.getPointsLastTurn(score1)).toBe(60);
        });

        it('should return NaN for invalid points', () => {
            expect(X01.getPointsLastTurn(score2)).toBeNaN();
        });
    });

    describe('getCurrentPlayer', () => {
        it('should handle nulls', () => {
            expect(X01.getCurrentPlayer(null)).toBeNull();
            expect(X01.getCurrentPlayer(<Score>{})).toBeNull();
            expect(X01.getCurrentPlayer(<Score>{ team: <Team>{}})).toBeNull();
            expect(X01.getCurrentPlayer(<Score>{ team: { players: []}})).toBeNull();
            expect(X01.getCurrentPlayer(<Score>{ team: { players: []}})).toBeNull();
        });

        it('should return first player when there are no turns', () => {
            const player1: Player = { name: 'one' };
            const player2: Player = { name: 'two' };
            const players = [player1, player2];
            expect(X01.getCurrentPlayer(<Score>{ team: { players}})).toBe(player1);
            expect(X01.getCurrentPlayer(<Score>{ team: { players}, turns: []})).toBe(player1);
        });

        it('should return second player when there is one turns', () => {
            const player1: Player = { name: 'one' };
            const player2: Player = { name: 'two' };
            const players = [player1, player2];
            expect(X01.getCurrentPlayer(<Score>{ team: { players }, turns: [{ darts: 3, points: 60}]})).toBe(player2);
        });
    });

});
