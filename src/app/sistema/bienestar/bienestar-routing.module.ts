import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { FichaComponent } from './ficha/ficha.component'
import { FichaFamiliaComponent } from './ficha/ficha-familia/ficha-familia.component'
import { FichaEconomicoComponent } from './ficha/ficha-economico/ficha-economico.component'
import { FichaViviendaComponent } from './ficha/ficha-vivienda/ficha-vivienda.component'
import { FichaAlimentacionComponent } from './ficha/ficha-alimentacion/ficha-alimentacion.component'
import { FichaDiscapacidadComponent } from './ficha/ficha-discapacidad/ficha-discapacidad.component'
import { FichaSaludComponent } from './ficha/ficha-salud/ficha-salud.component'
import { FichasocgeneralComponent } from './fichasocgeneral/fichasocgeneral.component'
import { FichaSocioeconomicaComponent } from './ficha-socioeconomica/ficha-socioeconomica.component'
import { FichavistapoderadoComponent } from './fichavistapoderado/fichavistapoderado.component'
import { FichaRecreacionComponent } from './ficha/ficha-recreacion/ficha-recreacion.component'
const routes: Routes = [
    { path: 'ficha-socioeconomica', component: FichaSocioeconomicaComponent },
    { path: 'fichavistapoderado', component: FichavistapoderadoComponent },
    {
        path: 'ficha',
        component: FichaComponent,
        children: [
            { path: '', redirectTo: 'general', pathMatch: 'full' },
            { path: 'general', component: FichasocgeneralComponent },
            { path: 'familia', component: FichaFamiliaComponent },
            { path: 'economico', component: FichaEconomicoComponent },
            { path: 'vivienda', component: FichaViviendaComponent },
            { path: 'alimentacion', component: FichaAlimentacionComponent },
            { path: 'discapacidad', component: FichaDiscapacidadComponent },
            { path: 'salud', component: FichaSaludComponent },
            { path: 'recreacion', component: FichaRecreacionComponent },
        ],
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class BienestarRoutingModule {}
