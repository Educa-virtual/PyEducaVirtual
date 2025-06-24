import { Routes } from '@angular/router'
import { GestionarEncuestasComponent } from './gestionar-encuestas/gestionar-encuestas.component'
import { EncuestaComponent } from './encuesta/encuesta.component'
import { EncuestaPreguntasComponent } from './encuesta-preguntas/encuesta-preguntas.component'

const routes: Routes = [
    { path: 'gestionar-encuestas', component: GestionarEncuestasComponent },
    { path: 'encuesta', component: EncuestaComponent },
    { path: 'encuesta/:id', component: EncuestaComponent },
    { path: 'encuesta/:id/preguntas', component: EncuestaPreguntasComponent },
]

export class AppRoutingModule {}
export default routes
