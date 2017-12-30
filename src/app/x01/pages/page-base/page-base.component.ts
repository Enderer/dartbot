import { Component, OnInit } from '@angular/core';
import * as X01 from '../../../core/x01';

@Component({
    selector: 'db-page-base',
    templateUrl: './page-base.component.html',
    styleUrls: ['./page-base.component.scss']
})
export class PageBaseComponent implements OnInit {

    game: X01.X01Game;

    constructor() {
        this.game = {
            scores: [
                X01.createScore(501),
                X01.createScore(501),
                // X01.createScore(501)
            ],
            doubleIn: false,
            doubleOut: true
        };

        this.game.scores[0].team = {
            players: [
                { name: 'Darsh' },
                { name: 'Darsh1' }
            ]
        };
        this.game.scores[0].turns = [
            {
                points: 60,
                darts: 3
            }
        ];
        this.game.scores[1].team = {
            players: [
                { name: 'Rita' },
                { name: 'Rita1' }
            ]
        };
        // this.game.scores[2].team = {
        //     players: [
        //         { name: 'Jean Luc' }
        //     ]
        // };
    }



    ngOnInit() { }




}
