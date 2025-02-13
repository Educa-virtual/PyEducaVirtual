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
]

export class AppRoutingModule {}
export default routes
