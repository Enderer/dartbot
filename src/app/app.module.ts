import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CricketModule } from './cricket/cricket.module';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        CricketModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
