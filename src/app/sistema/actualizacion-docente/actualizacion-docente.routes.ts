import { ADMINISTRADOR_DREMO, INSTRUCTOR, PARTICIPANTE } from '@/app/servicios/seg/perfiles';
import { RoleGuard } from '@/app/shared/_guards/role.guard';
import { Routes } from '@angular/router';
import { InstructoresComponent } from './instructores/instructores.component';
import { SolicitudInscripcionComponent } from './solicitud-Inscripcion/solicitud-Inscripcion.component';
import { AulaCardCapacitacionesComponent } from './aula-virtual-capacitaciones/aulaCard-capacitaciones/aulaCard-capacitaciones.component';
import { ResultadosCursosComponent } from './resultados-cursos/resultados-cursos.component';
import { CapacitacionesComponent } from './capacitaciones/capacitaciones.component';
import { MiRepositorioComponent } from './mi-repositorio/mi-repositorio.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [RoleGuard],
    data: {
      expectedRole: [ADMINISTRADOR_DREMO, PARTICIPANTE, INSTRUCTOR],
    },
    children: [
      {
        path: 'capacitaciones',
        component: SolicitudInscripcionComponent,
        data: {
          expectedRole: [ADMINISTRADOR_DREMO],
          breadcrumb: 'Capacitaciones',
          icon: 'pi pi-book',
        },
      },
      {
        path: 'instructores',
        component: InstructoresComponent,
        data: {
          expectedRole: [ADMINISTRADOR_DREMO],
          breadcrumb: 'Instructores',
          icon: 'pi pi-user',
        },
      },
      {
        path: 'aula-virtual',
        component: AulaCardCapacitacionesComponent,
        data: {
          expectedRole: [ADMINISTRADOR_DREMO],
          breadcrumb: 'Instructores',
          icon: 'pi pi-user',
        },
      },
      {
        path: 'resultados',
        component: ResultadosCursosComponent,
        data: {
          expectedRole: [ADMINISTRADOR_DREMO],
          breadcrumb: 'Resultados',
          icon: 'pi pi-user',
        },
      },
      {
        path: 'curso-capacitaciones',
        component: CapacitacionesComponent,
        data: {
          expectedRole: [INSTRUCTOR, PARTICIPANTE],
          breadcrumb: 'curso-capacitaciones',
          icon: 'pi pi-user',
        },
      },
      {
        path: 'mi-repositorio',
        component: MiRepositorioComponent,
        data: {
          expectedRole: [INSTRUCTOR],
          breadcrumb: 'Mi repositorio',
          icon: 'pi pi-folder-open',
        },
      },
    ],
  },
];

export class AppRoutingModule {}
export default routes;
