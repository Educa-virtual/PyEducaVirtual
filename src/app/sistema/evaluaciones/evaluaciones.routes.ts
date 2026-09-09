import { Routes } from '@angular/router';
import { EstudiantesLogroAlcanzadoComponent } from './logro-alcanzado/estudiantes-logro-alcanzado/estudiantes-logro-alcanzado.component';
import { RoleGuard } from '@/app/shared/_guards/role.guard';
import { DOCENTE } from '@/app/servicios/seg/perfiles';
import { LogroAlcanzadoComponent } from './logro-alcanzado/logro-alcanzado.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./sub-evaluaciones/dashboard/dashboard.routes'),
  },
  {
    path: 'evaluaciones',
    loadComponent: () =>
      import('./sub-evaluaciones/evaluaciones/evaluaciones.component').then(
        c => c.EvaluacionesComponent
      ),
  },
  {
    path: 'areas',
    loadComponent: () =>
      import('./sub-evaluaciones/areas/areas/areas.component').then(c => c.AreasComponent),
  },
  {
    path: 'areas/:areaId/banco-preguntas',
    loadComponent: () =>
      import('./sub-evaluaciones/banco-preguntas/banco-preguntas.component').then(
        c => c.BancoPreguntasComponent
      ),
    pathMatch: 'full',
  },
  {
    path: 'preguntas-activas',
    loadComponent: () =>
      import('./sub-evaluaciones/preguntas-activas/preguntas-activas.component').then(
        c => c.PreguntasActivasComponent
      ),
  },

  {
    path: 'competencias',
    loadComponent: () =>
      import('./sub-evaluaciones/competencias/competencias.component').then(
        c => c.CompetenciasComponent
      ),
  },
  {
    path: 'sub-evaluaciones/evaluacion-examen-ere',
    loadComponent: () =>
      import('./sub-evaluaciones/evaluacion-examen-ere/evaluacion-examen-ere.component').then(
        c => c.EvaluacionExamenEreComponent
      ),
  },
  {
    path: 'registro-logro',
    component: LogroAlcanzadoComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: [DOCENTE],
      breadcrumb: 'Reporte de Logros Alcanzados',
    },
  },
  {
    path: 'registro-logro/:idDocCursoId/estudiantes',
    component: EstudiantesLogroAlcanzadoComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: [DOCENTE],
      breadcrumb: 'Estudiantes',
    },
  },
];

export class AppRoutingModule {}
export default routes;
