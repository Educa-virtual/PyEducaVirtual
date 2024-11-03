import { NgClass } from '@angular/common'
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { ButtonModule } from 'primeng/button'
import { MenuModule } from 'primeng/menu'
import { PanelModule } from 'primeng/panel'
import { ITabs, TabsKeys } from '../tabs/tab.interface'

@Component({
    selector: 'app-curso-detalle-navigation',
    standalone: true,
    imports: [NgClass, PanelModule, MenuModule, ButtonModule],
    templateUrl: './curso-detalle-navigation.component.html',
    styleUrl: './curso-detalle-navigation.component.scss',
})
export class CursoDetalleNavigationComponent implements OnInit {
    items: ITabs[] | undefined

    @Input({ required: true }) actualTab: TabsKeys
    @Output() tabChange = new EventEmitter<TabsKeys>()
    ngOnInit() {
        this.items = [
            {
                title: 'Inicio',
                icon: 'pi pi-home',
                tab: 'inicio',
            },
            {
                title: 'Contenido',
                icon: 'pi pi-book',
                tab: 'contenido',
            },
            {
                title: 'Estudiantes',
                icon: 'pi pi-users',
                tab: 'estudiantes',
            },
            {
                title: 'Resultado',
                icon: 'pi pi-users',
                tab: 'resultados',
            },
            // {
            //     title: '',
            //     icon: 'pi pi-users',
            //     tab: 'banco-preguntas',
            // },
        ]
    }

    updateTab(tab: TabsKeys) {
        this.tabChange.emit(tab)
    }
}
