import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
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
const routes: Routes = [
    { path: 'gestion-fichas', component: GestionFichasComponent },
    {
        path: 'gestion-fichas-apoderado',
        component: GestionFichasApoderadoComponent,
    },
    {
        path: 'ficha',
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
    {
        path: 'ficha/:id',
        component: FichaComponent,
        children: [
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
    { path: 'gestionar-encuestas', component: GestionarEncuestasComponent },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class BienestarRoutingModule {}
