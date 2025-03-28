import { PrimengModule } from '@/app/primeng.module'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { Component, inject, OnInit, ViewChild } from '@angular/core'
import { MenuItem, MessageService } from 'primeng/api'
import { TabMenu } from 'primeng/tabmenu'
import { CompartirFichaService } from '../services/compartir-ficha.service'

@Component({
    selector: 'app-ficha',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './ficha.component.html',
    styleUrl: './ficha.component.scss',
})
export class FichaComponent implements OnInit {
    @ViewChild('tabMenu') tabMenu: TabMenu
    activeItem: any
    previousItem: any
    ficha_registrada: boolean | string = false

    private _messageService = inject(MessageService) // dialog Mensaje simple
    private _confirmService = inject(ConfirmationModalService) // componente de dialog mensaje

    constructor(private compartirFichaService: CompartirFichaService) {}

    ngOnInit(): void {
        this.activeItem = this.items[0]
        this.previousItem = this.items[0]

        this.ficha_registrada = this.compartirFichaService.getiFichaDGId()
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
