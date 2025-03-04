import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { PrincipalComponent } from './principal/principal.component'
import { FichaComponent } from './ficha/ficha.component'
import { FichaFamiliaComponent } from './ficha/ficha-familia/ficha-familia.component'
import { FichaEconomicoComponent } from './ficha/ficha-economico/ficha-economico.component'
import { FichaViviendaComponent } from './ficha/ficha-vivienda/ficha-vivienda.component'
import { FichaAlimentacionComponent } from './ficha/ficha-alimentacion/ficha-alimentacion.component'

const routes: Routes = [
    { path: 'principal', component: PrincipalComponent },
    {
        path: 'ficha',
        component: FichaComponent,
        children: [
            { path: '', redirectTo: 'general', pathMatch: 'full' },
            { path: 'general', component: FichaFamiliaComponent },
            { path: 'familia', component: FichaFamiliaComponent },
            { path: 'economico', component: FichaEconomicoComponent },
            { path: 'vivienda', component: FichaViviendaComponent },
            { path: 'alimentacion', component: FichaAlimentacionComponent },
        ],
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class BienestarRoutingModule {}
