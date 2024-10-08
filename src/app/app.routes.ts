import { Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/layouts/main-layout/main-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginLayoutComponent } from './shared/layouts/login-layout/login-layout.component';
import { LoginComponent } from './Auth/login/login.component';
import { AuthorComponent } from './pages/author/author.component';
import { CategoryComponent } from './pages/category/category.component';

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
    children: [
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'category',
        component: CategoryComponent,
      },
      {
        path: 'author',
        component: AuthorComponent,
      },
    ],
  },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];
