import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarioAcademicoComponent } from './calendario-academico/calendario-academico.component';
import { ConfigGradoSeccionComponent } from './config-grado-seccion/config-grado-seccion.component';
import { ConfigComponent } from './config-grado-seccion/steps/config/config.component';
import { ConfigAmbienteComponent } from './config-grado-seccion/steps/config-ambiente/config-ambiente.component';
import { ConfigGradoComponent } from './config-grado-seccion/steps/config-grado/config-grado.component';
import { ConfigSeccionComponent } from './config-grado-seccion/steps/config-seccion/config-seccion.component';
import { ConfigPlanEstudiosComponent } from './config-grado-seccion/steps/config-plan-estudios/config-plan-estudios.component';
import { ConfigHoraDocenteComponent } from './config-grado-seccion/steps/config-hora-docente/config-hora-docente.component';
import { ConfigAsignarGradoComponent } from './config-grado-seccion/steps/config-asignar-grado/config-asignar-grado.component';
import { ConfigResumenComponent } from './config-grado-seccion/steps/config-resumen/config-resumen.component';
import { ConfigFechasComponent } from './config-fechas/config-fechas.component';
import { IesPersonalComponent } from './ies-personal/ies-personal.component';
import { HorarioComponent } from './horario/horario.component';
import { ConfiguracionHorarioComponent } from './horario/configuracion-horario/configuracion-horario.component';
import { ReporteComponent } from './reporte/reporte.component';
import { EstadisticaComponent } from './estadistica/estadistica.component';
import { GestionTrasladosComponent } from './gestion-traslados/gestion-traslados.component';
import { GestionVacantesComponent } from './gestion-vacantes/gestion-vacantes.component';
import { InformacionComponent } from './informacion/informacion.component';
import { SincronizarArchivoComponent } from './sincronizar-archivo/sincronizar-archivo.component';
import { MantenimientoUsuariosComponent } from './mantenimiento/mantenimiento-usuarios/mantenimiento-usuarios.component';

//import { HorarioComponent } from './horario/horario.component'
//import { ConfiguracionHorarioComponent } from './horario/configuracion-horario/configuracion-horario.component'
import { GestionMatriculasComponent } from './matriculas/gestion-matriculas.component';
import { MatriculaMasivaComponent } from './matriculas/matricula-masiva/matricula-masiva.component';
import { MatriculaIndividualComponent } from './matriculas/matricula-individual/matricula-individual.component';
import { FechasImportentesComponent as FechasImportantesComponent } from './fechas-importantes/fechas-importantes.component';
import { YearsComponent } from './years/years.component';
import { DIRECTOR_IE, ADMINISTRADOR_DREMO } from '@/app/servicios/seg/perfiles';
import { CalendarioEscolarComponent } from './calendario-escolar/calendario-escolar.component';
import { RoleGuard } from '@/app/shared/_guards/role.guard';
import { ReporteIndicadoresComponent } from './reportes-estadisticas/reporte-indicadores/reporte-indicadores.component';

