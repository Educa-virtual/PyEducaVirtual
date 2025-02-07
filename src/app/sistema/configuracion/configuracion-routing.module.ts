import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { PersonasComponent } from './personas/personas.component'

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: 'personas', component: PersonasComponent },

            {
                path: 'configuracion',
                loadChildren: () =>
                    import('./configuracion/configuracion.module').then(
                        (c) => c.ConfiguracionModule
                    ),
            },

            {
                path: 'personal',
                loadChildren: () =>
                    import('./personal/personal.module').then(
                        (c) => c.PersonalModule
                    ),
            },
        ]),
    ],
    exports: [RouterModule],
})
export class ConfiguracionRoutingModule {}
