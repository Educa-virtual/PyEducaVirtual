import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import {
    IActionTable,
    IColumn,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'
import { CommonModule } from '@angular/common'
import { Component, EventEmitter, inject, Input, Output } from '@angular/core'
import { DialogService } from 'primeng/dynamicdialog'
import { EncabezadoFormComponent } from './encabezado-form/encabezado-form.component'
import { MODAL_CONFIG } from '@/app/shared/constants/modal.config'
import { ButtonModule } from 'primeng/button'
import { ApiEvaluacionesRService } from '../../../services/api-evaluaciones-r.service'

@Component({
    selector: 'app-encabezados-preguntas',
    standalone: true,
    imports: [CommonModule, TablePrimengComponent, ButtonModule],
    templateUrl: './encabezados-preguntas.component.html',
    styleUrl: './encabezados-preguntas.component.scss',
})
export class EncabezadosPreguntasComponent {
    @Input() encabezados
    @Input() encabezado
    @Output() encabezadoChange = new EventEmitter()
    @Output() encabezadosChange = new EventEmitter()

    private _confirmService = inject(ConfirmationModalService)
    private _evaluacionesService = inject(ApiEvaluacionesRService)
    private _dialogService = inject(DialogService)

    public columnas: IColumn[] = [
        {
            field: '',
            header: '',
            type: 'radio',
            width: '2rem',
            text: 'left',
            text_header: 'Título',
        },
        {
            field: 'cEncabPregTitulo',
            header: 'Titúlo',
            type: 'text',
            width: '5rem',
            text: 'left',
            text_header: 'Título',
        },
        {
            field: 'cEncabPregContenido',
            header: 'Contenido',
            type: 'p-editor',
            width: '10rem',
            text: 'left',
            text_header: 'Puntaje',
        },
        {
            field: '',
            header: 'Acciones',
            type: 'actions',
            width: '5rem',
            text: 'left',
            text_header: '',
        },
    ]
    public accionesTabla: IActionTable[] = [
        {
            accion: 'editar',
            labelTooltip: 'Editar',
            icon: 'pi pi-pencil',
            type: 'item',
            class: 'p-button-rounded p-button-warning p-button-text',
        },
        {
            accion: 'eliminar',
            labelTooltip: 'Eliminar',
            icon: 'pi pi-trash',
            type: 'item',
            class: 'p-button-rounded p-button-danger p-button-text',
        },
    ]

    public accionBtnItemTable({ accion, item }) {
        if (accion === 'eliminar') {
            this.eliminarEncabezado(item)
        }
        if (accion === 'editar') {
            this.agregarActualizarEncabezadoForm(item)
        }
    }

    private async eliminarEncabezado(item) {
        this._confirmService.openConfirm({
            header: 'Esta seguro de eliminar el encabezado?',
            accept: () => {
                this._evaluacionesService
                    .eliminarEncabezadoPreguntaById(item.iEncabPregId)
                    .subscribe({
                        next: () => {
                            this.encabezados = this.encabezados.filter(
                                (enc) => enc.iEncabPregId != item.iEncabPregId
                            )
                        },
                    })
            },
        })
    }

    agregarActualizarEncabezadoForm(encabezado) {
        const refModal = this._dialogService.open(EncabezadoFormComponent, {
            ...MODAL_CONFIG,
            data: {
                encabezado,
            },
            header:
                encabezado == null
                    ? 'Agregar Encabezado'
                    : 'Actualizar Encabezado',
        })
        refModal.onClose.subscribe((result) => {
            if (result) {
                const existeEncabezado = this.encabezados.some((x) => {
                    return x.iEncabPregId == result.iEncabPregId
                })

                // si existe actualizar el encabezado
                if (existeEncabezado) {
                    const index = this.encabezados.findIndex(
                        (x) => x.iEncabPregId == result.iEncabPregId
                    )

                    this.encabezados[index] = result
                    this.encabezadosChange.emit(this.encabezados)
                } else {
                    this.encabezados.push(result)
                    this.encabezadosChange.emit(this.encabezados)
                }
            }
        })
    }

    public onSelectionChange(event) {
        this.encabezadoChange.emit(event)
    }
}
