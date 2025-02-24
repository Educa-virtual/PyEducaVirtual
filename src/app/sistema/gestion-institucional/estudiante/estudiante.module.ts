import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { BreadcrumbModule } from 'primeng/breadcrumb'
import { MenubarModule } from 'primeng/menubar'
import { TabMenuModule } from 'primeng/tabmenu'
import { StepsModule } from 'primeng/steps'
import { TieredMenuModule } from 'primeng/tieredmenu'
import { MenuModule } from 'primeng/menu'
import { ButtonModule } from 'primeng/button'
import { ContextMenuModule } from 'primeng/contextmenu'
import { MegaMenuModule } from 'primeng/megamenu'
import { PanelMenuModule } from 'primeng/panelmenu'
import { InputTextModule } from 'primeng/inputtext'
import { FormsModule } from '@angular/forms'

import { RegistroComponent } from './registro/registro.component'
import { RepresentanteComponent } from './registro/steps/representante/representante.component'
import { DiscapacidadComponent } from './registro/steps/discapacidad/discapacidad.component'
import { FamiliaComponent } from './registro/steps/familia/familia.component'

import { DatosComponent } from './registro/steps/datos/datos.component'
import { TreeTableModule } from 'primeng/treetable'
import { EstudianteComponent } from './estudiante.component'
@NgModule({
    imports: [
        CommonModule,
        BreadcrumbModule,
        MenubarModule,
        TabMenuModule,
        StepsModule,
        FormsModule,
        TieredMenuModule,
        MenuModule,
        ButtonModule,
        ContextMenuModule,
        MegaMenuModule,
        PanelMenuModule,
        InputTextModule,
        TreeTableModule,
        RouterModule.forChild([
            {
                path: '',
                component: EstudianteComponent,
                children: [
                    {
                        path: 'registro',
                        component: RegistroComponent,
                        children: [
                            {
                                path: '',
                                redirectTo: 'datos',
                                pathMatch: 'full',
                            },
                            {
                                path: 'datos',
                                component: DatosComponent,
                                canDeactivate: [],
                            },
                            {
                                path: 'representante',
                                component: RepresentanteComponent,
                                canDeactivate: [],
                            },
                            {
                                path: 'discapacidad',
                                component: DiscapacidadComponent,
                                canDeactivate: [],
                            },
                            {
                                path: 'familia',
                                component: FamiliaComponent,
                                canDeactivate: [],
                            },
                        ],
                    },
                ],
            },
        ]),
    ],

    exports: [RouterModule],
})
export class EstudianteModule {}
