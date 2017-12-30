import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { X01Game } from '../../../core/x01';
import * as X01 from '../../../core/x01';

@Component({
    selector: 'db-x01-gameboard',
    templateUrl: './x01-gameboard.component.html',
    styleUrls: ['./x01-gameboard.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class X01GameboardComponent implements OnInit {

    @Input() game: X01Game;

    X01 = X01;

    constructor() {  }

    ngOnInit() {}

}
