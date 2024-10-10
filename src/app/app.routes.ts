import { Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/layouts/main-layout/main-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginLayoutComponent } from './shared/layouts/login-layout/login-layout.component';
import { LoginComponent } from './Auth/login/login.component';
import { AuthorComponent } from './pages/author/author.component';
import { CategoryComponent } from './pages/category/category.component';
import { UsersComponent } from './pages/users/users.component';
import { authGuard } from './Auth/auth.guard';
import { ViewBookLayoutComponent } from './shared/layouts/view-book-layout/view-book-layout.component';
import { BookHomeComponent } from './pages/book-home/book-home.component';
import { ProfileComponent } from './Auth/profile/profile.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'book-home',
    pathMatch: 'full',
  },
  {
    path: '',
    component: ViewBookLayoutComponent,
    children: [
      {
        path: 'book-home',
        component: BookHomeComponent,
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    component: LoginLayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
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
        path: 'my-profile',
        component: ProfileComponent,
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
  { path: '**', redirectTo: 'book-home', pathMatch: 'full' },
];
