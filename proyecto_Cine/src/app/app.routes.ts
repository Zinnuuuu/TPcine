import { Routes } from '@angular/router';
import { roleGuard } from './core/guards/role-guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent:() => import('./features/cliente/home/home').then(m => m.Home)
    },
    {
        path: 'empleado',
        loadComponent: () => import('./features/empleado/escaner/escaner').then(m => m.Escaner),
        canActivate: [roleGuard],
        data: { roles: ['empleado', 'admin'] }
    },
    {
        path: 'admin',
        loadComponent: () => import('./features/admin/dashboard/dashboard').then(m => m.Dashboard),
        canActivate: [roleGuard],
        data: { roles: ['admin'] }
    },
    {
        path: 'login', 
        loadComponent: () => import('./features/cliente/login/login').then(m => m.Login)
    },
    {
        path: 'registro',
        loadComponent: () => import('./features/cliente/registro/registro').then(m => m.Registro)
    },
    {
        path: 'admin/peliculas',
        loadComponent: () => import('./features/admin/peliculas-listado/peliculas-listado').then(m => m.PeliculasListado),
        canActivate: [roleGuard],
        data: { roles: ['admin'] }
    },
    {
        path: 'admin/peliculas/nueva',
        loadComponent: () => import('./features/admin/peliculas-formulario/peliculas-formulario').then(m => m.PeliculasFormulario),
        canActivate: [roleGuard],
        data: { roles: ['admin'] }
    },
    {
        path: 'admin/peliculas/editar/:id',
        loadComponent: () => import('./features/admin/peliculas-formulario/peliculas-formulario').then(m => m.PeliculasFormulario),
        canActivate: [roleGuard],
        data: { roles: ['admin'] }
    },
    {
        path: 'admin/salas',
        loadComponent: () => import('./features/admin/salas-listado/salas-listado').then(m => m.SalasListado),
        canActivate: [roleGuard],
        data: { roles: ['admin'] }
    },
    {
        path: 'admin/salas/nueva',
        loadComponent: () => import('./features/admin/salas-form/salas-form').then(m => m.SalasForm),
        canActivate: [roleGuard],
        data: { roles: ['admin'] }
    },
    {
        path: 'admin/funciones',
        loadComponent: () => import('./features/admin/funciones-listado/funciones-listado').then(m => m.FuncionesListado),
        canActivate: [roleGuard],
        data: { roles: ['admin'] }
    },
    {
        path: 'admin/funciones/nueva',
        loadComponent: () => import('./features/admin/funciones-form/funciones-form').then(m => m.FuncionesForm),
        canActivate: [roleGuard],
        data: { roles: ['admin'] }
    }


];
