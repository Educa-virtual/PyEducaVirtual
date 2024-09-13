import { NgClass } from '@angular/common'
import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { MenuItem } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { MenuModule } from 'primeng/menu'
import { PanelModule } from 'primeng/panel'

@Component({
    selector: 'app-curso-detalle-navigation',
    standalone: true,
    imports: [NgClass, PanelModule, MenuModule, ButtonModule],
    templateUrl: './curso-detalle-navigation.component.html',
    styleUrl: './curso-detalle-navigation.component.scss',
})
export class CursoDetalleNavigationComponent implements OnInit {
    items: MenuItem[] | undefined
    @Output() tabChange = new EventEmitter<string>()
    ngOnInit() {
        this.items = [
            {
                label: 'Inicio',
                icon: 'pi pi-home',
                tabindex: 'inicio',
            },
            {
                label: 'Contenido',
                icon: 'pi pi-book',
                tabindex: 'contenido',
            },
            {
                label: 'Estudiantes',
                icon: 'pi pi-users',
                tabindex: 'estudiantes',
            },
            {
                label: 'Rubricas',
                icon: 'pi pi-sitemap',
                tabindex: 'rubricas',
            },
            {
                label: 'Banco de preguntas',
                icon: 'pi pi-question',
                tabindex: 'banco-preguntas',
            },
        ]
    }

    updateTab(tab: string) {
        this.tabChange.emit(tab)
    }
}
