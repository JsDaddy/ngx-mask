import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'showcase',
        pathMatch: 'full',
    },
    {
        path: 'showcase',
        loadComponent: () =>
            import('./showcase/showcase.component').then((mod) => mod.ShowcaseComponent),
    },
    {
        path: 'bugs',
        loadComponent: () => import('./bugs/bugs.component').then((mod) => mod.BugsComponent),
    },
    {
        path: 'error',
        loadComponent: () => import('./error/error.component').then((mod) => mod.ErrorComponent),
    },
    {
        path: '**',
        redirectTo: '/error',
    },
];
