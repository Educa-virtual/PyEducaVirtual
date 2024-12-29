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
        path: 'evaluaciones',
        loadComponent: () =>
            import(
                './sub-evaluaciones/evaluaciones/evaluaciones.component'
            ).then((c) => c.EvaluacionesComponent),
    },
    {
        path: 'areas',
        loadComponent: () =>
            import('./sub-evaluaciones/areas/areas/areas.component').then(
                (c) => c.AreasComponent
            ),
    },
    {
        path: 'areas/:areaId/banco-preguntas',
        loadComponent: () =>
            import(
                './sub-evaluaciones/banco-preguntas/banco-preguntas.component'
            ).then((c) => c.BancoPreguntasComponent),
        pathMatch: 'full',
    },
    {
        path: 'preguntas-activas',
        loadComponent: () =>
            import(
                './sub-evaluaciones/preguntas-activas/preguntas-activas.component'
            ).then((c) => c.PreguntasActivasComponent),
    },

    {
        path: 'competencias',
        loadComponent: () =>
            import(
                './sub-evaluaciones/competencias/competencias.component'
            ).then((c) => c.CompetenciasComponent),
    },
    {
        path: 'sub-evaluaciones/evaluacion-examen-ere',
        loadComponent: () =>
            import(
                './sub-evaluaciones/evaluacion-examen-ere/evaluacion-examen-ere.component'
            ).then((c) => c.EvaluacionExamenEreComponent),
    },
    {
        path: 'sub-evaluaciones/evaluacion-examen-ere/examen-ere',
        loadComponent: () =>
            import(
                './sub-evaluaciones/evaluacion-examen-ere/examen-ere/examen-ere.component'
            ).then((c) => c.ExamenEreComponent),
    },
    // {
    //     path: 'sub-evaluaciones/evaluacion-examen-ere',
    //     loadComponent: () =>
    //         import(
    //             './sub-evaluaciones/evaluacion-examen-ere/evaluacion-examen-ere.component'
    //         ).then((c) => c.EvaluacionExamenEreComponent),
    //     children: [
    //         {
    //             path: 'examen-ere', // Ruta hija
    //             loadComponent: () =>
    //                 import(
    //                     './sub-evaluaciones/evaluacion-examen-ere/examen-ere/examen-ere.component'
    //                 ).then((c) => c.ExamenEreComponent),
    //         },
    //     ],
    // },
]

export class AppRoutingModule {}
export default routes
