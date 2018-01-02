import { Game } from '.';
import { createScore } from '../score';
import { Team } from '../../player';

export const createGame = (opts: GameOpts = {}): Game => {
    const defaults = {
        points: 0,
        doubleIn: false,
        doubleOut: true,
        teams: <Team[]>[]
    };

    const options = { 
        ...defaults, 
        ...opts
    };
    const scores = options.teams.map(t => createScore({
        points: options.points,
        team: t
    }));

    const game: Game = {
        doubleIn: options.doubleIn,
        doubleOut: options.doubleOut,
        scores: scores
    };
    return game;
};

export interface GameOpts {
    doubleIn?: boolean;
    doubleOut?: boolean;
    points?: number;
    teams?: Team[];
}
