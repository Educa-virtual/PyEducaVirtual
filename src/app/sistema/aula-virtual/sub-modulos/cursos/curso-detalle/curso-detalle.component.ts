import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { MenuItem } from 'primeng/api'
import { BreadcrumbModule } from 'primeng/breadcrumb'
import { TabMenuModule } from 'primeng/tabmenu'
import { TabViewModule } from 'primeng/tabview'
import { CursoDetalleNavigationComponent } from './curso-detalle-navigation/curso-detalle-navigation.component'
import { RouterOutlet } from '@angular/router'
import { PanelModule } from 'primeng/panel'
import { TabContenidoComponent } from './tabs/tab-contenido/tab-contenido.component'
import { TabsKeys } from './tabs/tab.interface'
import { TabEstudiantesComponent } from './tabs/tab-estudiantes/tab-estudiantes.component'
import { TabInicioComponent } from './tabs/tab-inicio/tab-inicio.component'
import { TabEvaluacionesComponent } from './tabs/tab-evaluaciones/tab-evaluaciones.component'

@Component({
    selector: 'app-curso-detalle',
    standalone: true,
    imports: [
        CommonModule,
        BreadcrumbModule,
        TabMenuModule,
        TabViewModule,
        TabContenidoComponent,
        CursoDetalleNavigationComponent,
        RouterOutlet,
        PanelModule,
        TabEstudiantesComponent,
        TabInicioComponent,
        TabEvaluacionesComponent,
    ],
    templateUrl: './curso-detalle.component.html',
    styleUrl: './curso-detalle.component.scss',
})
export class CursoDetalleComponent implements OnInit {
    tab: TabsKeys = 'inicio'

    items: MenuItem[] | undefined

    home: MenuItem | undefined

    rangeDates: Date[] | undefined

    ngOnInit() {
        this.items = [
            { icon: 'pi pi-home', route: '/aula-virtual' },
            { label: 'Cursos', route: '/aula-virtual/cursos' },
            { label: 'Matemática I', route: '/aula-virtual/cursos/0' },
        ]
    }

    updateTab(tab: TabsKeys) {
        this.tab = tab
    }
}
