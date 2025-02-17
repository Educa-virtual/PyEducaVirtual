import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { CalendarioAcademicoComponent } from './calendario-academico/calendario-academico.component'
import { ConfigGradoSeccionComponent } from './config-grado-seccion/config-grado-seccion.component'
import { ConfigComponent } from './config-grado-seccion/steps/config/config.component'
import { ConfigAmbienteComponent } from './config-grado-seccion/steps/config-ambiente/config-ambiente.component'
import { ConfigGradoComponent } from './config-grado-seccion/steps/config-grado/config-grado.component'
import { ConfigSeccionComponent } from './config-grado-seccion/steps/config-seccion/config-seccion.component'
import { ConfigPlanEstudiosComponent } from './config-grado-seccion/steps/config-plan-estudios/config-plan-estudios.component'
import { ConfigHoraDocenteComponent } from './config-grado-seccion/steps/config-hora-docente/config-hora-docente.component'
import { ConfigAsignarGradoComponent } from './config-grado-seccion/steps/config-asignar-grado/config-asignar-grado.component'
import { ConfigResumenComponent } from './config-grado-seccion/steps/config-resumen/config-resumen.component'
import { ConfigFechasComponent } from './config-fechas/config-fechas.component'
import { IesPersonalComponent } from './ies-personal/ies-personal.component'
import { GestionTrasladosComponent } from './gestion-traslados/gestion-traslados.component'
import { GestionVacantesComponent } from './gestion-vacantes/gestion-vacantes.component'
import { InformacionComponent } from './informacion/informacion.component'

//import { HorarioComponent } from './horario/horario.component'
//import { ConfiguracionHorarioComponent } from './horario/configuracion-horario/configuracion-horario.component'

const routes: Routes = [
    { path: 'calendarioAcademico', component: CalendarioAcademicoComponent },
    { path: 'configGradoSeccion', component: ConfigGradoSeccionComponent },
    { path: 'config', component: ConfigComponent },
    { path: 'ambiente', component: ConfigAmbienteComponent },
    { path: 'grado', component: ConfigGradoComponent },
    { path: 'seccion', component: ConfigSeccionComponent },
    { path: 'plan-estudio', component: ConfigPlanEstudiosComponent },
    { path: 'hora-docente', component: ConfigHoraDocenteComponent },
    { path: 'asignar-grado', component: ConfigAsignarGradoComponent },
    { path: 'resumen', component: ConfigResumenComponent },
    { path: 'fechas', component: ConfigFechasComponent },
    { path: 'IesPersonal', component: IesPersonalComponent },
    { path: 'gestion-traslados', component: GestionTrasladosComponent },
    { path: 'gestion-vacantes', component: GestionVacantesComponent },
    { path: 'Informacion-ie', component: InformacionComponent },
    // { path: 'horario', component: HorarioComponent },
    //{ path: 'configurar-horario', component: ConfiguracionHorarioComponent },
    {
        path: 'horario',
        loadComponent: () =>
            import('./horario/horario.component').then(
                (c) => c.HorarioComponent
            ),
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
            import(
                './gestion-traslados/traslado-externo/traslado-externo.component'
            ).then((c) => c.TrasladoExternoComponent),
    },
    {
        path: 'traslado-interno',
        loadComponent: () =>
            import(
                './gestion-traslados/traslado-interno/traslado-interno.component'
            ).then((c) => c.TrasladoInternoComponent),
    },
    {
        path: 'configurar-horario',
        loadComponent: () =>
            import(
                './horario/configuracion-horario/configuracion-horario.component'
            ).then((c) => c.ConfiguracionHorarioComponent),
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class GestionInstitucionalRoutingModule {}
