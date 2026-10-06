import {inject} from '@angular/core';
import { CanActivateFn, Router} from '@angular/router';
import { Auth } from '../services/auth';

export const roleGuard: CanActivateFn = async (route)=> {
  const auth = inject(Auth);
  const router = inject(Router);
  const rolesPermitidos = route.data['roles'] as string[];

  const rol = await auth.getRol();
  if (rol && rolesPermitidos.includes(rol)) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
