import { Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/layouts/main-layout/main-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginLayoutComponent } from './shared/layouts/login-layout/login-layout.component';
import { LoginComponent } from './Auth/login/login.component';

export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
          {
            path: '',
            component: HomeComponent
          }
        ]
      },
      {
        path: '',
        component: LoginLayoutComponent,
        children: [
          {
            path: 'login',
            component: LoginComponent
          }
        ]
      },
      { path: '**', redirectTo: 'login' }
];
