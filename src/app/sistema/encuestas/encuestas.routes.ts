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
import { VerEncuestaComponent } from './ver-encuesta/ver-encuesta.component';
import { GestionEncuestasComponent } from './gestion-encuestas/gestion-encuestas.component';
import { RespuestasEncuestaComponent } from './respuestas-encuesta/respuestas-encuesta.component';
import { ResumenEncuestaComponent } from './resumen-encuesta/resumen-encuesta.component';
import { PlantillaComponent } from './plantillas/plantilla/plantilla.component';
import { GestionPlantillasComponent } from './plantillas/gestion-plantillas/gestion-plantillas.component';
import { LlenadoPreguntasPlantillaComponent } from './plantillas/llenado-preguntas-encuesta/llenado-preguntas-plantilla.component';
import { PlantillaFijaComponent } from './plantillas/plantilla-fija/plantilla-fija.component';
import { EncuestaFijaComponent } from './encuesta-fija/encuesta-fija.component';
import { VerPlantillaComponent } from './plantillas/ver-plantilla/ver-plantilla.component';

const encuestadores = [
  ADMINISTRADOR_DREMO,
  ESPECIALISTA_DREMO,
  ESPECIALISTA_UGEL,
  DIRECTOR_IE,
  SUBDIRECTOR_IE,
];
const encuestados = [
  ADMINISTRADOR_DREMO,
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
    path: 'categorias/:iCateId/nueva-encuesta-fija',
    component: EncuestaFijaComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: encuestadores,
      breadcrumb: 'Nueva encuesta fija',
    },
  },
  {
    path: 'categorias/:iCateId/gestion-encuestas/:iEncuId/fija',
    component: EncuestaFijaComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: encuestadores,
      breadcrumb: 'Encuesta fija',
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
    component: VerEncuestaComponent,
    canActivate: [RoleGuard],
    data: {
      es_encuestador: true,
      expectedRole: encuestadores,
      breadcrumb: 'Ver Encuesta',
    },
  },
  {
    path: 'categorias/:iCateId/gestion-encuestas/:iEncuId/ver/:iPersId',
    component: VerEncuestaComponent,
    canActivate: [RoleGuard],
    data: {
      es_encuestador: true,
      expectedRole: encuestadores,
      breadcrumb: 'Ver Encuesta',
    },
  },
  {
    path: 'categorias/:iCateId/lista-encuestas/:iEncuId/ver',
    component: VerEncuestaComponent,
    canActivate: [RoleGuard],
    data: {
      es_encuestador: false,
      expectedRole: encuestados,
      breadcrumb: 'Responder Encuesta',
    },
  },
  {
    path: 'categorias/:iCateId/lista-encuestas/:iEncuId/ver/:iPersId',
    component: VerEncuestaComponent,
    canActivate: [RoleGuard],
    data: {
      es_encuestador: false,
      expectedRole: encuestados,
      breadcrumb: 'Responder Encuesta',
    },
  },
  {
    path: 'categorias/:iCateId/gestion-encuestas/:iEncuId/respuestas',
    component: RespuestasEncuestaComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: encuestadores,
      breadcrumb: 'Ver Respuestas',
    },
  },
  {
    path: 'categorias/:iCateId/gestion-encuestas/:iEncuId/resumen',
    component: ResumenEncuestaComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: encuestadores,
      breadcrumb: 'Ver Resumen',
    },
  },
  {
    path: 'categorias/:iCateId/gestion-plantillas',
    component: GestionPlantillasComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: encuestadores,
      breadcrumb: 'Gestionar plantillas',
    },
  },
  {
    path: 'categorias/:iCateId/gestion-plantillas/:iPlanId',
    component: PlantillaComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: encuestadores,
      breadcrumb: 'Plantilla',
    },
  },
  {
    path: 'categorias/:iCateId/nueva-plantilla',
    component: PlantillaComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: encuestadores,
      breadcrumb: 'Nueva plantilla',
    },
  },
  {
    path: 'categorias/:iCateId/nueva-plantilla-fija',
    component: PlantillaFijaComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: encuestadores,
      breadcrumb: 'Nueva plantilla fija',
    },
  },
  {
    path: 'categorias/:iCateId/gestion-plantillas/:iPlanId/fija',
    component: PlantillaFijaComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: encuestadores,
      breadcrumb: 'Plantilla fija',
    },
  },
  {
    path: 'categorias/:iCateId/gestion-plantillas/:iPlanId/preguntas',
    component: LlenadoPreguntasPlantillaComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: encuestadores,
      breadcrumb: 'Preguntas',
    },
  },
  {
    path: 'categorias/:iCateId/gestion-plantillas/:iPlanId/ver',
    component: VerPlantillaComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: encuestadores,
      breadcrumb: 'Ver Plantilla',
    },
  },
];

export class AppRoutingModule {}
export default routes;
