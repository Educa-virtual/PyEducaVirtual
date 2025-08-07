import { Routes } from '@angular/router';
import { FichaComponent } from './ficha/ficha.component';
import { FichaFamiliaComponent } from './ficha/ficha-familia/ficha-familia.component';
import { FichaEconomicoComponent } from './ficha/ficha-economico/ficha-economico.component';
import { FichaViviendaComponent } from './ficha/ficha-vivienda/ficha-vivienda.component';
import { FichaAlimentacionComponent } from './ficha/ficha-alimentacion/ficha-alimentacion.component';
import { FichaDiscapacidadComponent } from './ficha/ficha-discapacidad/ficha-discapacidad.component';
import { FichaSaludComponent } from './ficha/ficha-salud/ficha-salud.component';
import { FichaGeneralComponent } from './ficha/ficha-general/ficha-general.component';
import { GestionFichasComponent } from './gestion-fichas/gestion-fichas.component';
import { GestionFichasApoderadoComponent } from './gestion-fichas-apoderado/gestion-fichas-apoderado.component';
import { FichaRecreacionComponent } from './ficha/ficha-recreacion/ficha-recreacion.component';
import { GestionarEncuestasComponent } from './gestionar-encuestas/gestionar-encuestas.component';
import { RecordatorioFechasComponent } from './recordatorio-fechas/recordatorio-fechas.component';
import { FichaDeclaracionComponent } from './ficha/ficha-declaracion/ficha-declaracion.component';
import { EncuestaComponent } from './encuesta/encuesta.component';
import { EncuestaPreguntasComponent } from './encuesta/encuesta-preguntas/encuesta-preguntas.component';
import { EncuestaRespuestasComponent } from './encuesta/encuesta-respuestas/encuesta-respuestas.component';
import { EncuestaResumenComponent } from './encuesta/encuesta-resumen/encuesta-resumen.component';
import { EncuestaVerComponent } from './encuesta/encuesta-ver/encuesta-ver.component';
import { InformeEstadisticoComponent } from './informe-estadistico/informe-estadistico.component';
import { InformeAlimentacionComponent } from './informe-estadistico/informe-alimentacion/informe-alimentacion.component';
import { InformeSaludComponent } from './informe-estadistico/informe-salud/informe-salud.component';
import { InformeViviendaComponent } from './informe-estadistico/informe-vivienda/informe-vivienda.component';
import { InformeEconomicoComponent } from './informe-estadistico/informe-economico/informe-economico.component';
import { InformeFamiliaComponent } from './informe-estadistico/informe-familia/informe-familia.component';
import { InformeDiscapacidadComponent } from './informe-estadistico/informe-discapacidad/informe-discapacidad.component';
import { InformeRecreacionComponent } from './informe-estadistico/informe-recreacion/informe-recreacion.component';
import { InformeDemograficoComponent } from './informe-estadistico/informe-demografico/informe-demografico.component';
import { SeguimientoBienestarComponent } from './seguimiento-bienestar/seguimiento-bienestar.component';
import {
  ADMINISTRADOR_DREMO,
  APODERADO,
  ASISTENTE_SOCIAL,
  DIRECTOR_IE,
  DOCENTE,
  ESPECIALISTA_DREMO,
  ESPECIALISTA_UGEL,
  ESTUDIANTE,
  SUBDIRECTOR_IE,
} from '@/app/servicios/seg/perfiles';
import { RoleGuard } from '@/app/shared/_guards/role.guard';

