import { createScore } from './create-score';

describe('createScore', () => {
    it('should default to 0 points', () => {
        expect(createScore()).toEqual({ 
            points: 0, 
            team: null, 
            isPending: false, 
            turns: [] 
        });
    });

    it('should initialize points', () => {
        expect(createScore({
            points: 501,
            team: {
                players: [{ name: 'player one' }]
            }
        })).toEqual({ 
            points: 501, 
            team: {
                players: [{ name: 'player one' }]
            }, 
            isPending: false, 
            turns: [] 
        });
    });
});
