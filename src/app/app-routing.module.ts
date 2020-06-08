import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from'./views/home/home.component';
import{ ListComponent } from './views/list/list.component'
import { UFormComponent } from './views/u-form/u-form.component';

const routes: Routes = [
  {
    path:"",
    component: HomeComponent
  },
  {
    path:"list",
    component: ListComponent
  },
  {
    path:"user/create",
    component:UFormComponent
  },
  {
    path:"user/update/:id",
    component:UFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
