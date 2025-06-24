import { Routes } from '@angular/router'
import { GestionarEncuestasComponent } from './gestionar-encuestas/gestionar-encuestas.component'
import { EncuestaComponent } from './encuesta/encuesta.component'
import { EncuestaPreguntasComponent } from './encuesta/encuesta-preguntas/encuesta-preguntas.component'
import { EncuestaRespuestasComponent } from './encuesta/encuesta-respuestas/encuesta-respuestas.component'
import { EncuestaResumenComponent } from './encuesta/encuesta-resumen/encuesta-resumen.component'
import { EncuestaVerComponent } from './encuesta/encuesta-ver/encuesta-ver.component'

const routes: Routes = [
    { path: 'gestionar-encuestas', component: GestionarEncuestasComponent },
    { path: 'encuesta', component: EncuestaComponent },
    { path: 'encuesta/:id', component: EncuestaComponent },
    { path: 'encuesta/:id/preguntas', component: EncuestaPreguntasComponent },
    { path: 'encuesta/:id/respuestas', component: EncuestaRespuestasComponent },
    { path: 'encuesta/:id/resumen', component: EncuestaResumenComponent },
    { path: 'encuesta/:id/ver', component: EncuestaVerComponent },
]

export class AppRoutingModule {}
export default routes
