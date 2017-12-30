import { Score } from '../score';

/** Game state for an X01 game */
export interface Game {
    /** List of scores for each team playing the game */
    scores: Score[];
    /** True if double in is required */
    doubleIn: boolean;
    /** True if double out is requried */
    doubleOut: boolean;
}
