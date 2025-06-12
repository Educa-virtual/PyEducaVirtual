import { PrimengModule } from '@/app/primeng.module'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { Component, inject, OnInit } from '@angular/core'
import { MenuItem, MessageService } from 'primeng/api'
import { CompartirFichaService } from '../services/compartir-ficha.service'
import { DatosFichaBienestarService } from '../services/datos-ficha-bienestar.service'

@Component({
    selector: 'app-ficha',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './ficha.component.html',
    styleUrl: './ficha.component.scss',
})
export class FichaComponent implements OnInit {
    activeItem: any
    previousItem: any
    ficha_registrada: boolean | string = false
    ficha: any

    private _messageService = inject(MessageService) // dialog Mensaje simple
    private _confirmService = inject(ConfirmationModalService) // componente de dialog mensaje

    constructor(
        private compartirFichaService: CompartirFichaService,
        private datosFichaBienestarService: DatosFichaBienestarService
    ) {}

    async ngOnInit(): Promise<void> {
        this.compartirFichaService.setiPersId(
            this.compartirFichaService.perfil.iPersId
        )

        try {
            this.ficha = await this.datosFichaBienestarService.searchFicha({
                iPersId: this.compartirFichaService.perfil.iPersId,
                iYAcadId: this.compartirFichaService.iYAcadId,
            })
        } catch (error) {
            console.error('Error cargando ficha:', error)
            this._messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: error,
            })
        }

        if (this.ficha.data.length) {
            this.compartirFichaService.setiFichaDGId(
                this.ficha.data[0].iFichaDGId
            )
            this.ficha_registrada = true
            this.compartirFichaService
                .getActiveIndex()
                .subscribe((index: number) => {
                    this.activeItem = this.items[index]
                })
        } else {
            this.compartirFichaService.setiFichaDGId(null)
            this.ficha_registrada = false
        }
    }

    /**
     * Controlar accion al cambiar de pestaña
     * @param event
     */
    handleTabChange(newItem: MenuItem) {
        if (this.compartirFichaService.getiFichaDGId() === null) {
            this.activeItem = this.previousItem
        } else {
            this.previousItem = this.activeItem
            this.activeItem = newItem
        }
    }

    items = [
        {
            label: 'General',
            icon: 'pi pi-fw pi-user',
            route: '/bienestar/ficha/general',
        },
        {
            label: 'Familia',
            icon: 'pi pi-fw pi-users',
            route: '/bienestar/ficha/familia',
        },
        {
            label: 'Economico',
            icon: 'pi pi-fw pi-wallet',
            route: '/bienestar/ficha/economico',
        },
        {
            label: 'Vivienda',
            icon: 'pi pi-fw pi-home',
            route: '/bienestar/ficha/vivienda',
        },
        {
            label: 'Alimentación',
            icon: 'pi pi-fw pi-shopping-cart',
            route: '/bienestar/ficha/alimentacion',
        },
        {
            label: 'Discapacidad',
            icon: 'pi pi-fw pi-heart-fill',
            route: '/bienestar/ficha/discapacidad',
        },
        {
            label: 'Salud',
            icon: 'pi pi-fw pi-heart',
            route: '/bienestar/ficha/salud',
        },
        {
            label: 'Recreación',
            icon: 'pi pi-fw pi-image',
            route: '/bienestar/ficha/recreacion',
        },
    ]
}
