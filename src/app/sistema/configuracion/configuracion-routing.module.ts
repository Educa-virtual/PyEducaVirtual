import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { PersonasComponent } from './personas/personas.component'
import { GestionTrasladosComponent } from './gestion-traslados/gestion-traslados.component'

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
            
            { path: 'gestion-traslados', component: GestionTrasladosComponent },
        ]),
    ],
    exports: [RouterModule],
})
export class ConfiguracionRoutingModule {}
