import { ESTUDIANTE } from '@/app/servicios/seg/perfiles';
import { RoleGuard } from '@/app/shared/_guards/role.guard';
import { Routes } from '@angular/router';
import { BuzonSugerenciasComponent } from './buzon-sugerencias/buzon-sugerencias.component';
import { HorarioComponent } from './horario/horario.component';
import { CalendarioComponent } from '../estudiante/calendario/calendario.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'buzon-sugerencias',
    component: BuzonSugerenciasComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: [ESTUDIANTE],
      breadcrumb: 'Áreas Examen',
      icon: 'pi pi-share-alt',
    },
  },
  {
    path: 'horario',
    component: HorarioComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: [ESTUDIANTE],
      breadcrumb: 'horario',
      icon: 'pi pi-share-alt',
    },
  },
  {
    path: 'calendario',
    component: CalendarioComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: [ESTUDIANTE],
      breadcrumb: 'calendario',
      icon: 'pi pi-share-alt',
    },
  },
];

export class AppRoutingModule {}
export default routes;
