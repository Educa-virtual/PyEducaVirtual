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
const routes: Routes = [
  { path: 'calendarioAcademico', component: CalendarioAcademicoComponent },
  { path: 'years-academicos', component: YearsComponent },
  { path: 'configGradoSeccion', component: ConfigGradoSeccionComponent },
  { path: 'config', component: ConfigComponent },
  { path: 'ambiente', component: ConfigAmbienteComponent },
  { path: 'grado', component: ConfigGradoComponent },
  { path: 'seccion', component: ConfigSeccionComponent },
  { path: 'plan-estudio', component: ConfigPlanEstudiosComponent },
  { path: 'hora-docente', component: ConfigHoraDocenteComponent },
  { path: 'asignar-grado', component: ConfigAsignarGradoComponent },
  { path: 'resumen', component: ConfigResumenComponent },
  { path: 'fechas-nacionales', component: ConfigFechasComponent },
  { path: 'fechas-importantes', component: FechasImportantesComponent },
  { path: 'IesPersonal', component: IesPersonalComponent },
  { path: 'horario', component: HorarioComponent },
  { path: 'configurar-horario', component: ConfiguracionHorarioComponent },
  { path: 'reporte', component: ReporteComponent },
  { path: 'estadistica', component: EstadisticaComponent },
  { path: 'gestion-traslados', component: GestionTrasladosComponent },
  { path: 'gestion-vacantes', component: GestionVacantesComponent },
  { path: 'Informacion-ie', component: InformacionComponent },
  { path: 'sincronizar-archivo', component: SincronizarArchivoComponent },
  //{ path: 'mantenimiento-ciclo', component: SincronizarArchivoComponent },

  // { path: 'horario', component: HorarioComponent },
  //{ path: 'configurar-horario', component: ConfiguracionHorarioComponent },
  {
    path: 'apertura',
    loadChildren: () => import('./apertura/configuracion.module').then(c => c.ConfiguracionModule),
  },

  {
    path: 'horario',
    loadComponent: () => import('./horario/horario.component').then(c => c.HorarioComponent),
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
  },

  {
    path: 'descargar-plantillas',
    loadComponent: () =>
      import('./descarga-plantillas/descarga-plantillas.component').then(
        c => c.DescargaPlantillasComponent
      ),
  },
  {
    path: 'dashboard-indicadores',
    loadComponent: () =>
      import('./dashboard-indicadores/dashboard-indicadores.component').then(
        c => c.DashboardIndicadoresComponent
      ),
  },

  {
    path: 'ciclo',
    loadComponent: () =>
      import('./mantenimiento/mantenimiento-ciclo/mantenimiento-ciclo.component').then(
        c => c.MantenimientoCicloComponent
      ),
  },
  {
    path: 'traslado-interno',
    loadComponent: () =>
      import('./gestion-traslados/traslado-interno/traslado-interno.component').then(
        c => c.TrasladoInternoComponent
      ),
  },
  {
    path: 'validacion-no-lectiva',
    loadComponent: () =>
      import('./actividad-no-lectiva/actividad-no-lectiva.component').then(
        c => c.ActividadNoLectivaComponent
      ),
  },
  {
    path: 'configurar-horario',
    loadComponent: () =>
      import('./horario/configuracion-horario/configuracion-horario.component').then(
        c => c.ConfiguracionHorarioComponent
      ),
  },
  { path: 'gestion-matriculas', component: GestionMatriculasComponent },
  { path: 'matricula-individual', component: MatriculaIndividualComponent },
  { path: 'matricula-masiva', component: MatriculaMasivaComponent },

  {
    path: 'estudiante',
    loadChildren: () => import('./estudiante/estudiante.module').then(c => c.EstudianteModule),
  },
  {
    path: 'mantenimiento-usuario',
    component: MantenimientoUsuariosComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestionInstitucionalRoutingModule {}
