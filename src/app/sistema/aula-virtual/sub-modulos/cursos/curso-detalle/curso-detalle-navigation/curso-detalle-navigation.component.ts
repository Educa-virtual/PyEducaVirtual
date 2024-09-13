import { NgClass } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { MenuItem } from 'primeng/api'
import { MenuModule } from 'primeng/menu'
import { PanelModule } from 'primeng/panel'

@Component({
    selector: 'app-curso-detalle-navigation',
    standalone: true,
    imports: [NgClass, PanelModule, MenuModule],
    templateUrl: './curso-detalle-navigation.component.html',
    styleUrl: './curso-detalle-navigation.component.scss',
})
export class CursoDetalleNavigationComponent implements OnInit {
    items: MenuItem[] | undefined
    ngOnInit() {
        this.items = [
            {
                label: 'Inicio',
                icon: 'pi pi-home',
            },
            {
                label: 'Contenido',
                icon: 'pi pi-book',
            },
            {
                label: 'Estudiantes',
                icon: 'pi pi-users',
            },
            {
                label: 'Rubricas',
                icon: 'pi pi-sitemap',
            },
            {
                label: 'Banco de preguntas',
                icon: 'pi pi-question',
            },
        ]
    }
}
