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
import { accionesPreguntasEvaluacion } from './evaluacion-form-preguntas'

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

    public showModalBancoPreguntas: boolean = false

    preguntasSeleccionadas = []

    private _dialogService = inject(DialogService)
    private _aulaBancoPreguntasService = inject(AulaBancoPreguntasService)

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
                this.preguntas.push(result)
                this.preguntasSeleccionadasChange.emit(this.preguntas)
                console.log(result)
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

    agregarPreguntas() {
        // validaciones
        this.closeModalBancoPreguntas()
        this.preguntas = this.preguntasSeleccionadas
        this.preguntasSeleccionadasChange.emit(this.preguntas)
    }
}
