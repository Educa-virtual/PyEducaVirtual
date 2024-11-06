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
import { PersonalComponent } from './personal.component'
import { PersonalComponent as viewPersonal } from './personal/personal.component'
import { RegistroComponent } from './registro/registro.component'
import { DatosPersonalesComponent } from './registro/steps/datos-personales/datos-personales.component'
import { AsignacionCargoComponent } from './registro/steps/asignacion-cargo/asignacion-cargo.component'

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
        RouterModule.forChild([
            {
                path: '',
                component: PersonalComponent,
                children: [
                    { path: '', redirectTo: 'administrar', pathMatch: 'full' },

                    {
                        path: 'administrar',
                        component: viewPersonal,
                        children: [
                            { path: '', component: viewPersonal}
                        ]
                    },
                    {
                        path: 'registro',
                        component: RegistroComponent,
                        children: [
                            { path: '', redirectTo: 'datos-personales', pathMatch: 'full' },
                            
                            {
                                path: 'datos-personales',
                                component: DatosPersonalesComponent,
                            },
                            {
                                path: 'asignacion-cargo',
                                component: AsignacionCargoComponent,
                            },
                        ],
                    },
                ],
            },
        ]),
    ],

    exports: [RouterModule],
})
export class PersonalModule {}
