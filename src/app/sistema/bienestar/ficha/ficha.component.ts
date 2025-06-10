import { PrimengModule } from '@/app/primeng.module'
import { Component, OnInit } from '@angular/core'
import { MenuItem } from 'primeng/api'
import { ActivatedRoute, Router } from '@angular/router'
import { CompartirFichaService } from '../services/compartir-ficha.service'

@Component({
    selector: 'app-ficha',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './ficha.component.html',
    styleUrl: './ficha.component.scss',
})
export class FichaComponent implements OnInit {
    items: MenuItem[] = []
    activeItem: any
    previousItem: any
    iFichaDGId: any = 0

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private compartirFicha: CompartirFichaService
    ) {
        this.route.paramMap.subscribe((params: any) => {
            this.iFichaDGId = params.params.id || 0
        })
    }

    ngOnInit(): void {
        this.items = [
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
        this.compartirFicha.getActiveIndex().subscribe((value) => {
            this.activeItem = value
        })
    }

    /**
     * Controlar accion al cambiar de pestaña
     * @param event
     */
    handleTabChange() {
        if (this.iFichaDGId === null) {
            this.router.navigate(['/'])
        }
    }
}
