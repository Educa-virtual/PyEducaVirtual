import { LeyendaComponent } from '@/app/shared/components/leyenda/leyenda.component'
import { CommonModule } from '@angular/common'
import { Component, inject, Input, OnInit } from '@angular/core'
import { EvaluacionInfoComponent } from '@/app/sistema/aula-virtual/sub-modulos/actividades/actividad-evaluacion/evaluacion-room/components/evaluacion-info/evaluacion-info.component'
import { EmptySectionComponent } from '@/app/shared/components/empty-section/empty-section.component'
import { BancoPreguntaPreviewItemComponent } from '@/app/sistema/evaluaciones/sub-evaluaciones/banco-preguntas/components/banco-pregunta-preview/banco-pregunta-preview-item/banco-pregunta-preview-item.component'
import { RemoveHTMLPipe } from '@/app/shared/pipes/remove-html.pipe'
import { ApiEvaluacionesService } from '@/app/sistema/aula-virtual/services/api-evaluaciones.service'
import { Subject, takeUntil } from 'rxjs'
import { EvaluacionPreguntaComponent } from '../components/evaluacion-pregunta/evaluacion-pregunta.component'
import { PrimengModule } from '@/app/primeng.module'
import { DialogService } from 'primeng/dynamicdialog'
import { EvaluacionPreguntaCalificacionComponent } from '../evaluacion-pregunta-calificacion/evaluacion-pregunta-calificacion.component'
import { MODAL_CONFIG } from '@/app/shared/constants/modal.config'

@Component({
    selector: 'app-evaluacion-room-calificacion',
    standalone: true,
    imports: [
        CommonModule,
        PrimengModule,
        LeyendaComponent,
        EvaluacionInfoComponent,
        EmptySectionComponent,
        RemoveHTMLPipe,
        BancoPreguntaPreviewItemComponent,
        EvaluacionPreguntaComponent,
    ],
    templateUrl: './evaluacion-room-calificacion.component.html',
    styleUrl: './evaluacion-room-calificacion.component.scss',
    providers: [DialogService],
})
export class EvaluacionRoomCalificacionComponent implements OnInit {
    @Input({ required: true }) evaluacion
    @Input({ required: true }) iEvaluacionId: string
    @Input() evaluacionesEstudiantes = [
        {
            iEvalPromId: 1,
            pregunta: [],
            nEvalPromNota: 10,
            cEstNombres: 'Usuario',
            cEstPaterno: 'prueba',
        },
        {
            iEvalPromId: 2,
            pregunta: [],
            nEvalPromNota: 10,
            cEstNombres: 'Usuario',
            cEstPaterno: 'prueba 2',
        },
        {
            iEvalPromId: 3,
            pregunta: [],
            nEvalPromNota: 10,
            cEstNombres: 'Usuario',
            cEstPaterno: 'prueba 3',
        },
    ]

    // injeccion de dependencias
    private _evaluacionesService = inject(ApiEvaluacionesService)
    private _dialogService = inject(DialogService)
    private _unsubscribe$ = new Subject<boolean>()

    public evaluacionSeleccionada = null

    ngOnInit() {
        this.getData()
    }

    getData() {
        this.obtenerEstudiantesEvaluacion()
    }

    obtenerEstudiantesEvaluacion() {
        const params = { iEvaluacionId: this.iEvaluacionId }
        this._evaluacionesService
            .obtenerEstudiantesEvaluación(params)
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe({
                next: (resp) => {
                    this.evaluacionesEstudiantes = resp
                },
            })
    }

    private obtenerEvaluacionRespuestasEstudiante() {
        const params = {
            iEvaluacionId: this.iEvaluacionId,
            iEstudianteId: this.evaluacionSeleccionada.iEstudianteId,
        }
        this._evaluacionesService
            .obtenerEvaluacionRespuestasEstudiante(params)
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe({
                next: (resp) => {
                    this.evaluacionSeleccionada.preguntas = resp.map(
                        (pregunta) => {
                            if (pregunta.preguntas !== undefined) {
                                pregunta.preguntas.map((subPregunta) => {
                                    subPregunta =
                                        this.mapAlternativaPreguntaEstudiante(
                                            subPregunta
                                        )
                                    return subPregunta
                                })
                            } else {
                                pregunta =
                                    this.mapAlternativaPreguntaEstudiante(
                                        pregunta
                                    )
                            }
                            return pregunta
                        }
                    )
                    console.log(this.evaluacionSeleccionada.preguntas)
                },
            })
    }

    private mapAlternativaPreguntaEstudiante(pregunta) {
        if (pregunta.iTipoPregId === 1) {
            pregunta.respuestaEstudiante =
                pregunta.jEvalRptaEstudiante.rptaUnica
        }

        if (pregunta.iTipoPregId === 2) {
            pregunta.respuestaEstudiante =
                pregunta.jEvalRptaEstudiante.rptaMultiple
        }
        if (pregunta.iTipoPregId === 3) {
            pregunta.respuestaEstudiante =
                pregunta.jEvalRptaEstudiante.rptaAbierta
        }
        return pregunta
    }

    public calificarPregunta(pregunta) {
        const refModal = this._dialogService.open(
            EvaluacionPreguntaCalificacionComponent,
            {
                ...MODAL_CONFIG,
                data: {
                    evaluacion: this.evaluacionSeleccionada,
                    pregunta: pregunta,
                },
                header: 'Calificar Pregunta',
            }
        )
        refModal.onClose.subscribe((result) => {
            if (result) {
                this.obtenerEvaluacionRespuestasEstudiante()
            }
        })
    }

    public seleccionarEvaluacion() {
        this.obtenerEvaluacionRespuestasEstudiante()
    }
}
