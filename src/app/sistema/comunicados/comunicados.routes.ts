import { RoleGuard } from '@/app/shared/_guards/role.guard';
import { Routes } from '@angular/router';
import {
  ADMINISTRADOR_DREMO,
  APODERADO,
  DIRECTOR_IE,
  DOCENTE,
  ESPECIALISTA_DREMO,
  ESPECIALISTA_UGEL,
  ESTUDIANTE,
} from '@/app/servicios/seg/perfiles';
import { GestionComunicadosComponent } from './gestion-comunicados/gestion-comunicados.component';
import { ComunicadoComponent } from './comunicado/comunicado.component';
import { ListaComunicadosComponent } from './lista-comunicados/lista-comunicados.component';

const emisores = [ADMINISTRADOR_DREMO, ESPECIALISTA_DREMO, ESPECIALISTA_UGEL, DIRECTOR_IE, DOCENTE];
const recipientes = [
  ESPECIALISTA_DREMO,
  ESPECIALISTA_UGEL,
  DIRECTOR_IE,
  DOCENTE,
  ESTUDIANTE,
  APODERADO,
];

const routes: Routes = [
  {
    path: 'gestion-comunicados',
    component: GestionComunicadosComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: emisores,
      breadcrumb: 'Gestionar comunicados',
    },
  },
  {
    path: 'nuevo-comunicado',
    component: ComunicadoComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: emisores,
      breadcrumb: 'Nuevo comunicado',
    },
  },
  {
    path: 'gestion-comunicados/:iComunicadoId',
    component: ComunicadoComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: emisores,
      breadcrumb: 'Ver comunicado',
    },
  },
  {
    path: 'lista-comunicados',
    component: ListaComunicadosComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: recipientes,
      breadcrumb: 'Lista de comunicados',
    },
  },
];

export class AppRoutingModule {}
export default routes;
