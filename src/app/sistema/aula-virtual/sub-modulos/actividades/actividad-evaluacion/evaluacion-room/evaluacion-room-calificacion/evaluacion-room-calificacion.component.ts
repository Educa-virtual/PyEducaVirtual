import { LeyendaComponent } from '@/app/shared/components/leyenda/leyenda.component'
import { CommonModule } from '@angular/common'
import { Component, inject, Input, OnInit } from '@angular/core'
import { IconFieldModule } from 'primeng/iconfield'
import { InputIconModule } from 'primeng/inputicon'
import { InputTextModule } from 'primeng/inputtext'
import { TableModule } from 'primeng/table'
import { EvaluacionInfoComponent } from '@/app/sistema/aula-virtual/sub-modulos/actividades/actividad-evaluacion/evaluacion-room/components/evaluacion-info/evaluacion-info.component'
import { EmptySectionComponent } from '@/app/shared/components/empty-section/empty-section.component'
import { AccordionModule } from 'primeng/accordion'
import { BancoPreguntaPreviewItemComponent } from '@/app/sistema/evaluaciones/sub-evaluaciones/banco-preguntas/components/banco-pregunta-preview/banco-pregunta-preview-item/banco-pregunta-preview-item.component'
import { RemoveHTMLPipe } from '@/app/shared/pipes/remove-html.pipe'
import { ApiEvaluacionesService } from '@/app/sistema/aula-virtual/services/api-evaluaciones.service'
import { Subject, takeUntil } from 'rxjs'

@Component({
    selector: 'app-evaluacion-room-calificacion',
    standalone: true,
    imports: [
        CommonModule,
        LeyendaComponent,
        TableModule,
        IconFieldModule,
        InputIconModule,
        InputTextModule,
        EvaluacionInfoComponent,
        EmptySectionComponent,
        AccordionModule,
        RemoveHTMLPipe,
        BancoPreguntaPreviewItemComponent,
    ],
    templateUrl: './evaluacion-room-calificacion.component.html',
    styleUrl: './evaluacion-room-calificacion.component.scss',
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
                    this.evaluacionSeleccionada.preguntas = resp
                    console.log(this.evaluacionSeleccionada.preguntas)
                },
            })
    }

    public seleccionarEvaluacion() {
        this.obtenerEvaluacionRespuestasEstudiante()
    }
}