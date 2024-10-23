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
import { FormsModule } from '@angular/forms';

import { RegistroComponent } from './registro/registro.component'
import { DiasLaboralesComponent } from './registro/steps/diasLabolares/diasLaborales.component'
import { ModalidadesComponent } from './registro/steps/modalidades/modalidades.component'
import { ResumenComponent } from './resumen/resumen.component'
import { ResumenComponent as StepResumenComponent } from './registro/steps/resumen/resumen.component'
import { PeriodosAcademicosComponent } from './registro/steps/periodosAcademicos/periodosAcademicos.component'
import { TurnosComponent } from './registro/steps/turnos/turnos.component'
import { ConfiguracionComponent } from './configuracion.component'
import { YearComponent } from './registro/steps/year/year.component'
import { YearsComponent } from './years/years.component'
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
                path: "",
                component: ConfiguracionComponent,
                children: [
                    {
                        path: 'registro',
                        component: RegistroComponent,
                        children: [
                            { path: '', redirectTo: 'year', pathMatch: 'full' },
                            { path: 'year', component: YearComponent },
                            { path: 'diasLaborales', component: DiasLaboralesComponent },
                            { path: 'modalidades', component: ModalidadesComponent },
                            { path: 'turnos', component: TurnosComponent },
                            {
                                path: 'periodosAcademicos',
                                component: PeriodosAcademicosComponent,
                            },
                            { path: 'resumen', component: StepResumenComponent },
                        ],
                    },
                    {
                        path: 'resumen',
                        component: ResumenComponent,
                        children: [
                            { path: '', component: ResumenComponent}
                        ]
                    },
                    {
                        path: 'years',
                        component: YearsComponent,
                        children: [
                            { path: '', component: YearsComponent}
                        ]
                    },

                    { path: '', redirectTo: 'years', pathMatch: 'full' }
                ]
            },
        ]),
        
    ],
    
    exports: [RouterModule],
})
export class ConfiguracionModule {}
