import { Score } from '.';
import { Turn } from '../x01-game';
import { Team } from '../../player';

/** Initializes a score */
export const createScore = (opts?: ScoreOptions): Score => {
    const defaultOpts: ScoreOptions = {
        points: 0,
        team: null
    };

    const options = { ...defaultOpts, ...opts };

    return { 
        team: options.team, 
        points: options.points, 
        turns: [],
        isPending: false
    };
};

export interface ScoreOptions {
    points?: number;
    team?: Team;
}
