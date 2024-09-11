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
]

export default routes
