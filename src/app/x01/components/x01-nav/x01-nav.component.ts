import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import * as X01 from '../../../core/x01';
import * as R from 'ramda';

@Component({
    selector: 'db-x01-nav',
    templateUrl: './x01-nav.component.html',
    styleUrls: ['./x01-nav.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class X01NavComponent implements OnInit {

    @Input() game: X01.X01Game;

    getPlayer = X01.getCurrentPlayer;

    constructor() { }

    ngOnInit() {}

}
