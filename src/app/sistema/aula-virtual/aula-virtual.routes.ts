import { Routes } from '@angular/router'

const routes: Routes = [
    {
        path: '',
        redirectTo: 'cursos',
        pathMatch: 'full',
    },
    {
        path: 'cursos',
        loadChildren: () => import('./sub-modulos/cursos/cursos.routes'),
    },

    {
        path: 'recursos',
        loadChildren: () => import('./sub-modulos/recursos/recursos.routes'),
    },
    {
        path: 'calendario',
        loadChildren: () =>
            import('./sub-modulos/calendario/calendario.routes'),
    },
]

export default routes
