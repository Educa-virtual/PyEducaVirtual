import {
    ADMINISTRADOR_DREMO,
    DIRECTOR_IE,
    ESPECIALISTA_DREMO,
    ESPECIALISTA_UGEL,
    ESTUDIANTE,
} from '@/app/servicios/seg/perfiles'
import { RoleGuard } from '@/app/shared/_guards/role.guard'
import { Routes } from '@angular/router'
import { EvaluacionesComponent } from '../evaluaciones/sub-evaluaciones/evaluaciones/evaluaciones.component'
import { EspecialistaDremoComponent } from './administrar/especialista-dremo/especialista-dremo.component'
import { GestionarPreguntasComponent } from './evaluaciones/gestionar-preguntas/gestionar-preguntas.component'
import { PreguntasComponent } from './evaluacion/preguntas/preguntas.component'
import { EspecialistaUgelComponent } from './administrar/especialista-ugel/especialista-ugel.component'
import { MostrarEvaluacionComponent } from './examen/mostrar-evaluacion/mostrar-evaluacion.component'
import { RendirExamenComponent } from './examen/rendir-examen/rendir-examen.component'
import { AreasRendirExamenComponent } from './examen/areas-rendir-examen/areas-rendir-examen.component'

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
            {
                path: 'especialista-ugel',
                component: EspecialistaUgelComponent,
                data: {
                    breadcrumb: 'Especialista UGEL',
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
    {
        path: 'areas-rendir-examen',
        component: AreasRendirExamenComponent,
        canActivate: [RoleGuard],
        data: {
            expectedRole: [ESTUDIANTE],
            breadcrumb: 'Áreas Examen',
            icon: 'pi pi-share-alt',
        },
    },
    {
        path: 'mostrar-evaluacion/:iEvaluacionId/areas/:iCursoNivelGradId/:cEvaluacionNombre/:cCursoNombre/:cGradoNombre',
        component: MostrarEvaluacionComponent,
        canActivate: [RoleGuard],
        data: {
            expectedRole: [ESTUDIANTE],
            breadcrumb: 'Información Evaluación',
            icon: 'pi pi-share-alt',
        },
    },
    {
        path: 'rendir-examen/:iEvaluacionId/areas/:iCursoNivelGradId/:cEvaluacionNombre/:cCursoNombre/:cGradoNombre',
        component: RendirExamenComponent,
        canActivate: [RoleGuard],
        data: {
            expectedRole: [ESTUDIANTE],
            breadcrumb: 'Rendir Examen',
            icon: 'pi pi-share-alt',
        },
    },
]

export class AppRoutingModule {}
export default routes
