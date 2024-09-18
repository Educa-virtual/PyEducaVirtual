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
            import('./sub-evaluaciones/areas/areas.component').then(
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
        path: 'banco-preguntas',
        loadComponent: () =>
            import(
                './sub-evaluaciones/banco-preguntas/banco-preguntas.component'
            ).then((c) => c.BancoPreguntasComponent),
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
]

export default routes
