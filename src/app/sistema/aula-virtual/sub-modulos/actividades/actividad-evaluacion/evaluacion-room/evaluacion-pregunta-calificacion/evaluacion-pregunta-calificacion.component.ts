import { CommonModule } from '@angular/common'
import { Component, inject, OnInit, OnDestroy } from '@angular/core'
import { EvaluacionInfoComponent } from '../components/evaluacion-info/evaluacion-info.component'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { EvaluacionPreguntaComponent } from '../components/evaluacion-pregunta/evaluacion-pregunta.component'
import { PrimengModule } from '@/app/primeng.module'
import { RemoveHTMLPipe } from '@/app/shared/pipes/remove-html.pipe'
import { EvaluacionPreguntaLogroComponent } from './evaluacion-pregunta-logro/evaluacion-pregunta-logro.component'
import { ApiEvaluacionesService } from '@/app/sistema/aula-virtual/services/api-evaluaciones.service'
import { Subject, takeUntil } from 'rxjs'
import { EvaluacionPreguntaRubricaComponent } from './evaluacion-pregunta-rubrica/evaluacion-pregunta-rubrica.component'

@Component({
    selector: 'app-evaluacion-pregunta-calificacion',
    standalone: true,
    imports: [
        CommonModule,
        EvaluacionInfoComponent,
        EvaluacionPreguntaComponent,
        RemoveHTMLPipe,
        PrimengModule,
        EvaluacionPreguntaLogroComponent,
        EvaluacionPreguntaRubricaComponent,
    ],
    templateUrl: './evaluacion-pregunta-calificacion.component.html',
    styleUrl: './evaluacion-pregunta-calificacion.component.scss',
})
export class EvaluacionPreguntaCalificacionComponent
    implements OnInit, OnDestroy
{
    evaluacionEstudiante = null
    pregunta = null
    rubrica
    private evaluacion = null
    public escalasCalificativas = []

    // injeccion de dependencias
    private _config = inject(DynamicDialogConfig)
    private _apiEvaluacionesServ = inject(ApiEvaluacionesService)
    private _ref = inject(DynamicDialogRef)

    private _unsubscribe$ = new Subject<boolean>()

    ngOnInit() {
        this.evaluacionEstudiante = this._config.data.evaluacionEstudiante
        this.pregunta = this._config.data.pregunta
        this.evaluacion = this._config.data.evaluacion
        this.getData()
        console.log(this.pregunta, this.evaluacionEstudiante)
    }

    getData() {
        if (
            !this.pregunta.logrosCalificacion ||
            this.pregunta.logrosCalificacion?.length === 0
        ) {
            this.obtenerRubrica()
        }
        this.obtenerEscalaCalificaciones()
    }

    obtenerRubrica() {
        this._apiEvaluacionesServ
            .obtenerRubricas({
                iInstrumentoId: this.evaluacion.iInstrumentoId,
            })
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe({
                next: (data) => {
                    const rubrica = data?.length > 0 ? data[0] : null
                    console.log(data, rubrica)
                    if (rubrica) {
                        rubrica.criterios.map((criterio) => {
                            criterio.niveles.map((nivel) => {
                                const nivelLogro =
                                    this.obtenerLogrosCalificacion(
                                        nivel.iNivelEvaId
                                    )
                                if (nivelLogro) {
                                    nivel.iNivelLogroAlcId
                                    nivel.iEscalaCalifId
                                    nivel.iEvalRptaId
                                    nivel.nNnivelLogroAlcNota
                                    nivel.cNivelLogroAlcConclusionDescriptiva
                                    nivel.iNivelEvaId
                                }
                                return nivel
                            })
                            return criterio
                        })
                    }
                    this.rubrica = rubrica
                },
            })
    }

    obtenerLogrosCalificacion(iNivelEvaId) {
        const logrosCalificacion = this.pregunta.logrosCalificacion ?? []
        const logroAlcanzado = logrosCalificacion.find(
            (logro) => logro.iNivelEvaId === iNivelEvaId
        )
        return logroAlcanzado
    }

    obtenerEscalaCalificaciones() {
        this._apiEvaluacionesServ
            .obtenerEscalaCalificaciones()
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe({
                next: (data) => {
                    this.escalasCalificativas = data
                },
            })
    }

    closeModal(data) {
        this._ref.close(data)
    }

    ngOnDestroy() {
        this._unsubscribe$.next(true)
        this._unsubscribe$.complete()
    }
}
