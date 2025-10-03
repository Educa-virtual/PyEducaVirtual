import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from '@/app/shared/_guards/role.guard';
import { ApoderadoComponent } from './apoderado.component';
import { SeguimientoApoderadoComponent } from './seguimiento-apoderado/seguimiento-apoderado.component';
import { NotificacionApoderadoComponent } from './notificacion-apoderado/notificacion-apoderado.component';
import { RegistroApoderadoComponent } from './registro-apoderado/registro-apoderado.component';
import { APODERADO } from '@/app/servicios/seg/perfiles';
import { ReporteProgresoComponent } from './reportes-academicos/reporte-progreso/reporte-progreso.component';
//import { HorarioComponent } from './horario/horario.component'
//import { ConfiguracionHorarioComponent } from './horario/configuracion-horario/configuracion-horario.component'

const routes: Routes = [
  { path: 'apoderado', component: ApoderadoComponent },
  { path: 'seguimiento-apoderado', component: SeguimientoApoderadoComponent },
  {
    path: 'notificacion-apoderado',
    component: NotificacionApoderadoComponent,
  },
  { path: 'registro-apoderado', component: RegistroApoderadoComponent },
  {
    path: 'reportes-academicos/progreso',
    component: ReporteProgresoComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: [APODERADO],
      breadcrumb: 'Progreso',
      icon: 'pi pi-share-alt',
    },
  },
  // {
  //     path: 'horario',
  //     loadComponent: () =>
  //         import('./horario/horario.component').then(
  //             (c) => c.HorarioComponent
  //         ),
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApoderadoRoutingModule {}
