import { RoleGuard } from '@/app/shared/_guards/role.guard';
import { Routes } from '@angular/router';
import { CategoriasEncuestaComponent } from './lista-categorias/lista-categorias.component';
import { ListaEncuestasComponent } from './lista-encuestas/lista-encuestas.component';
import { EncuestaComponent } from './encuesta/encuesta.component';
import {
  ADMINISTRADOR_DREMO,
  APODERADO,
  DIRECTOR_IE,
  DOCENTE,
  ESPECIALISTA_DREMO,
  ESPECIALISTA_UGEL,
  ESTUDIANTE,
  SUBDIRECTOR_IE,
} from '@/app/servicios/seg/perfiles';
import { LlenadoPreguntasEncuestaComponent } from './llenado-preguntas-encuesta/llenado-preguntas-encuesta.component';
import { EncuestaVerComponent } from './encuesta-ver/encuesta-ver.component';
import { GestionEncuestasComponent } from './gestion-encuestas/gestion-encuestas.component';

const encuestadores = [
  ADMINISTRADOR_DREMO,
  ESPECIALISTA_DREMO,
  ESPECIALISTA_UGEL,
  DIRECTOR_IE,
  SUBDIRECTOR_IE,
];
const encuestados = [
  ESPECIALISTA_DREMO,
  ESPECIALISTA_UGEL,
  DIRECTOR_IE,
  SUBDIRECTOR_IE,
  DOCENTE,
  APODERADO,
  ESTUDIANTE,
];

const routes: Routes = [
  {
    path: 'categorias',
    component: CategoriasEncuestaComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: [...encuestados, ...encuestadores],
      breadcrumb: 'Categorías',
    },
  },
  {
    path: 'categorias/:iCateId/lista-encuestas',
    component: ListaEncuestasComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: encuestados,
      breadcrumb: 'Encuestas',
    },
  },
  {
    path: 'categorias/:iCateId/gestion-encuestas',
    component: GestionEncuestasComponent,
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
    path: 'categorias/:iCateId/gestion-encuestas/:iEncuId',
    component: EncuestaComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: encuestadores,
      breadcrumb: 'Encuesta',
    },
  },
  {
    path: 'categorias/:iCateId/gestion-encuestas/:iEncuId/preguntas',
    component: LlenadoPreguntasEncuestaComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: encuestadores,
      breadcrumb: 'Preguntas',
    },
  },
  {
    path: 'categorias/:iCateId/gestion-encuestas/:iEncuId/ver',
    component: EncuestaVerComponent,
    canActivate: [RoleGuard],
    data: {
      es_encuestador: true,
      expectedRole: encuestadores,
      breadcrumb: 'Ver Encuesta',
    },
  },
  {
    path: 'categorias/:iCateId/gestion-encuestas/:iEncuId/ver/:iPersId',
    component: EncuestaVerComponent,
    canActivate: [RoleGuard],
    data: {
      es_encuestador: true,
      expectedRole: encuestadores,
      breadcrumb: 'Ver Encuesta',
    },
  },
  {
    path: 'categorias/:iCateId/lista-encuestas/:iEncuId/ver',
    component: EncuestaVerComponent,
    canActivate: [RoleGuard],
    data: {
      es_encuestador: false,
      expectedRole: [...encuestados],
      breadcrumb: 'Responder Encuesta',
    },
  },
  {
    path: 'categorias/:iCateId/lista-encuestas/:iEncuId/ver/:iPersId',
    component: EncuestaVerComponent,
    canActivate: [RoleGuard],
    data: {
      es_encuestador: false,
      expectedRole: [...encuestados],
      breadcrumb: 'Responder Encuesta',
    },
  },
];

export class AppRoutingModule {}
export default routes;
