import { Component, inject, Input } from '@angular/core'
import { ButtonModule } from 'primeng/button'

/*import { Product } from '@domain/product';
import { ProductService } from '@service/productservice';*/
import { TableModule } from 'primeng/table'
import { CommonModule } from '@angular/common'

/* modal  */
import { DialogService } from 'primeng/dynamicdialog'
import { AlternativasFormComponent } from '../alternativas/alternativas-form/alternativas-form.component'
import { MODAL_CONFIG } from '@/app/shared/constants/modal.config'

import {
    IActionTable,
    IColumn,
    TablePrimengComponent,
} from '../../../../../shared/table-primeng/table-primeng.component'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { ApiEvaluacionesService } from '../../../services/api-evaluaciones.service'
import { ConfirmationService } from 'primeng/api'
import { alertToConfirm } from '@/app/shared/utils/default-confirm-message'
@Component({
    selector: 'app-alternativas',
    standalone: true,
    imports: [ButtonModule, TableModule, CommonModule, TablePrimengComponent],
    templateUrl: './alternativas.component.html',
    styleUrl: './alternativas.component.scss',
    providers: [DialogService],
})
export class AlternativasComponent {
    @Input() alternativas = []
    @Input() pregunta
    private _dialogService = inject(DialogService)
    private _confirmationModalService = inject(ConfirmationModalService)
    private _evaluacionesService = inject(ApiEvaluacionesService)
    private _confirmationService = inject(ConfirmationService)
    public columnas: IColumn[] = [
        {
            type: 'text',
            width: '5rem',
            field: 'cAlternativaDescripcion',
            header: 'Descripción',
            text_header: 'left',
            text: 'left',
        },

        {
            type: 'text',
            width: '5rem',
            field: 'cAlternativaLetra',
            header: 'Letra Alternativa',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'estado',
            width: '5rem',
            field: 'bAlternativaCorrecta',
            header: 'Alternativa Correcta',
            text_header: 'left',
            text: 'left',
            customFalsy: {
                trueText: 'Correcta',
                falseText: 'Incorrecta',
            },
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cAlternativaExplicacion',
            header: 'Explicación',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'actions',
            width: '5rem',
            field: 'Acciones',
            header: 'Acciones',
            text_header: 'left',
            text: 'left',
        },
    ]

    public accionesTabla: IActionTable[] = [
        {
            labelTooltip: 'Editar',
            icon: 'pi pi-pencil',
            accion: 'editar',
            type: 'item',
            class: 'p-button-rounded p-button-warning p-button-text',
        },
        {
            labelTooltip: 'Eliminar',
            icon: 'pi pi-trash',
            accion: 'eliminar',
            type: 'item',
            class: 'p-button-rounded p-button-danger p-button-text',
        },
    ]

    agregarActualizarAlternativa(alternativa) {
        const refModal = this._dialogService.open(AlternativasFormComponent, {
            ...MODAL_CONFIG,
            data: {
                alternativa: alternativa,
                pregunta: this.pregunta,
            },
            header:
                alternativa == null
                    ? 'Agregar Alternativa'
                    : 'Actualizar Alternativa',
        })

        refModal.onClose.subscribe((result) => {
            if (result) {
                result.bAlternativaCorrecta = result.bAlternativaCorrecta
                    ? 1
                    : 0
                const existeAlternativa = this.alternativas.some(
                    (x) => x.iAlternativaId == result.iAlternativaId
                )
                if (existeAlternativa) {
                    this.alternativas[
                        this.alternativas.findIndex(
                            (x) => x.iAlternativaId == result.iAlternativaId
                        )
                    ] = result
                } else {
                    this.alternativas.push(result)
                }
            }
        })
    }

    eliminarAlternativa(alternativa) {
        this._confirmationModalService.openManual(
            alertToConfirm({
                header: 'Esta seguro de eliminar la alternativa?',
                accept: () => {},
                reject: () => {},
            })
        )
        if (alternativa.isLocal) {
            this.eliminarAlternativaLocal(alternativa)
            return
        }
        this._evaluacionesService
            .eliminarAlternativaById(alternativa.iAlternativaId)
            .subscribe({
                next: () => {
                    this.eliminarAlternativaLocal(alternativa)
                },
            })
    }

    eliminarAlternativaLocal(alternativa) {
        this.alternativas = this.alternativas.filter(
            (item) => item.iAlternativaId != alternativa.iAlternativaId
        )
    }

    accionBtnItemTable({ accion, item }) {
        if (accion === 'eliminar') {
            this.eliminarAlternativa(item)
        }
        if (accion === 'editar') {
            this.agregarActualizarAlternativa(item)
        }
    }
}
