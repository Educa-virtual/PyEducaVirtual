import { Routes } from '@angular/router'

const routes: Routes = [
    {
        path: '',
        redirectTo: 'especialista-ugel',
        pathMatch: 'full',
    },
    // {
    //     path: 'especialista-ugel',
    //     loadComponent: () =>
    //         import('./especialista-ugel/especialista-ugel.component').then(
    //             (c) => c.EspecialistaUgelComponent
    //         ),
    // },

    // {
    //     path: 'ver-evaluacion',
    //     loadComponent: () =>
    //         import('./ver-evaluacion/ver-evaluacion.component').then(
    //             (c) => c.VerEvaluacionComponent
    //         ),
    // },
    // {
    //     path: 'institucion-educativa',
    //     loadComponent: () =>
    //         import(
    //             './institucion-educativa/institucion-educativa.component'
    //         ).then((c) => c.InstitucionEducativaComponent),
    // },
    // {
    //     path: 'respuesta-evaluacion',
    //     loadComponent: () =>
    //         import(
    //             './respuesta-evaluacion/respuesta-evaluacion.component'
    //         ).then((c) => c.RespuestaEvaluacionComponent),
    // },
    // {
    //     path: 'distritos-informe',
    //     loadComponent: () =>
    //         import('./distritos-informe/distritos-informe.component').then(
    //             (c) => c.DistritosInformeComponent
    //         ),
    // },
    // {
    //     path: 'estado-archivos',
    //     loadComponent: () =>
    //         import('./estado-archivos/estado-archivos.component').then(
    //             (c) => c.EstadoArchivosComponent
    //         ),
    // },
    // {
    //     path: 'procesar-archivos',
    //     loadComponent: () =>
    //         import('./procesar-archivos/procesar-archivos.component').then(
    //             (c) => c.ProcesarArchivosComponent
    //         ),
    // },
]

export default routes
