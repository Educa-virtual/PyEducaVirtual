import { LocalStoreService } from '@/app/servicios/local-store.service'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { IActionContainer } from '@/app/shared/container-page/container-page.component'
import {
    IActionTable,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'
import { Component, inject, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { MessageService } from 'primeng/api'
import { DatosFichaBienestarService } from '../../services/datos-ficha-bienestar.service'
import { PrimengModule } from '@/app/primeng.module'
import { FichaFamiliaRegistroComponent } from './ficha-familia-registro/ficha-familia-registro.component'
import { CompartirFichaService } from '../../services/compartir-ficha.service'

@Component({
    selector: 'app-ficha-familia',
    standalone: true,
    imports: [
        PrimengModule,
        TablePrimengComponent,
        FichaFamiliaRegistroComponent,
    ],
    templateUrl: './ficha-familia.component.html',
    styleUrl: './ficha-familia.component.scss',
})
export class FichaFamiliaComponent implements OnInit {
    familiares: any[]
    visibleDialogFamiliar: boolean = false
    dialogTitle: string = ''
    iFamiliarId: string | null = null

    private _messageService = inject(MessageService) // dialog Mensaje simple
    private _confirmService = inject(ConfirmationModalService) // componente de dialog mensaje

    constructor(
        private router: Router,
        private store: LocalStoreService,
        private DatosFichaBienestarService: DatosFichaBienestarService,
        private compartirFichaService: CompartirFichaService
    ) {
        if (this.compartirFichaService.getiFichaDGId() === null) {
            this.router.navigate(['/bienestar/ficha/general'])
        }
        this.compartirFichaService.setActiveIndex(1)
    }

    ngOnInit(): void {
        if (this.compartirFichaService.getiFichaDGId() !== null) {
            this.searchFamiliares()
        }
    }

    visibleDialog(event: any) {
        this.visibleDialogFamiliar = event.value
        this.iFamiliarId = null
        this.searchFamiliares()
    }

    agregarFamiliar() {
        this.visibleDialogFamiliar = true
        this.iFamiliarId = null
        this.dialogTitle = 'Registrar familiar'
    }

    async searchFamiliares() {
        this.DatosFichaBienestarService.searchFamiliares({
            iFichaDGId: await this.compartirFichaService.getiFichaDGId(),
        }).subscribe({
            next: (data: any) => {
                this.familiares = data.data
            },
            error: (error) => {
                console.error('Error al obtener familiares:', error)
                this._messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error,
                })
            },
            complete: () => {},
        })
    }

    /**
     * Eliminar familiar seleccionado
     * @param item datos del familiar seleccionado
     */
    borrarFamiliar(item: any) {
        this.DatosFichaBienestarService.borrarFamiliar({
            iFamiliarId: item.iFamiliarId,
        }).subscribe({
            next: () => {
                this._messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Se eliminó exitosamente',
                })
                this.familiares = this.familiares.filter(
                    (item: any) => item.iFamiliarId !== item.iFamiliarId
                )
            },
            error: (error) => {
                console.error('Error eliminando familiar:', error)
                this._messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error,
                })
            },
        })
    }

    accionBtnItemTable({ accion, item }) {
        if (accion === 'editar') {
            this.visibleDialogFamiliar = true
            this.iFamiliarId = item.iFamiliarId
        }
        if (accion === 'anular') {
            this._confirmService.openConfirm({
                message:
                    '¿Está seguro de anular la relación familiar seleccionada?',
                header: 'Anular relación familiar',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    this.borrarFamiliar(item)
                },
            })
        }
    }

    accionBtnItem(accion) {
        switch (accion) {
            case 'agregar':
                this.visibleDialogFamiliar = true
                break
        }
    }

    //Maquetar tablas
    handleActions(actions) {
        console.log(actions)
    }

    accionesPrincipal: IActionContainer[] = [
        {
            labelTooltip: 'Registrar familiar',
            text: 'Registrar familiar',
            icon: 'pi pi-plus',
            accion: 'agregar',
            class: 'p-button-primary',
        },
    ]

    selectedItems = []

    actions: IActionTable[] = [
        {
            labelTooltip: 'Editar',
            icon: 'pi pi-pencil',
            accion: 'editar',
            type: 'item',
            class: 'p-button-rounded p-button-warning p-button-text',
        },
        {
            labelTooltip: 'Anular',
            icon: 'pi pi-trash',
            accion: 'anular',
            type: 'item',
            class: 'p-button-rounded p-button-primary p-button-text',
        },
    ]

    actionsLista: IActionTable[]

    columns = [
        {
            type: 'item',
            width: '5%',
            field: 'item',
            header: '',
            text_header: 'left',
            text: 'center',
        },
        {
            type: 'text',
            width: '15%',
            field: 'cTipoFamiliarDescripcion',
            header: 'Relación',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '10%',
            field: 'cTipoIdentSigla',
            header: 'Tipo de Doc.',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '15%',
            field: 'cPersDocumento',
            header: 'Documento',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '45%',
            field: 'cPersNombresApellidos',
            header: 'Nombre Completo',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'actions',
            width: '10%',
            field: 'actions',
            header: 'Acciones',
            text_header: 'center',
            text: 'center',
        },
    ]
}
