import { Component, inject, OnInit, OnDestroy } from '@angular/core'
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

@Component({
    selector: 'app-aula-banco-preguntas',
    standalone: true,
    imports: [AulaBancoPreguntasModule, BancoPreguntaListaComponent],
    templateUrl: './aula-banco-preguntas.component.html',
    styleUrl: './aula-banco-preguntas.component.scss',
})
export class AulaBancoPreguntasComponent implements OnInit, OnDestroy {
    public actionsTable = actionsTable
    public actionsContainer = actionsContainer
    public columnas = columns
    public bancoPreguntas = []
    public expandedRowKeys = {}
    public tipoPreguntas = []

    private unsubscribe$: Subject<boolean> = new Subject()

    private _aulaBancoApiService = inject(ApiAulaBancoPreguntasService)
    private _dialogService = inject(DialogService)

    public params = {
        iCursoId: 1,
        iDocenteId: 1,
        iCurrContId: 1,
        iNivelCicloId: 1,
        busqueda: '',
        iTipoPregId: 0,
    }

    private _confirmService = inject(ConfirmationModalService)

    ngOnInit() {
        this.getData()
    }

    private getData() {
        this.obtenerTipoPreguntas()
        this.obtenerBancoPreguntas()
    }

    obtenerTipoPreguntas() {
        this._aulaBancoApiService
            .obtenerTipoPreguntas()
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
                })

                this.expandedRowKeys = Object.assign({}, this.expandedRowKeys)
            },
        })
    }

    public handleAcciones({ accion, item }) {
        console.log(accion, item)
        if (accion === 'agregar') {
            this.agregarEditarPregunta({
                iPreguntaId: 0,
                preguntas: [],
                iEncabPregId: -1,
            })
            return
        }
        if (accion === 'editar') {
            this.agregarEditarPregunta(item)
        }

        if (accion === 'eliminar') {
            this.handleEliminarBancoPreguntas(item)
        }
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

    handleEliminarBancoPreguntas(pregunta) {
        this._confirmService.openConfirm({
            header: '¿Esta seguro de agregar la pregunta?',
            accept: () => {
                console.log('eliminado', pregunta)
            },
        })
    }

    ngOnDestroy() {
        this.unsubscribe$.next(true)
        this.unsubscribe$.complete()
    }
}
