import { RoleGuard } from '@/app/shared/_guards/role.guard';
import { Routes } from '@angular/router';
import { CategoriasEncuestaComponent } from './lista-categorias/lista-categorias.component';
import { ListaEncuestasComponent } from './lista-encuestas/lista-encuestas.component';
import { EncuestaComponent } from './encuesta/encuesta.component';
import {
  ADMINISTRADOR_DREMO,
  DIRECTOR_IE,
  ESPECIALISTA_DREMO,
  ESPECIALISTA_UGEL,
  SUBDIRECTOR_IE,
} from '@/app/servicios/seg/perfiles';
import { LlenadoPreguntasEncuestaComponent } from './llenado-preguntas-encuesta/llenado-preguntas-encuesta.component';
import { EncuestaVerComponent } from './encuesta-ver/encuesta-ver.component';

const encuestadores = [
  ADMINISTRADOR_DREMO,
  ESPECIALISTA_DREMO,
  ESPECIALISTA_UGEL,
  DIRECTOR_IE,
  SUBDIRECTOR_IE,
];

const routes: Routes = [
  {
    path: 'categorias',
    component: CategoriasEncuestaComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: encuestadores,
      breadcrumb: 'Categorías',
    },
  },
  {
    path: 'categorias/:iCateId/encuestas',
    component: ListaEncuestasComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: encuestadores,
      breadcrumb: 'Encuestas',
    },
  },
  {
    path: 'categorias/:iCateId/nueva-encuesta',
    component: EncuestaComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: encuestadores,
      breadcrumb: 'Nueva encuesta',
    },
  },
  {
    path: 'categorias/:iCateId/encuestas/:iEncuId',
    component: EncuestaComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: encuestadores,
      breadcrumb: 'Encuesta',
    },
  },
  {
    path: 'categorias/:iCateId/encuestas/:iEncuId/preguntas',
    component: LlenadoPreguntasEncuestaComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: encuestadores,
      breadcrumb: 'Preguntas',
    },
  },
  {
    path: 'categorias/:iCateId/encuestas/:iEncuId/ver',
    component: EncuestaVerComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: encuestadores,
      breadcrumb: 'Ver Encuesta',
    },
  },
];

export class AppRoutingModule {}
export default routes;
