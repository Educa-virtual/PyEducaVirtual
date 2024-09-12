import { Routes } from '@angular/router'

const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
    },
    {
        path: 'dashboard',
        loadChildren: () =>
            import('./sub-evaluaciones/dashboard/dashboard.routes'),
    },
    {
        path: 'areas',
        loadComponent: () =>
            import('./sub-evaluaciones/areas/areas.component').then(
                (c) => c.AreasComponent
            ),
    },
]

export default routes
