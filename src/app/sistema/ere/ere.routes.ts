import {
  ADMINISTRADOR_DREMO,
  DIRECTOR_IE,
  ESPECIALISTA_DREMO,
  ESPECIALISTA_UGEL,
  ESTUDIANTE,
} from '@/app/servicios/seg/perfiles';
import { RoleGuard } from '@/app/shared/_guards/role.guard';
import { Routes } from '@angular/router';
import { EvaluacionesComponent } from '../evaluaciones/sub-evaluaciones/evaluaciones/evaluaciones.component';
import { ListaAreasComponent } from './evaluaciones/areas/lista-areas.component';
import { PreguntasComponent } from './evaluaciones/preguntas/preguntas.component';
import { AreasRendirExamenComponent } from './evaluaciones/examen/areas-rendir-examen/areas-rendir-examen.component';
import { MostrarEvaluacionComponent } from './evaluaciones/examen/mostrar-evaluacion/mostrar-evaluacion.component';
import { RendirExamenComponent } from './evaluaciones/examen/rendir-examen/rendir-examen.component';
import { AsignarAreasEspecialistaDremoComponent } from '../especialista-dremo/asignar-areas/especialista-dremo.component';
import { AsignarAreasEspecialistaUgelComponent } from '../especialista-ugel/asignar-areas/asignar-areas.component';
import { EvaluacionExclusionesComponent } from '../evaluaciones/sub-evaluaciones/evaluaciones/evaluacion-exclusiones/evaluacion-exclusiones.component';
/*import { EspecialistaDremoComponent } from './administrar/especialista-dremo/especialista-dremo.component'
import { GestionarPreguntasComponent } from './evaluaciones/gestionar-preguntas/gestionar-preguntas.component'
import { PreguntasComponent } from './evaluacion/preguntas/preguntas.component'
import { EspecialistaUgelComponent } from './administrar/especialista-ugel/especialista-ugel.component'
import { MostrarEvaluacionComponent } from './examen/mostrar-evaluacion/mostrar-evaluacion.component'
import { RendirExamenComponent } from './examen/rendir-examen/rendir-examen.component'
import { AreasRendirExamenComponent } from './examen/areas-rendir-examen/areas-rendir-examen.component'*/

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'evaluacion/practicar',
    redirectTo: 'evaluacion-practica',
    pathMatch: 'full',
  },

  {
    path: 'evaluaciones/:iEvaluacionId/areas',
    component: ListaAreasComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: [ADMINISTRADOR_DREMO, ESPECIALISTA_DREMO, DIRECTOR_IE],
      breadcrumb: 'Lista de áreas',
      icon: 'pi pi-list-check',
    },
  },
  {
    path: 'evaluaciones',
    component: EvaluacionesComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: [ADMINISTRADOR_DREMO, ESPECIALISTA_DREMO, ESPECIALISTA_UGEL, DIRECTOR_IE],
      breadcrumb: 'Evaluaciones',
      icon: 'pi pi-check-square',
    },
  },
  {
    path: 'evaluaciones/:iEvaluacionId/areas/:iCursoNivelGradId/preguntas',
    component: PreguntasComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: [ADMINISTRADOR_DREMO, ESPECIALISTA_DREMO],
      breadcrumb: 'Gestionar Preguntas',
      icon: 'pi pi-list-check',
    },
  },
  {
    path: 'especialistas-dremo',
    canActivate: [RoleGuard],
    data: {
      expectedRole: [ADMINISTRADOR_DREMO],
      breadcrumb: 'Especialistas DREMO',
      icon: 'pi pi-cog',
    },
    children: [
      {
        path: 'asignar-areas',
        component: AsignarAreasEspecialistaDremoComponent,
        data: {
          breadcrumb: 'Asignar áreas',
          icon: 'pi pi-users',
        },
      },
    ],
  },
  {
    path: 'especialistas-ugel',
    canActivate: [RoleGuard],
    data: {
      expectedRole: [ADMINISTRADOR_DREMO],
      breadcrumb: 'Especialistas UGEL',
      icon: 'pi pi-cog',
    },
    children: [
      {
        path: 'asignar-areas',
        component: AsignarAreasEspecialistaUgelComponent,
        data: {
          breadcrumb: 'Asignar áreas',
          icon: 'pi pi-users',
        },
      },
    ],
  },
  {
    path: 'informes-ere',
    loadComponent: () =>
      import('./informes-ere/informes-ere/informes-ere.component').then(
        c => c.InformesEreComponent
      ),
  },
  {
    path: 'informes-comparar-ere',
    loadComponent: () =>
      import('./informes-ere/informes-comparar-ere/informes-comparar-ere.component').then(
        c => c.InformesCompararEreComponent
      ),
  },

  {
    path: 'evaluacion-practica',
    loadComponent: () =>
      import('./evaluaciones/evaluacion-practica/evaluacion-practica.component').then(
        c => c.EvaluacionPracticaComponent
      ),
  },

  {
    path: 'evaluacion/areas',
    component: AreasRendirExamenComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: [ESTUDIANTE],
      breadcrumb: 'Áreas Examen',
      icon: 'pi pi-share-alt',
    },
  },
  {
    ///:cEvaluacionNombre/:cCursoNombre/:cGradoNombre
    path: 'evaluaciones/:iEvaluacionId/areas/:iCursoNivelGradId/rendir',
    component: MostrarEvaluacionComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: [ESTUDIANTE],
      breadcrumb: 'Información Evaluación',
      icon: 'pi pi-share-alt',
    },
  },
  {
    //path: 'rendir-examen/:iEvaluacionId/areas/:iCursoNivelGradId/:cEvaluacionNombre/:cCursoNombre/:cGradoNombre',
    path: 'evaluaciones/:iEvaluacionId/areas/:iCursoNivelGradId/iniciar-evaluacion',
    component: RendirExamenComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: [ESTUDIANTE],
      breadcrumb: 'Rendir Examen',
      icon: 'pi pi-share-alt',
    },
  },
  {
    path: 'evaluaciones/:iEvaluacionId/exclusiones',
    component: EvaluacionExclusionesComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: [ADMINISTRADOR_DREMO, ESPECIALISTA_DREMO, ESPECIALISTA_UGEL, DIRECTOR_IE],
      breadcrumb: 'Gerstionar exclusiones',
      icon: 'pi pi-times',
    },
  },

  /*{
        path: 'banco-preguntas',
        loadComponent: () =>
            import(
                './evaluacion/preguntas/componentes/banco-preguntas/banco-preguntas-ere.component'
            ).then((c) => c.BancoPreguntasComponent),
    },*/
];

export class AppRoutingModule {}
export default routes;
