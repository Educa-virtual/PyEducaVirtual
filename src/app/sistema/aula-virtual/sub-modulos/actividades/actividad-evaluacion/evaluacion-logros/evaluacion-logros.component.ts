import { PrimengModule } from '@/app/primeng.module'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { MODAL_CONFIG } from '@/app/shared/constants/modal.config'
import {
    IActionTable,
    IColumn,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'
import { ApiEvaluacionesService } from '@/app/sistema/evaluaciones/services/api-evaluaciones.service'
import { CommonModule } from '@angular/common'
import { Component, inject, OnInit, OnDestroy, Optional } from '@angular/core'
import {
    DialogService,
    DynamicDialogConfig,
    DynamicDialogRef,
} from 'primeng/dynamicdialog'
import { Subject, takeUntil } from 'rxjs'
import { LogroFormComponent } from './logro-form/logro-form.component'

@Component({
    selector: 'app-evaluacion-logros',
    standalone: true,
    imports: [CommonModule, PrimengModule, TablePrimengComponent],
    templateUrl: './evaluacion-logros.component.html',
    styleUrl: './evaluacion-logros.component.scss',
    providers: [DialogService],
})
export class EvaluacionLogrosComponent implements OnInit, OnDestroy {
    title = ''
    logrosSeleccionados = []
    iEvaluacionId: number
    iEvalPregId: number

    isDialog: boolean = false

    public columnasTabla: IColumn[] = [
        {
            field: 'cNivelLogroEvaDescripcion',
            header: 'Logro',
            type: 'text',
            width: '10rem',
            text: 'left',
            text_header: 'left',
        },
        {
            field: '',
            header: 'Acciones',
            type: 'actions',
            width: '5rem',
            text: 'left',
            text_header: 'left',
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

    private _dialogService = inject(DialogService)
    private _evaluacionApiService = inject(ApiEvaluacionesService)
    private _unsubscribe$ = new Subject<boolean>()
    private _confirmService = inject(ConfirmationModalService)

    constructor(
        @Optional() private _ref: DynamicDialogRef,
        @Optional() private _config: DynamicDialogConfig
    ) {
        if (this._config) {
            this.isDialog = true
            this.iEvalPregId = this._config.data.iEvalPregId
            this.iEvaluacionId = this._config.data.iEvaluacionId
            this.logrosSeleccionados = this._config.data.logros
            this.title = this._config.data.title
        }
    }

    public onActionBtn({ accion, item }) {
        if (accion === 'seleccionar') {
            this.handleSeleccionarLogro(item)
        }
        if (accion === 'editar') {
            this.crearActualizarLogro(item)
        }
        if (accion === 'eliminar') {
            this.confirmEliminarLogro(item)
        }
    }

    ngOnInit() {
        console.log(this._config.data)

        this.getData()
    }

    getData() {
        this.obtenerLogros()
    }

    obtenerLogros() {
        this._evaluacionApiService
            .obtenerLogros({
                iEvalPregId: this.iEvalPregId,
            })
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe({
                next: (data) => {
                    this.data = data
                },
            })
    }

    confirmEliminarLogro(item) {
        this._confirmService.openConfirm({
            header: '¿Esta seguro de quitar la rubrica?',
            accept: () => {
                this.eliminarLogro(item)
            },
        })
    }

    eliminarLogro(item) {
        this._evaluacionApiService
            .eliminarLogroPregunta(item.iNivelLogroEvaId)
            .subscribe({
                next: () => {
                    this.eliminarLogroLocal(item.iNivelLogroEvaId)
                },
            })
    }

    eliminarLogroLocal(iNivelLogroEvaId: number) {
        this.data = [
            ...this.data.filter(
                (item) => item.iNivelLogroEvaId != iNivelLogroEvaId
            ),
        ]
    }

    crearActualizarLogro(item) {
        const ref = this._dialogService.open(LogroFormComponent, {
            ...MODAL_CONFIG,
            header: item == null ? 'Crear Logro' : 'Editar Logro',
            data: {
                logro: item,
                iEvalPregId: this.iEvalPregId,
            },
        })
        ref.onClose.pipe(takeUntil(this._unsubscribe$)).subscribe((result) => {
            if (!result) return
            console.log(result)

            const logroInData = this.data.findIndex(
                (logro) => logro.iNivelLogroEvalId == result.iNivelLogroEvalId
            )
            console.log({
                logroInData,
                iNivelLogroEvalId: result.iNivelLogroEvalId,
            })

            if (logroInData == -1) {
                this.data = [...this.data, result]
            } else {
                this.data[logroInData] = result
                this.data = [...this.data]
            }
        })
    }

    handleSeleccionarLogro(item) {
        this.logrosSeleccionados = item
        console.log(this.logrosSeleccionados)
    }

    asignarLogrosPregunta() {
        this.closeModal(this.logrosSeleccionados)
    }

    closeModal(data) {
        this._ref.close(data)
    }

    ngOnDestroy() {
        this._unsubscribe$.next(true)
        this._unsubscribe$.complete()
    }
}
