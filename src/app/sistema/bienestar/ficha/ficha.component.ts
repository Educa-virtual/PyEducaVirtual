import { PrimengModule } from '@/app/primeng.module'
import { Component } from '@angular/core'
import { MenuItem } from 'primeng/api'
import { ActivatedRoute } from '@angular/router'

@Component({
    selector: 'app-ficha',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './ficha.component.html',
    styleUrl: './ficha.component.scss',
})
export class FichaComponent {
    activeItem: any
    previousItem: any
    iFichaDGId: any = 0

    constructor(private route: ActivatedRoute) {
        this.route.parent?.paramMap.subscribe((params) => {
            this.iFichaDGId = params.get('id') || 0
        })
    }

    /**
     * Controlar accion al cambiar de pestaña
     * @param event
     */
    handleTabChange(newItem: MenuItem) {
        if (this.iFichaDGId === null) {
            this.activeItem = this.previousItem
        } else {
            this.previousItem = this.activeItem
            this.activeItem = newItem
        }
    }

    items: MenuItem[] = [
        {
            label: 'General',
            icon: 'pi pi-fw pi-user',
            route: `/bienestar/ficha/${this.iFichaDGId}/general`,
        },
        {
            label: 'Familia',
            icon: 'pi pi-fw pi-users',
            route: `/bienestar/ficha/${this.iFichaDGId}/familia`,
        },
        {
            label: 'Economico',
            icon: 'pi pi-fw pi-wallet',
            route: `/bienestar/ficha/${this.iFichaDGId}/economico`,
        },
        {
            label: 'Vivienda',
            icon: 'pi pi-fw pi-home',
            route: `/bienestar/ficha/${this.iFichaDGId}/vivienda`,
        },
        {
            label: 'Alimentación',
            icon: 'pi pi-fw pi-shopping-cart',
            route: `/bienestar/ficha/${this.iFichaDGId}/alimentacion`,
        },
        {
            label: 'Discapacidad',
            icon: 'pi pi-fw pi-heart-fill',
            route: `/bienestar/ficha/${this.iFichaDGId}/discapacidad`,
        },
        {
            label: 'Salud',
            icon: 'pi pi-fw pi-heart',
            route: `/bienestar/ficha/${this.iFichaDGId}/salud`,
        },
        {
            label: 'Recreación',
            icon: 'pi pi-fw pi-image',
            route: `/bienestar/ficha/${this.iFichaDGId}/recreacion`,
        },
    ]
}
