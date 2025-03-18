import {
    Component,
    EventEmitter,
    inject,
    Input,
    Output,
    OnChanges,
} from '@angular/core'
import { ButtonModule } from 'primeng/button'
import { TableModule } from 'primeng/table'
import { CommonModule } from '@angular/common'
import { DialogService } from 'primeng/dynamicdialog'
import { AlternativasFormComponent } from './alternativas-form/alternativas-form.component'
import { MODAL_CONFIG } from '@/app/shared/constants/modal.config'

import {
    IActionTable,
    IColumn,
    TablePrimengComponent,
} from '@shared/table-primeng/table-primeng.component'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
@Component({
    selector: 'app-alternativas',
    standalone: true,
    imports: [ButtonModule, TableModule, CommonModule, TablePrimengComponent],
    templateUrl: './alternativas.component.html',
    styleUrl: './alternativas.component.scss',
    providers: [DialogService],
})
export class AlternativasComponent implements OnChanges {
    @Input() alternativas = []
    @Input() pregunta
    @Input() serviceProvider
    @Output() alternativasEliminadasChange = new EventEmitter()
    @Output() alternativasChange = new EventEmitter()

    // injeccion de depedencias
    private _dialogService = inject(DialogService)
    private _confirmationModalService = inject(ConfirmationModalService)

    public alternativasEliminadas = []
    // alternativas de la tabla alternativas
    public columnas: IColumn[] = [
        {
            type: 'p-editor',
            width: '10rem',
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

    // ver cambios en las alternativas
    ngOnChanges(changes): void {
        this.alternativas = changes.alternativas.currentValue
    }

    // acciones de la tabla alternativas
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

    // Abrir modal alternativas form (agregar-actualizar)
    agregarActualizarAlternativa(alternativa) {
        const refModal = this._dialogService.open(AlternativasFormComponent, {
            ...MODAL_CONFIG,
            data: {
                alternativa: alternativa,
                pregunta: this.pregunta,
                alternativas: this.alternativas,
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
                this.actualizarAlternativas(result)
            }
        })
    }

    // actualizar alternativas de maner local
    actualizarAlternativas(alternativa) {
        const existeAlternativa = this.alternativas.some((x) => {
            return x.iAlternativaId == alternativa.iAlternativaId
        })

        // si existe actualizar alternativa
        if (existeAlternativa) {
            const index = this.alternativas.findIndex(
                (x) => x.iAlternativaId == alternativa.iAlternativaId
            )
            this.alternativas[index] = alternativa
        } else {
            this.alternativas.push(alternativa)
        }
        this.alternativasChange.emit(this.alternativas)
    }

    // eliminar alternativa confirmacion
    eliminarAlternativa(alternativa) {
        this._confirmationModalService.openConfirm({
            header: 'Esta seguro de eliminar la alternativa?',
            accept: () => {
                this.eliminarAlternativaLocal(alternativa)
                if (!alternativa.isLocal) {
                    this.alternativasEliminadas.push(alternativa)
                }
                this.alternativasEliminadasChange.emit(
                    this.alternativasEliminadas
                )
            },
        })
    }

    // eliminar alternativa de manera local
    eliminarAlternativaLocal(alternativa) {
        this.alternativas = this.alternativas.filter(
            (item) => item.iAlternativaId != alternativa.iAlternativaId
        )
        this.alternativasChange.emit(this.alternativas)
    }

    // manejar acciones de la tabla alternativas
    accionBtnItemTable({ accion, item }) {
        if (accion === 'eliminar') {
            this.eliminarAlternativa(item)
        }
        if (accion === 'editar') {
            this.agregarActualizarAlternativa(item)
        }
    }
}
