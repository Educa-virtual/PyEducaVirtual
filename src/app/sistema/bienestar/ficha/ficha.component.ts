import { PrimengModule } from '@/app/primeng.module'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { Component, inject, ViewChild } from '@angular/core'
import { MessageService } from 'primeng/api'
import { TabMenu } from 'primeng/tabmenu'

@Component({
    selector: 'app-ficha',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './ficha.component.html',
    styleUrl: './ficha.component.scss',
})
export class FichaComponent {
    @ViewChild('tabMenu') tabMenu: TabMenu

    private _messageService = inject(MessageService) // dialog Mensaje simple
    private _confirmService = inject(ConfirmationModalService) // componente de dialog mensaje

    /**
     * Controlar accion al cambiar de pestaña
     * @param event
     */
    handleTabChange(event: any) {
        console.log(event)
        this._confirmService.openConfirm({
            message: '¿Está seguro de anular la matrícula seleccionada?',
            header: 'Anular matrícula',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                // pasar a sgte. tab
            },
        })
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
