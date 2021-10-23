import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuicklinkModule, QuicklinkStrategy } from 'ngx-quicklink';
const routes: Routes = [
  { path: '', data: { header: true, footer: false }, loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
  { path: 'login', data: { header: false, footer: false }, loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
  { path: 'register', data: { header: true, footer: false }, loadChildren: () => import('./register/register.module').then(m => m.RegisterModule) },
  { path: 'property', data: { header: true, footer: false }, loadChildren: () => import('./property/property.module').then(m => m.PropertyModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{preloadingStrategy:QuicklinkStrategy})],
  exports: [RouterModule,QuicklinkModule]
})
export class AppRoutingModule { }
