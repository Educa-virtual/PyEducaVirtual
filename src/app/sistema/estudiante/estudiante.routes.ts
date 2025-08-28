import { ESTUDIANTE } from '@/app/servicios/seg/perfiles';
import { RoleGuard } from '@/app/shared/_guards/role.guard';
import { Routes } from '@angular/router';
import { HorarioComponent } from './horario/horario.component';
import { ReporteProgresoComponent } from './reportes-academicos/reporte-progreso/reporte-progreso.component';
import { ReporteAcademicoComponent } from './reportes-academicos/reporte-academico/reporte-academico.component';
import { ResultadosEreComponent } from './reportes-academicos/resultados-ere/resultados-ere.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'horario',
    component: HorarioComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: [ESTUDIANTE],
      breadcrumb: 'Horario',
      icon: 'pi pi-share-alt',
    },
  },
  {
    path: 'reportes-academicos/progreso',
    component: ReporteProgresoComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: [ESTUDIANTE],
      breadcrumb: 'Progreso',
      icon: 'pi pi-share-alt',
    },
  },
  {
    path: 'reportes-academicos/academico',
    component: ReporteAcademicoComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: [ESTUDIANTE],
      breadcrumb: 'Academico',
      icon: 'pi pi-chart-bar',
    },
  },
  {
    path: 'reportes-academicos/resultados-ere',
    component: ResultadosEreComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: [ESTUDIANTE],
      breadcrumb: 'Resultados ERE',
      icon: 'pi pi-chart-bar',
    },
  },
];

export class AppRoutingModule {}
export default routes;
