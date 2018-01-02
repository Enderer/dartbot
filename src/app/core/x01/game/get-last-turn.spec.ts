import { getLastTurn, getPointsLastTurn} from './get-last-turn';
import { Game, createGame, addPoints } from '../../x01/game';
import { Team, Player } from '../../player';

describe('game getLastTurn', () => {

    let players: Player[];
    let teams: Team[];
    
    beforeEach(() => {
        players = [
            { name: 'one' },
            { name: 'two' },
            { name: 'three' },
            { name: 'four' }
        ];
        teams = [
            { players: [players[0], players[1]]},
            { players: [players[2], players[3]]},
        ];
    });

    it('should return the last turn', () => {
        let game = createGame({ teams });
        game = addPoints(game, teams[0], 60, 3);
        const turn = getLastTurn(game, teams[0]);
        expect(turn.points).toBe(60);
        expect(turn.darts).toBe(3);
    });

    it('should return null for no turns', () => {
        const game = createGame({ teams });
        expect(getLastTurn(game, teams[0])).toBeNull();
    });

    it('should handle nulls', () => {
        expect(getLastTurn(null, null)).toBeNull();
        expect(getLastTurn(undefined, undefined)).toBeNull();
        expect(getLastTurn(<Game>{}, <Team>{})).toBeNull();
    });
});
