import { PrimengModule } from '@/app/primeng.module'
import {
    IActionTable,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'
import { Component, inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { DatosFichaBienestarService } from '../../../services/datos-ficha-bienestar.service'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { MessageService } from 'primeng/api'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'

@Component({
    selector: 'app-gestion-pandemia-dosis',
    standalone: true,
    imports: [PrimengModule, TablePrimengComponent],
    templateUrl: './gestion-pandemia-dosis.component.html',
    styleUrl: './gestion-pandemia-dosis.component.scss',
})
export class GestionPandemiaDosisComponent implements OnInit {
    formDosis: FormGroup
    pandemias: Array<object>
    dosis: any[]
    dosis_registrada: boolean = false
    visible: boolean = false
    caption: string = ''

    private _messageService = inject(MessageService)
    private _confirmService = inject(ConfirmationModalService)

    constructor(
        private fb: FormBuilder,
        private datosFichaBienestarService: DatosFichaBienestarService,
        private constantesService: ConstantesService
    ) {}

    ngOnInit(): void {
        try {
            this.formDosis = this.fb.group({
                iFichaGrlId: [null],
            })
        } catch (error) {
            console.log(error, 'error de formulario')
        }

        this.searchDosis()
    }

    searchDosis() {
        this.datosFichaBienestarService
            .searchDosis({
                iFichaGrlId: this.formDosis.get('iFichaGrlId')?.value,
            })
            .subscribe({
                next: (data: any) => {
                    console.log(data, 'search dosis')
                    this.dosis = data.data
                },
                error: (error) => {
                    console.error('Error al obtener dosis:', error)
                },
                complete: () => {},
            })
    }

    getPandemias() {
        this.datosFichaBienestarService.getPandemias().subscribe({
            next: (data: any) => {
                const item = data.data
                this.pandemias = item
            },
        })
    }

    //Maquetar tablas
    handleActions(actions) {
        console.log(actions)
    }

    clearForm() {
        this.formDosis.reset()
    }

    setFormDosis() {
        console.log(this.formDosis.value)
    }

    agregarDosis() {
        this.visible = true
    }

    borrarDosis(iPanDFichaId: any) {
        this.datosFichaBienestarService
            .borrarDosis({
                iMatrId: iPanDFichaId,
                iCredSesionId: this.constantesService.iCredId,
            })
            .subscribe({
                next: (data: any) => {
                    console.log(data, 'delete dosis')
                },
                error: (error) => {
                    console.error('Error eliminando dosis:', error)
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error,
                    })
                },
            })
    }

    guardarDosis() {
        console.log(this.formDosis.value)
    }

    actualizarDosis() {
        console.log(this.formDosis.value)
    }

    accionBtnItemTable({ accion, item }) {
        if (accion === 'editar') {
            this.visible = true
        }
        if (accion === 'anular') {
            this._confirmService.openConfirm({
                message: '¿Está seguro de anular la dosis seleccionada?',
                header: 'Anular dosis',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    this.borrarDosis(item?.iPanDFichaId)
                },
            })
        }
    }

    accionBtnItem(accion) {
        switch (accion) {
            case 'agregar':
                this.visible = true
        }
    }

    selectedItems = []

    actions: IActionTable[] = [
        {
            labelTooltip: 'Editar',
            icon: 'pi pi-pencil',
            accion: 'editar',
            type: 'item',
            class: 'p-button-rounded p-button-primary p-button-text',
        },
        {
            labelTooltip: 'Borrar',
            icon: 'pi pi-trash',
            accion: 'anular',
            type: 'item',
            class: 'p-button-rounded p-button-warning p-button-text',
        },
    ]

    actionsLista: IActionTable[]

    columns = [
        {
            type: 'item',
            width: '1rem',
            field: 'item',
            header: '',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '10rem',
            field: 'cPandemiaNombre',
            header: 'Pandemia',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'iPanDFichaNroDosis',
            header: 'Nro. de Dosis',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'dtPanDFichaDosis',
            header: 'Fecha',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'actions',
            width: '3rem',
            field: 'actions',
            header: 'Acciones',
            text_header: 'center',
            text: 'center',
        },
    ]
}
