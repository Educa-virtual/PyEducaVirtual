import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { PrincipalComponent } from './principal/principal.component'
import { FichaComponent } from './ficha/ficha.component'
import { FichaFamiliaComponent } from './ficha/ficha-familia/ficha-familia.component'

const routes: Routes = [
    { path: 'principal', component: PrincipalComponent },
    {
        path: 'ficha',
        component: FichaComponent,
        children: [
            { path: '', redirectTo: 'general', pathMatch: 'full' },
            { path: 'general', component: FichaFamiliaComponent },
            { path: 'familia', component: FichaFamiliaComponent },
        ],
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class BienestarRoutingModule {}
