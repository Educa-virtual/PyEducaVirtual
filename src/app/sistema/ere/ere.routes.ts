import {
    ADMINISTRADOR_DREMO,
    DIRECTOR_IE,
    ESPECIALISTA_DREMO,
    ESPECIALISTA_UGEL,
} from '@/app/servicios/seg/perfiles'
import { RoleGuard } from '@/app/shared/_guards/role.guard'
import { Routes } from '@angular/router'
import { EvaluacionesComponent } from '../evaluaciones/sub-evaluaciones/evaluaciones/evaluaciones.component'

const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
    },

    {
        path: 'evaluaciones',
        component: EvaluacionesComponent,
        canActivate: [RoleGuard],
        data: {
            expectedRole: [
                ADMINISTRADOR_DREMO,
                ESPECIALISTA_DREMO,
                ESPECIALISTA_UGEL,
                DIRECTOR_IE,
            ],
            breadcrumb: 'Evaluaciones',
            icon: 'pi pi-check-square',
        },
        children: [
            {
                path: ':iEvaluacionId/gestionar-preguntas',
                loadComponent: () =>
                    import(
                        './evaluaciones/gestionar-preguntas/gestionar-preguntas.component'
                    ).then((c) => c.GestionarPreguntasComponent),
                data: {
                    breadcrumb: 'Gestionar Preguntas',
                    icon: 'pi pi-list-check',
                },
            },
        ],
    },
    {
        path: 'evaluaciones/:iEvaluacionId/gestionar-preguntas/areas/:iCursoNivelGradId',
        loadComponent: () =>
            import('./evaluacion/preguntas/preguntas.component').then(
                (c) => c.PreguntasComponent
            ),
    },
    {
        path: 'informes-ere',
        loadComponent: () =>
            import('./informes-ere/informes-ere/informes-ere.component').then(
                (c) => c.InformesEreComponent
            ),
    },
]

export class AppRoutingModule {}
export default routes
