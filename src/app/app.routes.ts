import { Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/layouts/main-layout/main-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginLayoutComponent } from './shared/layouts/login-layout/login-layout.component';
import { LoginComponent } from './Auth/login/login.component';
import { AuthorComponent } from './pages/author/author.component';
import { CategoryComponent } from './pages/category/category.component';
import { UsersComponent } from './pages/users/users.component';
import { authGuard } from './Auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '',
    component: LoginLayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [authGuard],
      },
      {
        path: 'category',
        component: CategoryComponent,
        canActivate: [authGuard],
        data: { role: 'Administrador' },
      },
      {
        path: 'author',
        component: AuthorComponent,
        canActivate: [authGuard],
      },
      {
        path: 'users',
        component: UsersComponent,
        canActivate: [authGuard],
        data: { role: 'Administrador' },
      },
    ],
  },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];
