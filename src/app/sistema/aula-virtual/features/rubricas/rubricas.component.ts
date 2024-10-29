import {
    Component,
    inject,
    OnInit,
    OnDestroy,
    Input,
    Output,
    EventEmitter,
} from '@angular/core'
import { RubricasModule } from './rubricas.module'
import {
    IActionTable,
    IColumn,
} from '@/app/shared/table-primeng/table-primeng.component'
import { DialogService } from 'primeng/dynamicdialog'
import { RubricaFormComponent } from './components/rubrica-form/rubrica-form.component'
import { MODAL_CONFIG } from '@/app/shared/constants/modal.config'
import { ApiEvaluacionesService } from '@/app/sistema/evaluaciones/services/api-evaluaciones.service'
import { Subject, takeUntil } from 'rxjs'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { ConstantesService } from '@/app/servicios/constantes.service'

const SELECTION_ACTION: IActionTable = {
    labelTooltip: 'Seleccionar',
    icon: 'pi pi-check',
    accion: 'seleccionar',
    type: 'item',
    class: 'p-button-rounded p-button-primary p-button-text',
}

@Component({
    selector: 'app-rubricas',
    standalone: true,
    imports: [RubricasModule],
    templateUrl: './rubricas.component.html',
    styleUrl: './rubricas.component.scss',
})
export class RubricasComponent implements OnInit, OnDestroy {
    @Output() rubricaSelectedChange = new EventEmitter()
    @Input() public rubricaSelected = null
    @Input() mode: 'SELECTION' | 'NORMAL' = 'NORMAL'
    @Input() title: string = 'Rubricas'

    public columnasTabla: IColumn[] = [
        {
            type: 'text',
            width: '5rem',
            field: 'cInstrumentoNombre',
            header: 'Instrumento de Evaluación',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '10rem',
            field: 'cInstrumentoDescripcion',
            header: 'Descripcion',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'actions',
            width: '1rem',
            field: '',
            header: 'Acciones',
            text_header: 'left',
            text: 'left',
        },
    ]
    public accionesTabla: IActionTable[] = [
        {
            labelTooltip: 'Eliminar',
            icon: 'pi pi-trash',
            accion: 'eliminar',
            type: 'item',
            class: 'p-button-rounded p-button-danger p-button-text',
        },
        {
            labelTooltip: 'Editar',
            icon: 'pi pi-pencil',
            accion: 'editar',
            type: 'item',
            class: 'p-button-rounded p-button-warning p-button-text',
        },
    ]

    public data = []
    private params = {
        iCursoId: null,
        iDocenteId: null,
        idDocCursoId: null,
    }
    private _dialogService = inject(DialogService)
    private _evaluacionApiService = inject(ApiEvaluacionesService)
    private _unsubscribe$ = new Subject<boolean>()
    private _confirmService = inject(ConfirmationModalService)
    private _constantesService = inject(ConstantesService)

    ngOnInit() {
        this.params.iCursoId = this._constantesService.iCursoId
        this.params.idDocCursoId = this._constantesService.idDocCursoId
        this.params.iDocenteId = this._constantesService.iDocenteId

        this.getData()
        if (this.mode === 'SELECTION') {
            this.accionesTabla.unshift(SELECTION_ACTION)
        }
    }

    getData() {
        this.obtenerRubricas()
    }

    obtenerRubricas() {
        this._evaluacionApiService
            .obtenerRubricas(this.params)
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe({
                next: (data) => {
                    this.data = data
                },
            })
    }

    agregarInstrumentoEvaluacion() {
        this.agregarActualizarEvaluacionModal(null)
    }

    agregarActualizarEvaluacionModal(item) {
        const header = item == null ? 'Crear rubrica' : 'Editar rubrica'
        const ref = this._dialogService.open(RubricaFormComponent, {
            ...MODAL_CONFIG,
            header,
            data: {
                rubrica: item,
            },
        })

        ref.onClose.pipe(takeUntil(this._unsubscribe$)).subscribe(() => {
            this.obtenerRubricas()
        })
    }

    public onActionBtn({ accion, item }) {
        if (accion === 'seleccionar') {
            this.seleccionarItem(item)
        }
        if (accion === 'eliminar') {
            this.confirmarEliminar(item)
        }
        if (accion === 'editar') {
            this.agregarActualizarEvaluacionModal(item)
        }
    }

    seleccionarItem(item) {
        this.rubricaSelected = item
        this.rubricaSelectedChange.emit(item)
    }

    confirmarEliminar(item) {
        this._confirmService.openConfirm({
            header: '¿Esta seguro de quitar la rubrica?',
            accept: () => {
                this.eliminarRubrica(item)
            },
        })
    }

    eliminarRubrica(item) {
        this._evaluacionApiService
            .eliminarRubrica({ id: item.iInstrumentoId, tipo: 'INSTRUMENTO' })
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe({
                next: () => {
                    this.obtenerRubricas()
                },
            })
    }

    ngOnDestroy() {
        this._unsubscribe$.next(true)
        this._unsubscribe$.complete()
    }
}