import { GestionDesercionComponent } from './gestion-desercion/gestion-desercion.component';
const routes: Routes = [
  {
    path: 'calendarioAcademico',
    component: CalendarioAcademicoComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: [DIRECTOR_IE, ADMINISTRADOR_DREMO],
    },
  },
  {
    path: 'years-academicos',
    component: YearsComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: [DIRECTOR_IE, ADMINISTRADOR_DREMO],
    },
  },
  {
    path: 'configGradoSeccion',
    component: ConfigGradoSeccionComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: [DIRECTOR_IE],
    },
  },
  {
    path: 'config',
    component: ConfigComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: [DIRECTOR_IE],
    },
  },
  {
    path: 'ambiente',
    component: ConfigAmbienteComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: [DIRECTOR_IE],
    },
  },
  {
    path: 'grado',
    component: ConfigGradoComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: [DIRECTOR_IE],
    },
  },
  {
    path: 'seccion',
    component: ConfigSeccionComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: [DIRECTOR_IE],
    },
  },
  {
    path: 'plan-estudio',
    component: ConfigPlanEstudiosComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: [DIRECTOR_IE],
    },
  },
  {
    path: 'hora-docente',
    component: ConfigHoraDocenteComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: [DIRECTOR_IE],
    },
  },
  {
    path: 'asignar-grado',
    component: ConfigAsignarGradoComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: [DIRECTOR_IE],
    },
  },
  {
    path: 'resumen',
    component: ConfigResumenComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: [DIRECTOR_IE],
    },
  },
  {
    path: 'fechas-nacionales',
    component: ConfigFechasComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: [ADMINISTRADOR_DREMO],
    },
  },
  {
    path: 'fechas-importantes',
    component: FechasImportantesComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: [DIRECTOR_IE],
    },
  },
  {
    path: 'IesPersonal',
    component: IesPersonalComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: [DIRECTOR_IE],
    },
  },
  {
    path: 'horario',
    component: HorarioComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: [DIRECTOR_IE],
    },
  },
  {
    path: 'configurar-horario',
    component: ConfiguracionHorarioComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: [DIRECTOR_IE],
    },
  },
  {
    path: 'reportes-academicos',
    component: ReporteComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: [DIRECTOR_IE],
    },
  },
  {
    path: 'estadistica',
    component: EstadisticaComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: [DIRECTOR_IE],
    },
  },
  {
    path: 'gestion-traslados',
    component: GestionTrasladosComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: [DIRECTOR_IE],
    },
  },
  {
    path: 'gestion-vacantes',
    component: GestionVacantesComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: [DIRECTOR_IE],
    },
  },
  {
    path: 'Informacion-ie',
    component: InformacionComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: [DIRECTOR_IE],
    },
  },
  {
    path: 'sincronizar-archivo',
    component: SincronizarArchivoComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: [DIRECTOR_IE],
    },
  },
  //{ path: 'mantenimiento-ciclo', component: SincronizarArchivoComponent },

  // { path: 'horario', component: HorarioComponent },
  //{ path: 'configurar-horario', component: ConfiguracionHorarioComponent },
  {
    path: 'apertura',
    loadChildren: () => import('./apertura/configuracion.module').then(c => c.ConfiguracionModule),
    canActivate: [RoleGuard],
    data: {
      expectedRole: [DIRECTOR_IE],
    },
  },

  {
    path: 'horario',
    loadComponent: () => import('./horario/horario.component').then(c => c.HorarioComponent),
    canActivate: [RoleGuard],
    data: {
      expectedRole: [DIRECTOR_IE],
    },
  },

  // {
  //     path: 'gestion-traslados',
  //     loadComponent: () =>
  //         import('./gestion-traslados/gestion-traslados.component').then(
  //             (c) => c.GestionTrasladosComponent
  //         ),
  // },
  {
    path: 'traslado-externo',
    loadComponent: () =>
      import('./gestion-traslados/traslado-externo/traslado-externo.component').then(
        c => c.TrasladoExternoComponent
      ),
    canActivate: [RoleGuard],
    data: {
      expectedRole: [DIRECTOR_IE],
    },
  },

  {
    path: 'descargar-plantillas',
    loadComponent: () =>
      import('./descarga-plantillas/descarga-plantillas.component').then(
        c => c.DescargaPlantillasComponent
      ),
    canActivate: [RoleGuard],
    data: {
      expectedRole: [DIRECTOR_IE, ADMINISTRADOR_DREMO],
    },
  },
  {
    path: 'dashboard-indicadores',
    loadComponent: () =>
      import('./dashboard-indicadores/dashboard-indicadores.component').then(
        c => c.DashboardIndicadoresComponent
      ),
    canActivate: [RoleGuard],
    data: {
      expectedRole: [DIRECTOR_IE, ADMINISTRADOR_DREMO],
    },
  },

  {
    path: 'ciclo',
    loadComponent: () =>
      import('./mantenimiento/mantenimiento-ciclo/mantenimiento-ciclo.component').then(
        c => c.MantenimientoCicloComponent
      ),
    canActivate: [RoleGuard],
    data: {
      expectedRole: [DIRECTOR_IE],
    },
  },
  {
    path: 'traslado-interno',
    loadComponent: () =>
      import('./gestion-traslados/traslado-interno/traslado-interno.component').then(
        c => c.TrasladoInternoComponent
      ),
    canActivate: [RoleGuard],
    data: {
      expectedRole: [DIRECTOR_IE],
    },
  },
  {
    path: 'validacion-no-lectiva',
    loadComponent: () =>
      import('./actividad-no-lectiva/actividad-no-lectiva.component').then(
        c => c.ActividadNoLectivaComponent
      ),
    canActivate: [RoleGuard],
    data: {
      expectedRole: [DIRECTOR_IE],
    },
  },
  {
    path: 'configurar-horario',
    loadComponent: () =>
      import('./horario/configuracion-horario/configuracion-horario.component').then(
        c => c.ConfiguracionHorarioComponent
      ),
    canActivate: [RoleGuard],
    data: {
      expectedRole: [DIRECTOR_IE],
    },
  },
  {
    path: 'gestion-matriculas',
    component: GestionMatriculasComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: [DIRECTOR_IE],
    },
  },
  {
    path: 'matricula-individual',
    component: MatriculaIndividualComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: [DIRECTOR_IE],
    },
  },
  {
    path: 'matricula-masiva',
    component: MatriculaMasivaComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: [DIRECTOR_IE],
    },
  },

  {
    path: 'estudiante',
    loadChildren: () => import('./estudiante/estudiante.module').then(c => c.EstudianteModule),
  },
  {
    path: 'mantenimiento-usuario',
    component: MantenimientoUsuariosComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: [DIRECTOR_IE],
    },
  },
  {
    path: 'calendario-escolar',
    component: CalendarioEscolarComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: [DIRECTOR_IE],
      breadcrumb: 'calendario-escolar',
      icon: 'pi pi-book',
    },
  },

  {
    path: 'reporte-indicadores',
    component: ReporteIndicadoresComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: [ADMINISTRADOR_DREMO, DIRECTOR_IE],
      breadcrumb: 'Reporte de indicadores',
      icon: 'pi pi-folder-open',
    },
  },
  { path: 'gestion-deserciones', component: GestionDesercionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestionInstitucionalRoutingModule {}
