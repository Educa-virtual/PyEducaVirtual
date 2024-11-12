import { PrimengModule } from '@/app/primeng.module'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { MODAL_CONFIG } from '@/app/shared/constants/modal.config'
import {
    IActionTable,
    IColumn,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'
import { ApiEvaluacionesService } from '@/app/sistema/aula-virtual/services/api-evaluaciones.service'
import { CommonModule } from '@angular/common'
import { Component, inject, OnInit, OnDestroy } from '@angular/core'
import {
    DialogService,
    DynamicDialogConfig,
    DynamicDialogRef,
} from 'primeng/dynamicdialog'
import { Subject, takeUntil } from 'rxjs'
import { LogroFormComponent } from './logro-form/logro-form.component'
import { BancoPreguntaPreviewItemComponent } from '../../../../../evaluaciones/sub-evaluaciones/banco-preguntas/components/banco-pregunta-preview/banco-pregunta-preview-item/banco-pregunta-preview-item.component'
import { RemoveHTMLPipe } from '@/app/shared/pipes/remove-html.pipe'

@Component({
    selector: 'app-evaluacion-logros',
    standalone: true,
    imports: [
        CommonModule,
        PrimengModule,
        TablePrimengComponent,
        BancoPreguntaPreviewItemComponent,
        RemoveHTMLPipe,
    ],
    templateUrl: './evaluacion-logros.component.html',
    styleUrl: './evaluacion-logros.component.scss',
    providers: [DialogService],
})
export class EvaluacionLogrosComponent implements OnInit, OnDestroy {
    title = ''

    public preguntas = [
        {
            logros: [],
            iEvaluacionId: null,
            iEvalPregId: null,
        },
    ]

    public preguntaSelectedIndex

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

    private _unsubscribe$ = new Subject<boolean>()

    // injeccion de dependencias
    private _dialogService = inject(DialogService)
    private _evaluacionApiService = inject(ApiEvaluacionesService)
    private _confirmService = inject(ConfirmationModalService)

    constructor(
        private _ref: DynamicDialogRef,
        private _config: DynamicDialogConfig
    ) {
        this.preguntas = this._config.data.preguntas
        this.title = this._config.data.title
    }

    public onActionBtn({ accion, item }, pregunta) {
        if (accion === 'editar') {
            this.crearActualizarLogro({
                iEvalPregId: pregunta.iEvalPregId,
                logro: item,
            })
        }
        if (accion === 'eliminar') {
            this.confirmEliminarLogro(item)
        }
    }

    ngOnInit() {
        console.log(this._config.data)
    }

    setPreguntaSeleccionada(index) {
        this.preguntaSelectedIndex = index
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

    // elimina el logro de forma local
    eliminarLogroLocal(iNivelLogroEvaId: number) {
        this.preguntas[this.preguntaSelectedIndex].logros = [
            ...this.preguntas[this.preguntaSelectedIndex].logros.filter(
                (item) => item.iNivelLogroEvaId != iNivelLogroEvaId
            ),
        ]
    }

    crearActualizarLogro({ iEvalPregId, logro }) {
        const ref = this._dialogService.open(LogroFormComponent, {
            ...MODAL_CONFIG,
            header: logro == null ? 'Crear Logro' : 'Editar Logro',
            data: {
                logro: logro,
                iEvalPregId: iEvalPregId,
            },
        })
        ref.onClose.pipe(takeUntil(this._unsubscribe$)).subscribe((result) => {
            if (!result) return
            const preguntaSelected = this.preguntas[this.preguntaSelectedIndex]
            const logroInData = preguntaSelected.logros.findIndex(
                (logro) => logro.iNivelLogroEvaId == result.iNivelLogroEvaId
            )
            if (logroInData == -1) {
                this.preguntas[this.preguntaSelectedIndex].logros = [
                    ...this.preguntas[this.preguntaSelectedIndex].logros,
                    result,
                ]
            } else {
                this.preguntas[this.preguntaSelectedIndex].logros[logroInData] =
                    result
                this.preguntas[this.preguntaSelectedIndex].logros = [
                    ...this.preguntas[this.preguntaSelectedIndex].logros,
                ]
            }
        })
    }

    asignarLogrosPregunta() {
        this.closeModal(this.preguntas)
    }

    closeModal(data) {
        this._ref.close(data)
    }

    // desuscribe de los observables
    ngOnDestroy() {
        this._unsubscribe$.next(true)
        this._unsubscribe$.complete()
    }
}
