import { BancoPreguntaListaComponent } from '@/app/sistema/evaluaciones/sub-evaluaciones/banco-preguntas/components/banco-pregunta-lista/banco-pregunta-lista.component'
import { CommonModule } from '@angular/common'
import {
    Component,
    EventEmitter,
    inject,
    Input,
    Output,
    OnDestroy,
} from '@angular/core'
import { MenuItem } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { MenuModule } from 'primeng/menu'
import { DialogService } from 'primeng/dynamicdialog'
import { AulaBancoPreguntasModule } from '../../../../aula-banco-preguntas/aula-banco-preguntas.module'
import { AulaBancoPreguntasService } from '../../../../aula-banco-preguntas/aula-banco-preguntas/aula-banco-.preguntas.service'
import { DialogModule } from 'primeng/dialog'
import { AulaBancoPreguntasComponent } from '../../../../aula-banco-preguntas/aula-banco-preguntas/aula-banco-preguntas.component'
import {
    accionesPreguntasEvaluacion,
    columnasPreguntasEvaluacion,
} from './evaluacion-form-preguntas'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { ApiEvaluacionesService } from '@/app/sistema/aula-virtual/services/api-evaluaciones.service'
import { generarIdAleatorio } from '@/app/shared/utils/random-id'
import { provideIcons } from '@ng-icons/core'
import { matWorkspacePremium } from '@ng-icons/material-icons/baseline'
import { MODAL_CONFIG } from '@/app/shared/constants/modal.config'
import { EvaluacionLogrosComponent } from '../../evaluacion-logros/evaluacion-logros.component'
import { Subject, takeUntil } from 'rxjs'

@Component({
    selector: 'app-evaluacion-form-preguntas',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        MenuModule,
        BancoPreguntaListaComponent,
        AulaBancoPreguntasModule,
        DialogModule,
        AulaBancoPreguntasComponent,
    ],
    templateUrl: './evaluacion-form-preguntas.component.html',
    styleUrl: './evaluacion-form-preguntas.component.scss',
    providers: [
        DialogService,
        AulaBancoPreguntasService,
        provideIcons({ matWorkspacePremium }),
    ],
})
export class EvaluacionFormPreguntasComponent implements OnDestroy {
    @Input() tituloEvaluacion: string = 'Sin título de evaluación'
    @Input() preguntas: any[] = []
    // se guarda en evaluaciones_preguntas si se envia iEvaluacionId
    @Input() iEvaluacionId: number
    @Input({ required: true }) iCursoId: string
    @Output() preguntasSeleccionadasChange = new EventEmitter()

    public acciones = accionesPreguntasEvaluacion
    public columnasEvaluacionLista = columnasPreguntasEvaluacion
    public showModalBancoPreguntas: boolean = false

    preguntasSeleccionadas = []

    // injeccion de depedencias
    private _confirmationService = inject(ConfirmationModalService)
    private _aulaBancoPreguntasService = inject(AulaBancoPreguntasService)
    private _evaluacionService = inject(ApiEvaluacionesService)
    private _dialogService = inject(DialogService)

    private _unsubscribe$ = new Subject<boolean>()

    tiposAgrecacionPregunta: MenuItem[] = [
        {
            label: 'Nueva Pregunta',
            icon: 'pi pi-plus',
            command: () => {
                this.handleNuevaPregunta()
            },
        },
        {
            label: 'Del banco de preguntas',
            icon: 'pi pi-plus',
            command: () => {
                this.handleBancopregunta()
            },
        },
    ]

    constructor() {}

    handleNuevaPregunta() {
        this.agregarEditarPregunta({
            iPreguntaId: 0,
            preguntas: [],
            iEncabPregId: -1,
        })
    }

    agregarEditarPregunta(pregunta) {
        const refModal = this._aulaBancoPreguntasService.openPreguntaModal({
            pregunta,
            iCursoId: this.iCursoId,
            tipoPreguntas: [],
            iEvaluacionId: this.iEvaluacionId,
        })
        refModal.onClose.subscribe((result) => {
            if (result) {
                const pregunta = this.mapLocalPregunta(result)
                this.preguntas.push(pregunta)
                this.preguntasSeleccionadasChange.emit(this.preguntas)
            }
        })
    }

    handleBancopregunta() {
        this.showModalBancoPreguntas = true
    }

    closeModalBancoPreguntas() {
        this.showModalBancoPreguntas = false
    }

    selectedRowDataChange(event) {
        this.preguntasSeleccionadas = [...event]
    }

    accionBtnItemTable({ accion, item }) {
        if (accion === 'eliminar') {
            this._confirmationService.openConfirm({
                header: '¿Está seguro de quitar la pregunta?',
                accept: () => {
                    this.quitarPreguntaEvulacion(item)
                },
            })
        }

        if (accion === 'agregar-logros') {
            this.handleLogrosPregunta(item)
        }
    }

    handleLogrosPregunta(item) {
        let preguntas = [item]
        if (item.preguntas != null) {
            preguntas = item.preguntas
        }
        const ref = this._dialogService.open(EvaluacionLogrosComponent, {
            ...MODAL_CONFIG,
            header: 'Gestionar Logros',
            data: {
                preguntas: preguntas,
            },
        })
        ref.onClose.pipe(takeUntil(this._unsubscribe$)).subscribe((result) => {
            if (!result) return
        })
    }

    quitarPreguntaEvulacion(item) {
        if (item.isLocal) {
            this.quitarPreguntaLocal(item)
            return
        }
        let ids = item.iEvalPregId
        if (item.iEncabPregId != -1) {
            ids = item.preguntas.map((item) => item.iEvalPregId).join(',')
        }
        this._evaluacionService.quitarPreguntaEvaluacion(ids).subscribe({
            next: () => {
                this.quitarPreguntaLocal(item)
            },
        })
    }

    quitarPreguntaLocal(item) {
        if (item.preguntas == null) {
            this.preguntas = this.preguntas.filter(
                (pregunta) => pregunta.iEvalPregId != item.iEvalPregId
            )
        } else {
            this.preguntas = this.preguntas.filter(
                (pregunta) => pregunta.iEncabPregId != item.iEncabPregId
            )
        }
        this.preguntasSeleccionadasChange.emit(this.preguntas)
    }

    mapLocalPregunta(pregunta) {
        if (pregunta.iEncabPregId == -1) {
            pregunta.isLocal = true
            pregunta.iEvalPregId = generarIdAleatorio()
        } else {
            pregunta.preguntas = this.addLocalPreguntas(pregunta.preguntas)
        }
        return pregunta
    }

    addLocalPreguntas = (preguntas) => {
        return preguntas.map((item) => {
            item.isLocal = true
            item.iEvalPregId = generarIdAleatorio()
            return item
        })
    }

    // agrega preguntas al formulario
    agregarPreguntas() {
        this.preguntasSeleccionadas.map((item) => {
            item = this.mapLocalPregunta(item)
            return item
        })
        this.closeModalBancoPreguntas()
        this.preguntas.push(...this.preguntasSeleccionadas)
        this.preguntasSeleccionadasChange.emit(this.preguntas)
    }

    // desuscribe los observables cuando se destruye el componente
    ngOnDestroy() {
        this._unsubscribe$.next(true)
        this._unsubscribe$.complete()
    }
}
