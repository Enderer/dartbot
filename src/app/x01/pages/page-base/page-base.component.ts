import { Component, OnInit } from '@angular/core';
import * as X01 from '../../../core/x01';
import { Game, createGame, endTurn, addPoints } from '../../../core/x01/game';

@Component({
    selector: 'db-page-base',
    templateUrl: './page-base.component.html',
    styleUrls: ['./page-base.component.scss']
})
export class PageBaseComponent implements OnInit {

    game: Game;

    constructor() {

        const teams = [
            {
                players: [
                    { name: 'Darsh kjlkj l lkj llj lljl jljl afmiaaf afam 1' },
                    { name: 'Darsh1 lk;kj jl jlkj lkjlj l akdjalfjf sjfl  2' }
                ]
            },
            {
                players: [
                    { name: 'Rita klkjl jl jkljlkj lj ljljljl j skafjl afjk sjklf  3' },
                    { name: 'Rita1' }
                ]
            },
            // {
            //     players: [
            //         { name: 'Jean Luc' },
            //         { name: 'Riker' }
            //     ]
            // }
        ];

        this.game = createGame({ 
            points: 501, 
            doubleIn: false,
            doubleOut: true,
            teams
        });

        this.game = addPoints(this.game, teams[0], 60, 3);
        this.game = endTurn(this.game, teams[0]);
        this.game = addPoints(this.game, teams[1], 45, 3);
        this.game = endTurn(this.game, teams[1]);
        this.game = addPoints(this.game, teams[0], 60, 3);
        this.game = endTurn(this.game, teams[0]);
        this.game = addPoints(this.game, teams[1], 55, 3);
        this.game = endTurn(this.game, teams[1]);

    }

    ngOnInit() { }
}
