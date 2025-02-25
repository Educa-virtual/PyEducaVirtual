import { Routes } from '@angular/router'

const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
    },
    {
        path: 'evaluaciones/:iEvaluacionId/gestionar-preguntas',
        loadComponent: () =>
            import(
                './evaluaciones/gestionar-preguntas/gestionar-preguntas.component'
            ).then((c) => c.GestionarPreguntasComponent),
        pathMatch: 'full',
    },
    {
        path: 'evaluaciones',
        loadComponent: () =>
            import(
                '../evaluaciones/sub-evaluaciones/evaluaciones/evaluaciones.component'
            ).then((c) => c.EvaluacionesComponent),
    },
    {
        path: 'evaluaciones',
        loadComponent: () =>
            import(
                '../evaluaciones/sub-evaluaciones/evaluaciones/evaluaciones.component'
            ).then((c) => c.EvaluacionesComponent),
    },
    {
        path: 'evaluaciones/:iEvaluacionId/gestionar-preguntas/areas/:iCursoNivelGradId',
        loadComponent: () =>
            import('./evaluacion/preguntas/preguntas.component').then(
                (c) => c.PreguntasComponent
            ),
    },
    {
        path: 'especialista-dremo',
        loadComponent: () =>
            import(
                './administrar/especialista-dremo/especialista-dremo.component'
            ).then((c) => c.EspecialistaDremoComponent),
    },
]

export class AppRoutingModule {}
export default routes
