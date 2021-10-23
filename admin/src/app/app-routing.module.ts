import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'dashboard',data: { header: true }, loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: '',data: { header: false }, loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
  { path: 'users',data: { header: true }, loadChildren: () => import('./users/users.module').then(m => m.UsersModule) },
  { path: 'forget-password', loadChildren: () => import('./forget-password/forget-password.module').then(m => m.ForgetPasswordModule) },
  { path: 'reset-password', loadChildren: () => import('./reset-password/reset-password.module').then(m => m.ResetPasswordModule) },
  { path: 'projects',data: { header: true }, loadChildren: () => import('./projects/projects.module').then(m => m.ProjectsModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
