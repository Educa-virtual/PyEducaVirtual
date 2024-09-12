import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { MenuItem } from 'primeng/api'
import { BreadcrumbModule } from 'primeng/breadcrumb'
import { TabMenuModule } from 'primeng/tabmenu'
import { TabViewModule } from 'primeng/tabview'
import { TabContenidoComponent } from '../tabs/tab-contenido/tab-contenido/tab-contenido.component'

@Component({
    selector: 'app-curso-detalle',
    standalone: true,
    imports: [
        CommonModule,
        BreadcrumbModule,
        TabMenuModule,
        TabViewModule,
        TabContenidoComponent,
    ],
    templateUrl: './curso-detalle.component.html',
    styleUrl: './curso-detalle.component.scss',
})
export class CursoDetalleComponent implements OnInit {
    items: MenuItem[] | undefined
    routeItems: MenuItem[] = []

    home: MenuItem | undefined

    rangeDates: Date[] | undefined

    ngOnInit() {
        this.items = [
            { icon: 'pi pi-home', route: '/aula-virtual' },
            { label: 'Cursos', route: '/aula-virtual/cursos' },
            { label: 'Matemática I', route: '/aula-virtual/cursos/0' },
        ]

        this.routeItems = [
            { label: 'Inicio', icon: 'pi pi-home' },
            { label: 'Contenido', icon: 'pi pi-book' },
            { label: 'Estudiantes', icon: 'pi pi-users' },
            { label: 'Calificaciones' },
        ]
    }
}