const routes: Routes = [
  {
    path: 'gestion-fichas',
    component: GestionFichasComponent,
    canActivate: [RoleGuard],
    data: {
      breadcrumb: 'Gestión de Fichas',
      icon: 'pi pi-user-edit',
      expectedRole: [DIRECTOR_IE, SUBDIRECTOR_IE, ASISTENTE_SOCIAL],
    },
  },
  {
    path: 'gestion-fichas-apoderado',
    component: GestionFichasApoderadoComponent,
    canActivate: [RoleGuard],
    data: {
      breadcrumb: 'Gestión de Fichas Apoderado',
      icon: 'pi pi-user-edit',
      expectedRole: [APODERADO],
    },
  },
  {
    path: 'ficha-declaracion/:id',
    component: FichaDeclaracionComponent,
    canActivate: [RoleGuard],
    data: {
      breadcrumb: 'Gestión de Fichas Apoderado',
      icon: 'pi pi-user-edit',
      expectedRole: [ESTUDIANTE, APODERADO],
    },
  },
  {
    path: 'ficha-declaracion',
    component: FichaDeclaracionComponent,
    canActivate: [RoleGuard],
    data: {
      breadcrumb: 'Gestión de Fichas Apoderado',
      icon: 'pi pi-user-edit',
      expectedRole: [ESTUDIANTE, APODERADO],
    },
  },
  {
    path: 'ficha/:id',
    component: FichaComponent,
    children: [
      { path: '', redirectTo: 'general', pathMatch: 'full' },
      { path: 'general', component: FichaGeneralComponent },
      { path: 'familia', component: FichaFamiliaComponent },
      { path: 'economico', component: FichaEconomicoComponent },
      { path: 'vivienda', component: FichaViviendaComponent },
      { path: 'alimentacion', component: FichaAlimentacionComponent },
      { path: 'discapacidad', component: FichaDiscapacidadComponent },
      { path: 'salud', component: FichaSaludComponent },
      { path: 'recreacion', component: FichaRecreacionComponent },
    ],
    canActivate: [RoleGuard],
    data: {
      breadcrumb: 'Ficha',
      icon: 'pi pi-user-edit',
      expectedRole: [ESTUDIANTE, APODERADO],
    },
  },
  {
    path: 'recordario-fechas',
    component: RecordatorioFechasComponent,
    canActivate: [RoleGuard],
    data: {
      breadcrumb: '',
      icon: 'pi pi-bell',
      expectedRole: [
        DIRECTOR_IE,
        SUBDIRECTOR_IE,
        ASISTENTE_SOCIAL,
        ESPECIALISTA_DREMO,
        ESPECIALISTA_UGEL,
        ESTUDIANTE,
        DOCENTE,
      ],
    },
  },
  {
    path: 'gestionar-encuestas',
    component: GestionarEncuestasComponent,
    canActivate: [RoleGuard],
    data: {
      breadcrumb: '',
      icon: 'pi pi-list-check',
      expectedRole: [
        DIRECTOR_IE,
        SUBDIRECTOR_IE,
        ASISTENTE_SOCIAL,
        ESPECIALISTA_DREMO,
        ESPECIALISTA_UGEL,
        ESTUDIANTE,
        APODERADO,
      ],
    },
  },
  {
    path: 'encuesta',
    component: EncuestaComponent,
    canActivate: [RoleGuard],
    data: {
      breadcrumb: '',
      icon: 'pi pi-list-check',
      expectedRole: [
        DIRECTOR_IE,
        SUBDIRECTOR_IE,
        ASISTENTE_SOCIAL,
        ESPECIALISTA_DREMO,
        ESPECIALISTA_UGEL,
      ],
    },
  },
  {
    path: 'encuesta/:id',
    component: EncuestaComponent,
    canActivate: [RoleGuard],
    data: {
      breadcrumb: '',
      icon: 'pi pi-list-check',
      expectedRole: [
        DIRECTOR_IE,
        SUBDIRECTOR_IE,
        ASISTENTE_SOCIAL,
        ESPECIALISTA_DREMO,
        ESPECIALISTA_UGEL,
      ],
    },
  },
  {
    path: 'encuesta/:id/preguntas',
    component: EncuestaPreguntasComponent,
    canActivate: [RoleGuard],
    data: {
      breadcrumb: '',
      icon: 'pi pi-list-check',
      expectedRole: [
        DIRECTOR_IE,
        SUBDIRECTOR_IE,
        ASISTENTE_SOCIAL,
        ESPECIALISTA_DREMO,
        ESPECIALISTA_UGEL,
      ],
    },
  },
  {
    path: 'encuesta/:id/respuestas',
    component: EncuestaRespuestasComponent,
    canActivate: [RoleGuard],
    data: {
      breadcrumb: '',
      icon: 'pi pi-list-check',
      expectedRole: [
        DIRECTOR_IE,
        SUBDIRECTOR_IE,
        ASISTENTE_SOCIAL,
        ESPECIALISTA_DREMO,
        ESPECIALISTA_UGEL,
      ],
    },
  },
  {
    path: 'encuesta/:id/resumen',
    component: EncuestaResumenComponent,
    canActivate: [RoleGuard],
    data: {
      breadcrumb: '',
      icon: 'pi pi-list-check',
      expectedRole: [
        DIRECTOR_IE,
        SUBDIRECTOR_IE,
        ASISTENTE_SOCIAL,
        ESPECIALISTA_DREMO,
        ESPECIALISTA_UGEL,
      ],
    },
  },
  {
    path: 'encuesta/:id/ver',
    component: EncuestaVerComponent,
    canActivate: [RoleGuard],
    data: {
      breadcrumb: '',
      icon: 'pi pi-list-check',
      expectedRole: [ESTUDIANTE],
    },
  },
  {
    path: 'encuesta/:id/ver/:matricula',
    component: EncuestaVerComponent,
    canActivate: [RoleGuard],
    data: {
      breadcrumb: '',
      icon: 'pi pi-list-check',
      expectedRole: [
        DIRECTOR_IE,
        SUBDIRECTOR_IE,
        ASISTENTE_SOCIAL,
        ESPECIALISTA_DREMO,
        ESPECIALISTA_UGEL,
        ESTUDIANTE,
        APODERADO,
      ],
    },
  },
  {
    path: 'informe-estadistico',
    component: InformeEstadisticoComponent,
    children: [
      { path: '', redirectTo: 'familia', pathMatch: 'full' },
      { path: 'familia', component: InformeFamiliaComponent },
      { path: 'economico', component: InformeEconomicoComponent },
      { path: 'vivienda', component: InformeViviendaComponent },
      { path: 'alimentacion', component: InformeAlimentacionComponent },
      { path: 'discapacidad', component: InformeDiscapacidadComponent },
      { path: 'salud', component: InformeSaludComponent },
      { path: 'recreacion', component: InformeRecreacionComponent },
      { path: 'demografico', component: InformeDemograficoComponent },
    ],
    canActivate: [RoleGuard],
    data: {
      breadcrumb: 'Informe estadístico',
      icon: 'pi pi-chart-line',
      expectedRole: [
        DIRECTOR_IE,
        SUBDIRECTOR_IE,
        ASISTENTE_SOCIAL,
        ESPECIALISTA_DREMO,
        ESPECIALISTA_UGEL,
        ADMINISTRADOR_DREMO,
      ],
    },
  },
  {
    path: 'seguimiento-bienestar',
    component: SeguimientoBienestarComponent,
    canActivate: [RoleGuard],
    data: {
      breadcrumb: 'Seguimiento de bienestar',
      icon: 'pi pi-eye',
      expectedRole: [
        DIRECTOR_IE,
        SUBDIRECTOR_IE,
        ASISTENTE_SOCIAL,
        ESPECIALISTA_DREMO,
        ESPECIALISTA_UGEL,
        ADMINISTRADOR_DREMO,
      ],
    },
  },
];

export class AppRoutingModule {}
export default routes;
