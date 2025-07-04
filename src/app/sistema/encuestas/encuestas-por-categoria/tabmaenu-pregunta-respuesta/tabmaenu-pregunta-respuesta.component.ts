import { Component, OnInit } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { MenuItem } from 'primeng/api'
@Component({
    selector: 'app-tabmaenu-pregunta-respuesta',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './tabmaenu-pregunta-respuesta.component.html',
    styleUrl: './tabmaenu-pregunta-respuesta.component.scss',
})
export class TabmaenuPreguntaRespuestaComponent implements OnInit {
    // Tab menu
    items: MenuItem[] | undefined
    activeItem: MenuItem | undefined

    ngOnInit() {
        this.items = [
            {
                label: 'Dashboard',
                icon: 'pi pi-home',
                routerLink: '/sistema/encuestas/gestion-encuesta-configuracion',
            },
            { label: 'Transactions', icon: 'pi pi-chart-line' },
            { label: 'Products', icon: 'pi pi-list' },
        ]

        this.activeItem = this.items[0]
    }
    onActiveItemChange(event: MenuItem) {
        this.activeItem = event
    }
}
