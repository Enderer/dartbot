import { Component, OnInit } from '@angular/core';
import * as x01 from './core/x01';


@Component({
    selector: 'db-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'app';
    score: x01.Score;

    ngOnInit() {
        console.log('ngOnInit');
        this.score = x01.createScore();
        this.score.points = 501;
    }

    scoreClicked() {
        this.score = x01.addPoints(this.score, 20, 1);
        this.score = x01.addPoints(this.score, 20, 1);
        this.score = x01.addPoints(this.score, 20, 1);
        this.score = x01.endTurn(this.score);
    }

    get pointsLeft(): number {
        return x01.getPointsLeft(this.score);
    }
}
