///<reference path="../../../test/immutable.matcher.d.ts"/>
import * as X01 from './x01-game';
import * as _ from 'lodash';
import { immutableMatcher } from '../../../test/immutable.matcher.spec';

beforeAll(function() {
    jasmine.addMatchers(immutableMatcher);
});

describe('X01Game', () => {
                
    let score1, score2, score3;

    beforeEach(() => {
        score1 = <X01.Score>{
            points: 501,
            team: null,
            current: null,
            turns: [
                { darts: 3, points: 60 },
                { darts: 3, points: 60 },
            ],
        };
    
        score2 = <X01.Score>{
            points: 501,
            team: null,
            current: null,
            turns: [
                { darts: 3, points: 60 },
                { darts: null, points: null },
            ],
        };
    
        score3 = <X01.Score>{
            points: 501,
            team: null,
            current: null,
            turns: [
                { darts: 3, points: 60 },
                <X01.Turn>{ },
            ],
        };
    });
    describe('createScore', () => {
        it('should default to 0 points', () => {
            expect(X01.createScore()).toEqual({ points: 0, team: null, current: null, turns: [] });
        });

        it('should initialize points', () => {
            expect(X01.createScore(501)).toEqual({ points: 501, team: null, current: null, turns: [] });
        });
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
            expect(X01.getTurns(<X01.Score>{ 
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
        const score = X01.createScore();
        it('should return null for no turns', () => {
            expect(X01.lastTurn(score)).toEqual(undefined);
        });

        it('should return the last turn', () => {
            expect(X01.lastTurn(<X01.Score>{ 
                turns: [
                    { points: 60, darts: 3 },
                    { points: 25, darts: 3 }
                ]
            })).toEqual({ points: 25, darts: 3 });
        });
    });

    describe('addPoints', () => {
        it('should handle null score', () => {
            expect(X01.addPoints(null, null, null)).toEqual(null);
        });

        it('should handle null points', () => {
            const s1 = <X01.Score>{ turns: [{ points: 60, darts: 3 } ]};
            const s2 = X01.addPoints(s1, null, null);
            expect(s2.current).toBeUndefined();
        });

        it('should add a current turn, when one doesn\'t exist', () => {
            const s2 = X01.addPoints(<X01.Score>{}, 20, 1);
            expect(s2.current).toEqual({ points: 20, darts: 1 });
        });

        it('should add points', () => {
            const s2 = X01.addPoints(<X01.Score>{}, 20, 1);
            expect(X01.addPoints(<X01.Score>{
                current: { points: 40, darts: 2 }
            }, 20, 1).current).toEqual({ 
                points: 60, 
                darts: 3
            });
        });

        it('should be immutable', () => {
            expect(X01.addPoints).toBeImmutable([score1, 100, 2]);
        });
    });

    describe('endTurn', () => {
        it('should handle nulls', () => {
            expect(X01.endTurn(null)).toBeNull();
            expect(X01.endTurn(<X01.Score>{}).turns).toEqual([{ darts: 0, points: 0 }]);
        });

        it('should end the current turn', () => {
            const score = X01.createScore();
            score.current = { points: 60, darts: 3 };
            const newScore = X01.endTurn(score);
            expect(newScore.current).toEqual(null);
            expect(newScore.turns).toEqual([
                { points: 60, darts: 3 }
            ]);
        });

        it('should handle no current turn', () => {
            const score = X01.createScore();
            const newScore = X01.endTurn(score);
            expect(newScore.current).toEqual(null);
            expect(newScore.turns).toEqual([{ points: 0, darts: 0 }]);
        });

        it('should be immutable', () => {
            expect(X01.endTurn).toBeImmutable([score1]);
        });
    });

    describe('cancelTurn', () => {
        it('should cancel in progress turns', () => {
            const score: X01.Score = {
                team: null,
                points: 0,
                turns: [],
                current: { points: 60, darts: 3 }
            };
            const newScore = X01.cancelTurn(score);
            expect(newScore.current).toBeNull();
            expect(newScore.turns.length).toEqual(0);
        });

        it('should cancel completed turns', () => {
            const newScore = X01.cancelTurn(score1);
            expect(newScore.current).toBeNull();
            expect(newScore.turns.length).toEqual(1);
        });

        it('should handle no turns', () => {
            const score: X01.Score = {
                team: null,
                points: 0,
                turns: [],
                current: null
            };
            const newScore = X01.cancelTurn(score);
            expect(newScore.current).toBeNull();
            expect(newScore.turns.length).toEqual(0);
        });

        it('should handle null score', () => {
            expect(X01.cancelTurn(null)).toBeNull();
            expect(X01.cancelTurn(<X01.Score>{})).toEqual(<X01.Score>{});
        });

        it('should be immutable', () => {
            expect(X01.cancelTurn).toBeImmutable([score1]);
        });
    });

    describe('getDarts', () => {
        it('should handle nulls', () => {
            expect(X01.getDarts(null)).toBeNaN();
            expect(X01.getDarts(undefined)).toBeNaN();
        });

        it('should return number of darts', () => {
            const score = <X01.Score>{
                turns: [
                    { darts: 3, points: 0 },
                    { darts: 3, points: 0 },
                ],
            };
            expect(X01.getDarts(score)).toEqual(6);
        });

        it('should return NaN when darts is not numeric', () => {
            const score = <X01.Score>{
                turns: [
                    { darts: 3, points: 0 },
                    { darts: null, points: 0 },
                ],
            };
            expect(X01.getDarts(score)).toBeNaN();
        });
        
        it('should return 0 for no turns', () => {
            expect(X01.getDarts(<X01.Score>{})).toBe(0);
            expect(X01.getDarts(<X01.Score>{ turns: null })).toBe(0);
            expect(X01.getDarts(<X01.Score>{ turns: [] })).toBe(0);
        });
    });

    describe('getPointsHit', () => {
        it('should handle nulls', () => {
            expect(X01.getPointsHit(null)).toBeNaN();
            expect(X01.getPointsHit(undefined)).toBeNaN();
        });

        it('should return 0 for no turns', () => {
            expect(X01.getPointsHit(<X01.Score>{})).toBe(0);
            expect(X01.getPointsHit(<X01.Score>{ turns: null })).toBe(0);
            expect(X01.getPointsHit(<X01.Score>{ turns: [] })).toBe(0);
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
            expect(X01.getPointsLeft(<X01.Score>{ points: 501})).toBe(501);
            expect(X01.getPointsLeft(<X01.Score>{ points: 501, turns: null })).toBe(501);
            expect(X01.getPointsLeft(<X01.Score>{ points: 501, turns: [] })).toBe(501);
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
            expect(X01.getPointsLastTurn(<X01.Score>{})).toBe(0);
            expect(X01.getPointsLastTurn(<X01.Score>{ turns: null })).toBe(0);
            expect(X01.getPointsLastTurn(<X01.Score>{ turns: [] })).toBe(0);
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
            expect(X01.getCurrentPlayer(<X01.Score>{})).toBeNull();
            expect(X01.getCurrentPlayer(<X01.Score>{ team: <X01.Team>{}})).toBeNull();
            expect(X01.getCurrentPlayer(<X01.Score>{ team: { players: []}})).toBeNull();
            expect(X01.getCurrentPlayer(<X01.Score>{ team: { players: []}})).toBeNull();
        });

        it('should return first player when there are no turns', () => {
            const player1: X01.Player = { name: 'one' };
            const player2: X01.Player = { name: 'two' };
            const players = [player1, player2];
            expect(X01.getCurrentPlayer(<X01.Score>{ team: { players}})).toBe(player1);
            expect(X01.getCurrentPlayer(<X01.Score>{ team: { players}, turns: []})).toBe(player1);
        });

        it('should return second player when there is one turns', () => {
            const player1: X01.Player = { name: 'one' };
            const player2: X01.Player = { name: 'two' };
            const players = [player1, player2];
            expect(X01.getCurrentPlayer(<X01.Score>{ team: { players }, turns: [{ darts: 3, points: 60}]})).toBe(player2);
        });
    });

});
