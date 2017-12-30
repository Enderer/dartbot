import { Team } from '../../player';
import { Turn } from '../x01-game';

/** Score of an X01 game for a single team */
export interface Score {
    /** Team this score is recording for */
    team: Team;
    /** Number of starting points */
    points: number;
    /** List of turns taken by this team */
    turns: Turn[];
    /** The current turn hasn't been ended  */
    isPending: boolean;
}
