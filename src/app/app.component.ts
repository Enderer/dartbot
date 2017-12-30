import { Component, OnInit } from '@angular/core';
import { createScore, Score, addPoints, endTurn } from './core/x01/score';
import { getPointsLeft } from './core/x01/x01-game';

@Component({
    selector: 'db-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'app';
    score: Score;

    ngOnInit() {
        console.log('ngOnInit');
        this.score = createScore({ points: 501 });
        this.score.points = 501;
    }

    scoreClicked() {
        this.score = addPoints(this.score, 20, 1);
        this.score = addPoints(this.score, 20, 1);
        this.score = addPoints(this.score, 20, 1);
        this.score = endTurn(this.score);
    }

    get pointsLeft(): number {
        return getPointsLeft(this.score);
    }
}
