import { PrimengModule } from '@/app/primeng.module'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import {
    IActionTable,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'
import { Component, inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MessageService } from 'primeng/api'
import { DatosSugerenciaService } from '../services/datos.sugerencia.service'

@Component({
    selector: 'app-buzon-sugerencias',
    standalone: true,
    imports: [PrimengModule, TablePrimengComponent],
    templateUrl: './buzon-sugerencias.component.html',
    styleUrl: './buzon-sugerencias.component.scss',
})
export class BuzonSugerenciasComponent implements OnInit {
    form: FormGroup
    sede: any[]
    iSedeId: number
    iYAcadId: number

    visible: boolean = false //mostrar dialogo
    caption: string = '' // titulo o cabecera de dialogo
    c_accion: string //valos de las acciones

    sugerencias: any[]
    sugerencia_registrada: boolean = false
    prioridades: Array<object>
    destinos: Array<object>
    dialog_header: string

    private _MessageService = inject(MessageService) // dialog Mensaje simple
    private _confirmService = inject(ConfirmationModalService) // componente de dialog mensaje

    constructor(
        private fb: FormBuilder,
        private datosSugerenciaService: DatosSugerenciaService
    ) {}

    ngOnInit(): void {
        try {
            this.form = this.fb.group({
                iPrioridadId: [null, Validators.required],
                iDestinoId: [null, Validators.required],
                cAsunto: [null, Validators.required],
                cSugerencia: [null, Validators.required],
            })
        } catch (error) {
            console.log(error, 'error de formulario')
        }

        this.prioridades = [
            { id: 1, nombre: 'BAJA' },
            { id: 2, nombre: 'MEDIA' },
            { id: 3, nombre: 'ALTA' },
        ]

        this.destinos = [
            { id: 1, nombre: 'DIRECCION' },
            { id: 2, nombre: 'BIENESTAR' },
            { id: 3, nombre: 'TUTORIA' },
        ]
    }

    agregarSugerencia() {
        this.visible = true
        this.dialog_header = 'Registrar sugerencia'
        console.log('agregarSugerencia')
    }

    guardarSugerencia() {
        this.datosSugerenciaService
            .subirArchivoSugerencias(this.form.value)
            .subscribe({
                next: (data: any) => {
                    this.sugerencia_registrada = true
                    this._MessageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Estudiante registrado',
                    })
                    console.log(data, 'agregar estudiante')
                    this.visible = false
                },
                error: (error) => {
                    console.error('Error guardando estudiante:', error)
                    this._MessageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error,
                    })
                },
                complete: () => {
                    console.log('Request completed')
                },
            })
    }

    eliminarSugerencia(item: any) {
        console.log(item, 'eliminarSugerencia')
    }

    editarSugerencia(item: any) {
        console.log(item, 'editarSugerencia')
        this.dialog_header = 'Editar sugerencia'
    }

    actualizarSugerencia() {
        console.log('actualizarSugerencia')
    }

    seguimientoSugerencia(item: any) {
        console.log(item, 'seguimientoSugerencia')
    }

    resetearInputs() {
        this.form.reset()
    }

    accionBtnItemTable({ accion, item }) {
        if (accion === 'editar') {
            this.editarSugerencia(item)
        }
        if (accion === 'seguimiento') {
            this.seguimientoSugerencia(item)
        }
        if (accion === 'anular') {
            this.eliminarSugerencia(item)
        }
    }

    selectedItems = []

    actions: IActionTable[] = [
        {
            labelTooltip: 'Editar sugerencia',
            icon: 'pi pi-pencil',
            accion: 'editar',
            type: 'item',
            class: 'p-button-rounded p-button-primary p-button-text',
        },
        {
            labelTooltip: 'Seguimiento de sugerencia',
            icon: 'pi pi-user-edit',
            accion: 'seguimiento',
            type: 'item',
            class: 'p-button-rounded p-button-secondary p-button-text',
        },
        {
            labelTooltip: 'Anular sugerencia',
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
            header: 'Item',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'fecha',
            header: 'Fecha',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '15rem',
            field: 'asunto',
            header: 'Asunto',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'estado',
            header: 'Estado',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '3rem',
            field: 'prioridad',
            header: 'Prioridad',
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
