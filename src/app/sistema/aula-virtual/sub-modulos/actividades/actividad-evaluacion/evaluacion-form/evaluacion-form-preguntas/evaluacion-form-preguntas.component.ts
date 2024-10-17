import { BancoPreguntaListaComponent } from '@/app/sistema/evaluaciones/sub-evaluaciones/banco-preguntas/components/banco-pregunta-lista/banco-pregunta-lista.component'
import { CommonModule } from '@angular/common'
import { Component, EventEmitter, inject, Input, Output } from '@angular/core'
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
import { ApiEvaluacionesService } from '@/app/sistema/evaluaciones/services/api-evaluaciones.service'
import { generarIdAleatorio } from '@/app/shared/utils/random-id'

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
    providers: [DialogService, AulaBancoPreguntasService],
})
export class EvaluacionFormPreguntasComponent {
    @Input() tituloEvaluacion: string = 'Sin título de evaluación'
    @Input() preguntas: any[] = []

    @Output() preguntasSeleccionadasChange = new EventEmitter()

    public acciones = accionesPreguntasEvaluacion
    public columnasEvaluacionLista = columnasPreguntasEvaluacion
    public showModalBancoPreguntas: boolean = false

    preguntasSeleccionadas = []

    private _confirmationService = inject(ConfirmationModalService)
    private _aulaBancoPreguntasService = inject(AulaBancoPreguntasService)
    private _evaluacionService = inject(ApiEvaluacionesService)

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
            iCursoId: 1,
            tipoPreguntas: [],
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
    }

    quitarPreguntaEvulacion(item) {
        console.log(item, item.isLocal)

        if (item.isLocal) {
            this.quitarPreguntaLocal(item.iEvalPregId)
            return
        }

        this._evaluacionService
            .quitarPreguntaEvaluacion(item.iEvalPregId)
            .subscribe({
                next: () => {
                    this.quitarPreguntaLocal(item.iEvalPregId)
                },
            })
    }

    quitarPreguntaLocal(iEvalPregId: string) {
        this.preguntas = this.preguntas.filter(
            (item) => item.iEvalPregId != iEvalPregId
        )
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

    agregarPreguntas() {
        this.preguntasSeleccionadas.map((item) => {
            item = this.mapLocalPregunta(item)
            return item
        })
        this.closeModalBancoPreguntas()
        this.preguntas.push(...this.preguntasSeleccionadas)
        this.preguntasSeleccionadasChange.emit(this.preguntas)
    }
}
