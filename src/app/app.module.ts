import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CricketModule } from './cricket/cricket.module';
import { X01Module } from './x01/x01.module';
import { X01RoutingModule } from './x01/x01-routing.module';
import { PageBaseComponent } from './x01/pages';
import { Routes, RouterModule } from '@angular/router';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        CricketModule,
        X01Module,
        RouterModule.forRoot([
            {
            path: '',
            component: PageBaseComponent
            }
        ])
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
