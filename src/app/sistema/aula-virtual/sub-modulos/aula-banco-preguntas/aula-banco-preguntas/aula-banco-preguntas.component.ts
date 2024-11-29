import {
    Component,
    inject,
    OnInit,
    OnDestroy,
    Input,
    Output,
    EventEmitter,
} from '@angular/core'
import { AulaBancoPreguntasModule } from '../aula-banco-preguntas.module'
import {
    actionsContainer,
    actionsTable,
    columns,
} from './aula-banco-preguntas.model'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { ApiAulaBancoPreguntasService } from '../../../services/api-aula-banco-preguntas.service'
import { BancoPreguntaListaComponent } from '@/app/sistema/evaluaciones/sub-evaluaciones/banco-preguntas/components/banco-pregunta-lista/banco-pregunta-lista.component'
import { Subject, takeUntil } from 'rxjs'
import { MODAL_CONFIG } from '@/app/shared/constants/modal.config'
import { DialogService } from 'primeng/dynamicdialog'
import { AulaBancoPreguntaFormContainerComponent } from './components/aula-banco-pregunta-form-container/aula-banco-pregunta-form-container.component'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { ApiEvaluacionesRService } from '@/app/sistema/evaluaciones/services/api-evaluaciones-r.service'

@Component({
    selector: 'app-aula-banco-preguntas',
    standalone: true,
    imports: [AulaBancoPreguntasModule, BancoPreguntaListaComponent],
    templateUrl: './aula-banco-preguntas.component.html',
    styleUrl: './aula-banco-preguntas.component.scss',
})
export class AulaBancoPreguntasComponent implements OnInit, OnDestroy {
    @Output() public selectedRowDataChange = new EventEmitter()
    @Input() public mode: 'SELECTION' | 'NORMAL' = 'NORMAL'
    @Input() iEvaluacionId: number
    @Input({ required: true }) set iCursoId(value) {
        this.params.iCursoId = value
    }
    public actionsTable = actionsTable
    public actionsContainer = actionsContainer
    public columnas = columns
    public bancoPreguntas = []
    public expandedRowKeys = {}
    public tipoPreguntas = []

    private unsubscribe$: Subject<boolean> = new Subject()

    private _aulaBancoApiService = inject(ApiAulaBancoPreguntasService)
    private _dialogService = inject(DialogService)
    private _constantesService = inject(ConstantesService)

    @Input() public params = {
        iCursoId: null,
        iDocenteId: null,
        iCurrContId: null,
        iNivelCicloId: null,
        busqueda: '',
        iTipoPregId: 0,
        iEvaluacionId: 0,
    }

    private _confirmService = inject(ConfirmationModalService)

    ngOnInit() {
        this.params.iEvaluacionId = this.iEvaluacionId
        this.params.iDocenteId = this._constantesService.iDocenteId
        this.params.iNivelCicloId = this._constantesService.iNivelCicloId
        this.params.iCurrContId = this._constantesService.iCurrContId
        this.getData()
        this.setupConfig()
    }

    setupConfig() {
        if (this.mode === 'SELECTION') {
            this.columnas.push({
                field: 'checked',
                header: '',
                type: 'checkbox',
                width: '5rem',
                text: 'left',
                text_header: '',
            })
        }
    }

    private getData() {
        this.obtenerTipoPreguntas()
        this.obtenerBancoPreguntas()
    }

    obtenerTipoPreguntas() {
        this._aulaBancoApiService
            .obtenerTipoPreguntas({ bancoTipo: 'aula' })
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (data) => {
                    this.tipoPreguntas = [
                        {
                            iTipoPregId: 0,
                            cTipoPregDescripcion: 'Todos',
                        },
                        ...data,
                    ]
                },
            })
    }

    obtenerBancoPreguntas() {
        this._aulaBancoApiService.obtenerBancoPreguntas(this.params).subscribe({
            next: (data) => {
                this.bancoPreguntas = data
                this.bancoPreguntas.forEach((item) => {
                    this.expandedRowKeys[item.iPreguntaId] = true
                    item.iTotalPreguntas = !item.preguntas
                        ? 1
                        : item.preguntas.length
                })

                this.expandedRowKeys = Object.assign({}, this.expandedRowKeys)
            },
        })
    }

    public handleAcciones({ accion, item }) {
        if (accion === 'agregar') {
            this.agregarEditarPregunta({
                iPreguntaId: 0,
                preguntas: [],
                iEncabPregId: -1,
            })
            return
        }

        if (accion.accion === 'generar-word') {
            this.generarWord()
        }
        if (accion === 'editar') {
            this.agregarEditarPregunta(item)
        }

        if (accion === 'eliminar') {
            this.handleEliminarBancoPreguntas(item)
        }
    }
    selectedItems = []
    private _confirmationModalService = inject(ConfirmationModalService)
    private _apiEvaluacionesR = inject(ApiEvaluacionesRService)

    generarWord() {
        if (this.selectedItems.length === 0) {
            this._confirmationModalService.openAlert({
                header: 'Debe seleccionar almenos una pregunta.',
            })
            return
        }

        let preguntas = []

        this.selectedItems.forEach((item) => {
            if (item.iEncabPregId == -1) {
                preguntas = [...preguntas, item]
            } else {
                preguntas = [...preguntas, ...item.preguntas]
            }
        })

        const ids = preguntas.map((item) => item.iPreguntaId).join(',')

        const params = {
            iCursoId: this.params.iCursoId,
            ids,
        }
        this._apiEvaluacionesR.generarWordByPreguntasIds(params)
    }

    agregarEditarPregunta(pregunta) {
        const refModal = this._dialogService.open(
            AulaBancoPreguntaFormContainerComponent,
            {
                ...MODAL_CONFIG,
                data: {
                    tipoPreguntas: this.tipoPreguntas,
                    pregunta: pregunta,
                    iCursoId: this.params.iCursoId,
                    iEvaluacionId: this.params.iEvaluacionId,
                },
                header:
                    pregunta.iPreguntaId == 0
                        ? 'Nueva pregunta'
                        : 'Editar pregunta',
            }
        )
        refModal.onClose.subscribe((result) => {
            if (result) {
                this.obtenerBancoPreguntas()
            }
        })
    }

    handleEliminarBancoPreguntas(item) {
        this._confirmService.openConfirm({
            header: '¿Esta seguro de agregar la pregunta?',
            accept: () => {
                this.eliminarPregunta(item)
            },
        })
    }

    eliminarPregunta(item) {
        let ids = item.iPreguntaId
        if (item.iEncabPregId != -1) {
            ids = item.preguntas.map((item) => item.iPreguntaId).join(',')
        }

        this._aulaBancoApiService.eliminarPreguntaById(ids).subscribe({
            next: () => {
                this.obtenerBancoPreguntas()
            },
        })
    }

    ngOnDestroy() {
        this.unsubscribe$.next(true)
        this.unsubscribe$.complete()
    }
}
