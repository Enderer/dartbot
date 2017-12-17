/// <reference path="./immutable.matcher.d.ts"/>
import * as X01Game from './x01-game';
import * as _ from 'lodash';
import { immutableMatcher } from './immutable.matcher';

beforeAll(function(){
    jasmine.addMatchers(immutableMatcher);
});

describe('X01Game', () => {
                
    let score1, score2, score3;

    beforeEach(() => {
        score1 = <X01Game.Score>{
            points: 501,
            team: null,
            current: null,
            turns: [
                { darts: 3, points: 60 },
                { darts: 3, points: 60 },
            ],
        };
    
        score2 = <X01Game.Score>{
            points: 501,
            team: null,
            current: null,
            turns: [
                { darts: 3, points: 60 },
                { darts: null, points: null },
            ],
        };
    
        score3 = <X01Game.Score>{
            points: 501,
            team: null,
            current: null,
            turns: [
                { darts: 3, points: 60 },
                <X01Game.Turn>{ },
            ],
        };
    });
    
    describe('createTurn', () => {
        it('should default to 0', () => {
            expect(X01Game.createTurn()).toEqual({ points: 0, darts: 0});
            expect(X01Game.createTurn(0)).toEqual({ points: 0, darts: 0});
            expect(X01Game.createTurn(0, 0)).toEqual({ points: 0, darts: 0});
            expect(X01Game.createTurn(undefined)).toEqual({ points: 0, darts: 0});
            expect(X01Game.createTurn(undefined, undefined)).toEqual({ points: 0, darts: 0});
        });

        it('should set points and darts', () => {
            expect(X01Game.createTurn(60, 3)).toEqual({ points: 60, darts: 3});
            expect(X01Game.createTurn(180, 3)).toEqual({ points: 180, darts: 3});
        });
    });

    describe('getTurns', () => {
        it('should return the turns', () => {
            expect(X01Game.getTurns(<X01Game.Score>{ 
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
        const score = X01Game.createScore();
        it('should return null for no turns', () => {
            expect(X01Game.lastTurn(score)).toEqual(undefined);
        });

        it('should return the last turn', () => {
            expect(X01Game.lastTurn(<X01Game.Score>{ 
                turns: [
                    { points: 60, darts: 3 },
                    { points: 25, darts: 3 }
                ]
            })).toEqual({ points: 25, darts: 3 });
        });
    });

    describe('addPoints', () => {
        it('should handle null score', () => {
            expect(X01Game.addPoints(null, null, null)).toEqual(null);
        });

        it('should handle null points', () => {
            const s1 = <X01Game.Score>{ turns: [{ points: 60, darts: 3 } ]};
            const s2 = X01Game.addPoints(s1, null, null);
            expect(s2.current).toBeUndefined();
        });

        it('should add a current turn, when one doesn\'t exist', () => {
            const s2 = X01Game.addPoints(<X01Game.Score>{}, 20, 1);
            expect(s2.current).toEqual({ points: 20, darts: 1 });
        });

        it('should add points', () => {
            const s2 = X01Game.addPoints(<X01Game.Score>{}, 20, 1);
            expect(X01Game.addPoints(<X01Game.Score>{
                current: { points: 40, darts: 2 }
            }, 20, 1).current).toEqual({ 
                points: 60, 
                darts: 3
            });
        });

        it('should be immutable', () => {
            expect(X01Game.addPoints).toBeImmutable([score1, 100, 2]);
        });
    });

    describe('endTurn', () => {
        it('should end the current turn', () => {
            const score = X01Game.createScore();
            score.current = { points: 60, darts: 3 };
            const newScore = X01Game.endTurn(score);
            expect(newScore.current).toEqual(null);
            expect(newScore.turns).toEqual([
                { points: 60, darts: 3 }
            ]);
        });

        it('should handle no current turn', () => {
            const score = X01Game.createScore();
            const newScore = X01Game.endTurn(score);
            expect(newScore.current).toEqual(null);
            expect(newScore.turns).toEqual([{ points: 0, darts: 0 }]);
        });

        it('should be immutable', () => {
            expect(X01Game.endTurn).toBeImmutable([score1]);
        });
    });

    describe('cancelTurn', () => {
        it('should cancel in progress turns', () => {
            const score: X01Game.Score = {
                team: null,
                points: 0,
                turns: [],
                current: { points: 60, darts: 3 }
            };
            const newScore = X01Game.cancelTurn(score);
            expect(newScore.current).toBeNull();
            expect(newScore.turns.length).toEqual(0);
        });

        it('should cancel completed turns', () => {
            const newScore = X01Game.cancelTurn(score1);
            expect(newScore.current).toBeNull();
            expect(newScore.turns.length).toEqual(1);
        });

        it('should handle no turns', () => {
            const score: X01Game.Score = {
                team: null,
                points: 0,
                turns: [],
                current: null
            };
            const newScore = X01Game.cancelTurn(score);
            expect(newScore.current).toBeNull();
            expect(newScore.turns.length).toEqual(0);
        });

        it('should handle null score', () => {
            expect(X01Game.cancelTurn(null)).toBeNull();
            expect(X01Game.cancelTurn(<X01Game.Score>{})).toEqual(<X01Game.Score>{});
        });

        it('should be immutable', () => {
            expect(X01Game.cancelTurn).toBeImmutable([score1]);
        });
    });

    describe('getDarts', () => {
        it('should handle nulls', () => {
            expect(X01Game.getDarts(null)).toBeNaN();
            expect(X01Game.getDarts(undefined)).toBeNaN();
        });

        it('should return number of darts', () => {
            const score = <X01Game.Score>{
                turns: [
                    { darts: 3, points: 0 },
                    { darts: 3, points: 0 },
                ],
            };
            expect(X01Game.getDarts(score)).toEqual(6);
        });

        it('should return NaN when darts is not numeric', () => {
            const score = <X01Game.Score>{
                turns: [
                    { darts: 3, points: 0 },
                    { darts: null, points: 0 },
                ],
            };
            expect(X01Game.getDarts(score)).toBeNaN();
        });
        
        it('should return 0 for no turns', () => {
            expect(X01Game.getDarts(<X01Game.Score>{})).toBe(0);
            expect(X01Game.getDarts(<X01Game.Score>{ turns: null })).toBe(0);
            expect(X01Game.getDarts(<X01Game.Score>{ turns: [] })).toBe(0);
        });
    });

    describe('getPointsHit', () => {
        it('should handle nulls', () => {
            expect(X01Game.getPointsHit(null)).toBeNaN();
            expect(X01Game.getPointsHit(undefined)).toBeNaN();
        });

        it('should return 0 for no turns', () => {
            expect(X01Game.getPointsHit(<X01Game.Score>{})).toBe(0);
            expect(X01Game.getPointsHit(<X01Game.Score>{ turns: null })).toBe(0);
            expect(X01Game.getPointsHit(<X01Game.Score>{ turns: [] })).toBe(0);
        });

        it('should return number of points hit', () => {
            expect(X01Game.getPointsHit(score1)).toBe(120);
        });

        it('should return NaN for invalid points', () => {
            expect(X01Game.getPointsHit(score2)).toBeNaN();
            expect(X01Game.getPointsHit(score3)).toBeNaN();
        });
    });

    describe('getPointsLeft', () => {
        it('should handle nulls', () => {
            expect(X01Game.getPointsLeft(null)).toBeNaN();
            expect(X01Game.getPointsLeft(undefined)).toBeNaN();
        });

        it('should return 0 for no turns', () => {
            expect(X01Game.getPointsLeft(<X01Game.Score>{})).toBe(0);
            expect(X01Game.getPointsLeft(<X01Game.Score>{ turns: null })).toBe(0);
            expect(X01Game.getPointsLeft(<X01Game.Score>{ turns: [] })).toBe(0);
        });

        it('should return number of points hit', () => {
            expect(X01Game.getPointsLeft(score1)).toBe(381);
        });

        it('should return NaN for invalid points', () => {
            expect(X01Game.getPointsLeft(score2)).toBeNaN();
            expect(X01Game.getPointsLeft(score3)).toBeNaN();
        });
    });

    describe('getPointsLastTurn', () => {
        it('should handle nulls', () => {
            expect(X01Game.getPointsLastTurn(null)).toBeNaN();
            expect(X01Game.getPointsLastTurn(undefined)).toBeNaN();
        });

        it('should return 0 for no turns', () => {
            expect(X01Game.getPointsLastTurn(<X01Game.Score>{})).toBe(0);
            expect(X01Game.getPointsLastTurn(<X01Game.Score>{ turns: null })).toBe(0);
            expect(X01Game.getPointsLastTurn(<X01Game.Score>{ turns: [] })).toBe(0);
        });

        it('should return number of points from the last turn', () => {
            expect(X01Game.getPointsLastTurn(score1)).toBe(60);
        });

        it('should return NaN for invalid points', () => {
            expect(X01Game.getPointsLastTurn(score2)).toBeNaN();
        });
    });
});
