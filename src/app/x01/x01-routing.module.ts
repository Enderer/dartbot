import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageBaseComponent } from './pages';

const routes: Routes = [
  // {
  //   path: 'x01',
  //   component: PageBaseComponent
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class X01RoutingModule { }
