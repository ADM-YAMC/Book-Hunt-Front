import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  if (!localStorage.getItem('__user__')) {
    router.navigate(['/login']);
    return false;
  }
  const requiredRole = route.data?.['role'];
  if (
    requiredRole &&
    authService.getLocalStorage()?.roleName !== requiredRole
  ) {
    router.navigate(['/home']);
    return false;
  }
  return true;
};
