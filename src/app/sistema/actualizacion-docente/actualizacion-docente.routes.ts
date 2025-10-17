import { ADMINISTRADOR_DREMO, INSTRUCTOR, PARTICIPANTE } from '@/app/servicios/seg/perfiles';
import { RoleGuard } from '@/app/shared/_guards/role.guard';
import { Routes } from '@angular/router';
import { InstructoresComponent } from './instructores/instructores.component';
import { SolicitudInscripcionComponent } from './solicitud-Inscripcion/solicitud-Inscripcion.component';
import { AulaCardCapacitacionesComponent } from './aula-virtual-capacitaciones/aulaCard-capacitaciones/aulaCard-capacitaciones.component';
import { ResultadosCursosComponent } from './resultados-cursos/resultados-cursos.component';
import { CapacitacionesComponent } from './capacitaciones/capacitaciones.component';
import { MiRepositorioComponent } from './mi-repositorio/mi-repositorio.component';
import { AperturaCursoComponent } from './apertura-curso/apertura-curso.component';
import { TiposPublicoComponent } from './mantenimiento/tipos-publico/tipos-publico.component';

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
        component: AperturaCursoComponent,
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
      {
        path: 'solicitudes',
        component: SolicitudInscripcionComponent,
        data: {
          expectedRole: [ADMINISTRADOR_DREMO],
          breadcrumb: 'Solicitudes',
          icon: 'pi pi-file-plus',
        },
      },
      {
        path: 'mantenimiento/tipos-publico',
        component: TiposPublicoComponent,
        data: {
          expectedRole: [ADMINISTRADOR_DREMO],
          breadcrumb: 'Tipos de público',
          icon: 'pi pi-users',
        },
      },
    ],
  },
];

export class AppRoutingModule {}
export default routes;
