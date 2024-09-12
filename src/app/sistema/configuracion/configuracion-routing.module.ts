import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { PersonasComponent } from './personas/personas.component'

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: 'personas', component: PersonasComponent },
        ]),
    ],
    exports: [RouterModule],
})
export class ConfiguracionRoutingModule {}
