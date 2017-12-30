import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { X01RoutingModule } from './x01-routing.module';
import { PageBaseComponent } from './pages';
import { X01GameboardComponent } from './components/x01-gameboard/x01-gameboard.component';
import { X01NavComponent } from './components/x01-nav/x01-nav.component';

@NgModule({
  imports: [
    CommonModule,
    // X01RoutingModule
  ],
  declarations: [
    PageBaseComponent, 
    X01GameboardComponent, X01NavComponent
  ],
  exports: [
    // X01RoutingModule,
    PageBaseComponent
  ]
})
export class X01Module { }
