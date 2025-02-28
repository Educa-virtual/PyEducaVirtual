import {
    ADMINISTRADOR_DREMO,
    DIRECTOR_IE,
    ESPECIALISTA_DREMO,
    ESPECIALISTA_UGEL,
} from '@/app/servicios/seg/perfiles'
import { RoleGuard } from '@/app/shared/_guards/role.guard'
import { Routes } from '@angular/router'
import { EvaluacionesComponent } from '../evaluaciones/sub-evaluaciones/evaluaciones/evaluaciones.component'
import { EspecialistaDremoComponent } from './administrar/especialista-dremo/especialista-dremo.component'
import { GestionarPreguntasComponent } from './evaluaciones/gestionar-preguntas/gestionar-preguntas.component'
import { PreguntasComponent } from './evaluacion/preguntas/preguntas.component'

const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
    },
    {
        path: 'evaluaciones/:iEvaluacionId/gestionar-preguntas',
        component: GestionarPreguntasComponent,
        canActivate: [RoleGuard],
        data: {
            expectedRole: [ADMINISTRADOR_DREMO, ESPECIALISTA_DREMO],
            breadcrumb: 'Gestionar Preguntas',
            icon: 'pi pi-list-check',
        },
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
    },
    {
        path: 'evaluaciones/:iEvaluacionId/gestionar-preguntas/areas/:iCursoNivelGradId',
        component: PreguntasComponent,
        canActivate: [RoleGuard],
        data: {
            expectedRole: [ADMINISTRADOR_DREMO, ESPECIALISTA_DREMO],
            breadcrumb: 'Gestionar Preguntas',
            icon: 'pi pi-list-check',
        },
    },
    {
        path: 'administrar',
        canActivate: [RoleGuard],
        data: {
            expectedRole: [ADMINISTRADOR_DREMO],
            breadcrumb: 'Administrar',
            icon: 'pi pi-cog',
        },
        children: [
            {
                path: 'especialista-dremo',
                component: EspecialistaDremoComponent,
                data: {
                    breadcrumb: 'Especialista DREMO',
                    icon: 'pi pi-users',
                },
            },
        ],
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
