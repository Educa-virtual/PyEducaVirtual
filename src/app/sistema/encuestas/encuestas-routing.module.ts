import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { GestionEncuestaConfiguracionComponent } from './lista-categorias/gestion-encuesta-configuracion/gestion-encuesta-configuracion.component'
import { InformacionGeneralComponent } from './lista-categorias/gestion-encuesta-configuracion/informacion-general/informacion-general.component'
import { LlenadoPreguntasEncuestaComponent } from './encuestas-por-categoria/llenado-preguntas-encuesta/llenado-preguntas-encuesta.component'

const routes: Routes = [
    {
        path: 'gestion-encuesta-configuracion',
        component: GestionEncuestaConfiguracionComponent,
        children: [
            { path: '', redirectTo: 'informacion-general', pathMatch: 'full' },
            {
                path: 'informacion-general',
                component: InformacionGeneralComponent,
            },
            //{ path: 'informacion', component: EncuestaInformacionComponent },
            //{ path: 'configuracion', component: EncuestaConfiguracionComponent },
        ],
    },
    // Encuestas Pregunta
    {
        path: 'llenado-pregunta-encuesta',
        component: LlenadoPreguntasEncuestaComponent,
        children: [
            { path: '', redirectTo: 'llenado-preguntas', pathMatch: 'full' },
            {
                path: 'llenado-preguntas',
                component: LlenadoPreguntasEncuestaComponent,
            },
        ],
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class EncuestasRoutingModule {}
