import { ESTUDIANTE } from '@/app/servicios/seg/perfiles';
import { RoleGuard } from '@/app/shared/_guards/role.guard';
import { Routes } from '@angular/router';
import { HorarioComponent } from './horario/horario.component';

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
];

export class AppRoutingModule {}
export default routes;
