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
    ],
    templateUrl: './evaluacion-pregunta-calificacion.component.html',
    styleUrl: './evaluacion-pregunta-calificacion.component.scss',
})
export class EvaluacionPreguntaCalificacionComponent
    implements OnInit, OnDestroy
{
    evaluacion = null
    pregunta = null
    public escalasCalificativas = []

    // injeccion de dependencias
    private _config = inject(DynamicDialogConfig)
    private _apiEvaluacionesServ = inject(ApiEvaluacionesService)
    private _ref = inject(DynamicDialogRef)

    private _unsubscribe$ = new Subject<boolean>()

    ngOnInit() {
        this.evaluacion = this._config.data.evaluacion
        this.pregunta = this._config.data.pregunta
        this.getData()
        console.log(this.pregunta)
    }

    getData() {
        this.obtenerEscalaCalificaciones()
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
