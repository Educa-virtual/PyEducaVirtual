// import { Routes } from '@angular/router'
// import { EspecialistaUgelComponent } from './especialista-ugel/especialista-ugel.component'
// import { VerEvaluacionComponent } from './ver-evaluacion/ver-evaluacion.component'

// const routes: Routes = [
//     {
//         path: '',
//         pathMatch: 'full',
//         component: EspecialistaUgelComponent,
//     },
//     {
//         path: ':ver-evaluacion',
//         pathMatch: 'full',
//         component: VerEvaluacionComponent,
//     },
// ]
// export default routes

// import { Routes } from '@angular/router'
// import { EspecialistaUgelComponent } from './especialista-ugel/especialista-ugel.component'

// const routes: Routes = [
//     {
//         path: '',
//         pathMatch: 'full',
//         component: EspecialistaUgelComponent,
//     },
// ]
// export default routes

import { Routes } from '@angular/router'

const routes: Routes = [
    {
        path: '',
        redirectTo: 'especialista-ugel',
        pathMatch: 'full',
    },
    {
        path: 'especialista-ugel',
        loadComponent: () =>
            import('./especialista-ugel/especialista-ugel.component').then(
                (c) => c.EspecialistaUgelComponent
            ),
    },

    {
        path: 'ver-evaluacion',
        loadComponent: () =>
            import('./ver-evaluacion/ver-evaluacion.component').then(
                (c) => c.VerEvaluacionComponent
            ),
    },
    {
        path: 'institucion-educativa',
        loadComponent: () =>
            import(
                './institucion-educativa/institucion-educativa.component'
            ).then((c) => c.InstitucionEducativaComponent),
    },
]

export default routes
