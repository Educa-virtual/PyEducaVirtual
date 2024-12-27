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
import { HorarioComponent } from './horario/horario.component'
import { ConfiguracionHorarioComponent } from './horario/configuracion-horario/configuracion-horario.component'

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
    { path: 'horario', component: HorarioComponent },
    { path: 'configurar-horario', component: ConfiguracionHorarioComponent },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class GestionInstitucionalRoutingModule {}
