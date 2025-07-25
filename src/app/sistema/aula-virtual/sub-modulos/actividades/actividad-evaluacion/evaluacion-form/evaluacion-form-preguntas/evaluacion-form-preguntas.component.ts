import { BancoPreguntaListaComponent } from '@/app/sistema/evaluaciones/sub-evaluaciones/banco-preguntas/components/banco-pregunta-lista/banco-pregunta-lista.component'
import { CommonModule } from '@angular/common'
import {
    Component,
    EventEmitter,
    inject,
    Input,
    Output,
    OnDestroy,
    OnInit,
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
import { provideIcons } from '@ng-icons/core'
import { matWorkspacePremium } from '@ng-icons/material-icons/baseline'
import { MODAL_CONFIG } from '@/app/shared/constants/modal.config'
import { EvaluacionLogrosComponent } from '../../evaluacion-logros/evaluacion-logros.component'
import { Subject, takeUntil } from 'rxjs'
import { ApiEvaluacionesRService } from '@/app/sistema/evaluaciones/services/api-evaluaciones-r.service'
import { PreguntasActivasComponent } from '../../../../../../evaluaciones/sub-evaluaciones/preguntas-activas/preguntas-activas.component'
import { PreguntasFormComponent } from '../preguntas-form/preguntas-form.component'
import { EvaluacionButtonAgregarPreguntasComponent } from '../../evaluacion-button-agregar-preguntas/evaluacion-button-agregar-preguntas.component'

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
        PreguntasActivasComponent,
        PreguntasFormComponent,
        EvaluacionButtonAgregarPreguntasComponent,
    ],
    templateUrl: './evaluacion-form-preguntas.component.html',
    styleUrl: './evaluacion-form-preguntas.component.scss',
    providers: [
        DialogService,
        AulaBancoPreguntasService,
        provideIcons({ matWorkspacePremium }),
    ],
})
export class EvaluacionFormPreguntasComponent implements OnInit, OnDestroy {
    @Input() tituloEvaluacion: string = 'Sin título de evaluación'
    @Input() preguntas: any[] = []
    // se guarda en evaluaciones_preguntas si se envia iEvaluacionId
    @Input() iEvaluacionId: number
    @Input({ required: true }) iCursoId: string
    @Input() mode: 'EDIT' | 'VIEW' = 'EDIT'
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
    private _apiEvaluacionesR = inject(ApiEvaluacionesRService)
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

    ngOnInit() {
        if (this.mode === 'VIEW') {
            this.acciones = this.acciones.map((acc) => {
                acc.isVisible = () => false
                return acc
            })
        }
    }

    handleNuevaPregunta() {
        this.agregarEditarPregunta({
            iPreguntaId: 0,
            preguntas: [],
            iEncabPregId: -1,
        })
    }

    showModalPreguntas: boolean = false
    agregarEditarPregunta(pregunta) {
        // this.showModalPreguntas = true
        // console.log(pregunta)
        const refModal = this._aulaBancoPreguntasService.openPreguntaModal({
            pregunta,
            iCursoId: this.iCursoId,
            tipoPreguntas: [],
            iEvaluacionId: this.iEvaluacionId,
            padreComponente: 'AULA-VIRTUAL',
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
            pregunta.iEvalPregId = 0
        } else {
            pregunta.preguntas = this.addLocalPreguntas(pregunta.preguntas)
        }
        return pregunta
    }

    addLocalPreguntas = (preguntas) => {
        return preguntas.map((item) => {
            item.isLocal = true
            item.iEvalPregId = 0
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

    generarWordEvaluacion() {
        if (this.preguntas.length === 0) {
            this._confirmationService.openAlert({
                header: 'Debe seleccionar almenos una pregunta.',
            })
            return
        }

        // let preguntas_evaluacion = []

        // this.preguntas.forEach((item) => {
        //     if (item.iEncabPregId == -1) {
        //         preguntas_evaluacion = [...preguntas_evaluacion, item]
        //     } else {
        //         preguntas_evaluacion = [
        //             ...preguntas_evaluacion,
        //             ...item.preguntas,
        //         ]
        //     }
        // })

        const ids = this.preguntas.map((item) => item.iBancoId).join(',')

        const params = {
            iCursoId: this.iCursoId,
            ids,
        }
        this._apiEvaluacionesR.generarWordEvaluacionByIds(params)
    }

    accionBtnItem(elemento): void {
        const { accion } = elemento
        switch (accion) {
            case 'close-modal':
                this.showModalPreguntas = false
                break
        }
    }
}
