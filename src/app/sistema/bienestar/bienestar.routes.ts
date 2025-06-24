import { Routes } from '@angular/router'
import { GestionarEncuestasComponent } from './gestionar-encuestas/gestionar-encuestas.component'
import { EncuestaComponent } from './encuesta/encuesta.component'
import { EncuestaPreguntasComponent } from './encuesta/encuesta-preguntas/encuesta-preguntas.component'

const routes: Routes = [
    { path: 'gestionar-encuestas', component: GestionarEncuestasComponent },
    { path: 'encuesta', component: EncuestaComponent },
    { path: 'encuesta/:id', component: EncuestaComponent },
    { path: 'encuesta/:id/preguntas', component: EncuestaPreguntasComponent },
    { path: 'encuesta/:id/respuestas', component: EncuestaPreguntasComponent },
    { path: 'encuesta/:id/resumen', component: EncuestaPreguntasComponent },
    { path: 'encuesta/:id/ver', component: EncuestaPreguntasComponent },
]

export class AppRoutingModule {}
export default routes
