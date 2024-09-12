import { Routes } from '@angular/router'

const routes: Routes = [
    {
        path: '',
        redirectTo: 'cursos',
        pathMatch: 'full',
    },
    {
        path: 'dashboard',
        loadChildren: () =>
            import('./sub-evaluaciones/dashboard/dashboard.routes'),
    },
]

export default routes
