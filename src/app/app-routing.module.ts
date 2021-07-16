import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InstanceComponent } from './feature/instance/instance.component';


const routes: Routes = [
  {
    path: 'instance', component: InstanceComponent
  },
  { path: '', redirectTo: '/instance', pathMatch: 'full' }, // redirect to `first-component`
  { path: '**', redirectTo: '/instance', pathMatch: 'full' },  // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
