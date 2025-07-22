import { Routes } from '@angular/router'
import { FichaComponent } from './ficha/ficha.component'
import { FichaFamiliaComponent } from './ficha/ficha-familia/ficha-familia.component'
import { FichaEconomicoComponent } from './ficha/ficha-economico/ficha-economico.component'
import { FichaViviendaComponent } from './ficha/ficha-vivienda/ficha-vivienda.component'
import { FichaAlimentacionComponent } from './ficha/ficha-alimentacion/ficha-alimentacion.component'
import { FichaDiscapacidadComponent } from './ficha/ficha-discapacidad/ficha-discapacidad.component'
import { FichaSaludComponent } from './ficha/ficha-salud/ficha-salud.component'
import { FichaGeneralComponent } from './ficha/ficha-general/ficha-general.component'
import { GestionFichasComponent } from './gestion-fichas/gestion-fichas.component'
import { GestionFichasApoderadoComponent } from './gestion-fichas-apoderado/gestion-fichas-apoderado.component'
import { FichaRecreacionComponent } from './ficha/ficha-recreacion/ficha-recreacion.component'
import { GestionarEncuestasComponent } from './gestionar-encuestas/gestionar-encuestas.component'
import { RecordatorioFechasComponent } from './recordatorio-fechas/recordatorio-fechas.component'
import { FichaDeclaracionComponent } from './ficha/ficha-declaracion/ficha-declaracion.component'
import { EncuestaComponent } from './encuesta/encuesta.component'
import { EncuestaPreguntasComponent } from './encuesta/encuesta-preguntas/encuesta-preguntas.component'
import { EncuestaRespuestasComponent } from './encuesta/encuesta-respuestas/encuesta-respuestas.component'
import { EncuestaResumenComponent } from './encuesta/encuesta-resumen/encuesta-resumen.component'
import { EncuestaVerComponent } from './encuesta/encuesta-ver/encuesta-ver.component'
import { InformeEstadisticoComponent } from './informe-estadistico/informe-estadistico.component'
import { InformeAlimentacionComponent } from './informe-estadistico/informe-alimentacion/informe-alimentacion.component'
import { InformeSaludComponent } from './informe-estadistico/informe-salud/informe-salud.component'
import { InformeViviendaComponent } from './informe-estadistico/informe-vivienda/informe-vivienda.component'
import { InformeEconomicoComponent } from './informe-estadistico/informe-economico/informe-economico.component'
import { InformeFamiliaComponent } from './informe-estadistico/informe-familia/informe-familia.component'
import { InformeDiscapacidadComponent } from './informe-estadistico/informe-discapacidad/informe-discapacidad.component'
import { InformeRecreacionComponent } from './informe-estadistico/informe-recreacion/informe-recreacion.component'

const routes: Routes = [
    { path: 'gestion-fichas', component: GestionFichasComponent },
    {
        path: 'gestion-fichas-apoderado',
        component: GestionFichasApoderadoComponent,
    },
    { path: 'ficha-declaracion/:id', component: FichaDeclaracionComponent },
    { path: 'ficha-declaracion', component: FichaDeclaracionComponent },
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
    },
    { path: 'recordario-fechas', component: RecordatorioFechasComponent },
    { path: 'gestionar-encuestas', component: GestionarEncuestasComponent },
    { path: 'encuesta', component: EncuestaComponent },
    { path: 'encuesta/:id', component: EncuestaComponent },
    { path: 'encuesta/:id/preguntas', component: EncuestaPreguntasComponent },
    { path: 'encuesta/:id/respuestas', component: EncuestaRespuestasComponent },
    { path: 'encuesta/:id/resumen', component: EncuestaResumenComponent },
    { path: 'encuesta/:id/ver', component: EncuestaVerComponent },
    { path: 'encuesta/:id/ver/:matricula', component: EncuestaVerComponent },
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
        ],
    },
]

export class AppRoutingModule {}
export default routes
