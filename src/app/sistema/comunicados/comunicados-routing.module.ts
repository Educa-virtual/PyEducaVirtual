import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { PrincipalComponent } from './principal/principal.component'

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: 'principal', component: PrincipalComponent },
        ]),
    ],
    exports: [RouterModule],
})
export class ComunicadosRoutingModule {}
