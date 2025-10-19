import { RoleGuard } from '@/app/shared/_guards/role.guard';
import { Routes } from '@angular/router';
import { DIRECTOR_IE, DOCENTE } from '@/app/servicios/seg/perfiles';
import { GestionComunicadosComponent } from './gestion-comunicados/gestion-comunicados.component';
import { ComunicadoComponent } from './comunicado/comunicado.component';

const administradores = [DIRECTOR_IE, DOCENTE];

const routes: Routes = [
  {
    path: 'gestion-comunicados',
    component: GestionComunicadosComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: administradores,
      breadcrumb: 'Gestionar comunicados',
    },
  },
  {
    path: 'nuevo-comunicado',
    component: ComunicadoComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: administradores,
      breadcrumb: 'Nuevo comunicado',
    },
  },
  {
    path: 'gestion-comunicados/:iComunicadoId',
    component: ComunicadoComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: administradores,
      breadcrumb: 'Ver comunicado',
    },
  },
];

export class AppRoutingModule {}
export default routes;
