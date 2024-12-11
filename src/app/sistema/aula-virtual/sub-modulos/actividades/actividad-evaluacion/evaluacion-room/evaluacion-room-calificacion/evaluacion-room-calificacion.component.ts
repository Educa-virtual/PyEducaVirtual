import { LeyendaComponent } from '@/app/shared/components/leyenda/leyenda.component'
import { CommonModule } from '@angular/common'
import {
    Component,
    computed,
    inject,
    Input,
    OnInit,
    signal,
} from '@angular/core'
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
import { ToolbarPrimengComponent } from '../../../../../../../shared/toolbar-primeng/toolbar-primeng.component'
import { AppTopBarComponent } from '../../../../../../../layout/toolbar/app.topbar.component'

interface Leyenda {
    total: number
    text: string
    size: string
    colorClass: string
}

interface EstudianteState {
    estudiantes: any[]
    leyendas: {
        REVISADO: Leyenda
        PROCESO: Leyenda
        FALTA: Leyenda
    }
    evaluacionEstudiante: any
    selectedEstudiante: any
}

const leyendas = {
    REVISADO: {
        total: 0,
        text: 'Revisados',
        size: 'md',
        colorClass: 'bg-green-500',
    },
    PROCESO: {
        total: 0,
        text: 'En Proceso',
        size: 'md',
        colorClass: 'bg-yellow-500',
    },
    FALTA: {
        total: 0,
        text: 'Faltan',
        size: 'md',
        colorClass: 'bg-red-500',
    },
}

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
        ToolbarPrimengComponent,
        AppTopBarComponent,
    ],
    templateUrl: './evaluacion-room-calificacion.component.html',
    styleUrl: './evaluacion-room-calificacion.component.scss',
    providers: [DialogService],
})
export class EvaluacionRoomCalificacionComponent implements OnInit {
    @Input({ required: true }) evaluacion
    @Input({ required: true }) iEvaluacionId: string

    private _state = signal<EstudianteState>({
        estudiantes: [],
        leyendas: leyendas,
        evaluacionEstudiante: null,
        selectedEstudiante: null,
    })

    leyendas = computed(() => {
        const estudiantes = this._state().estudiantes
        const leyendas = { ...this._state().leyendas }

        leyendas.FALTA.total = estudiantes.filter(
            (e) => e.cEstado === 'FALTA'
        ).length
        leyendas.PROCESO.total = estudiantes.filter(
            (e) => e.cEstado === 'PROCESO'
        ).length
        leyendas.REVISADO.total = estudiantes.filter(
            (e) => e.cEstado === 'REVISADO'
        ).length

        return leyendas
    })

    evaluacionesEstudiantes = computed(() => this._state().estudiantes)
    selectedEstudiante = computed(() => this._state().selectedEstudiante)
    layoutService: any
    toggleMenu: any
    menuVisible: any
    onGlobalFilter: any
    dv: any

    updateSelectedEstudiante(value: any) {
        this._state.update((state) => ({
            ...state,
            selectedEstudiante: value,
        }))
    }

    get selectedEstudianteValue() {
        return this._state().selectedEstudiante
    }

    // injeccion de dependencias
    private _evaluacionesService = inject(ApiEvaluacionesService)
    private _dialogService = inject(DialogService)
    private _unsubscribe$ = new Subject<boolean>()

    public leyendasOrden = ['REVISADO', 'PROCESO', 'FALTA']

    constructor() {}
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
                next: (estudiantes) => {
                    this._state.update((current) => ({
                        ...current,
                        estudiantes,
                    }))
                },
            })
    }

    private obtenerEvaluacionRespuestasEstudiante() {
        // if (!this._state().evaluacionEstudiante) return

        const params = {
            iEvaluacionId: this.iEvaluacionId,
            iEstudianteId: this.selectedEstudiante().iEstudianteId,
        }
        this._evaluacionesService
            .obtenerEvaluacionRespuestasEstudiante(params)
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe({
                next: (preguntas) => {
                    this._state.update((current) => ({
                        ...current,
                        selectedEstudiante: {
                            ...current.selectedEstudiante,
                            preguntas: this.mapPreguntas(preguntas),
                        },
                    }))
                },
            })
    }

    private mapPreguntas(preguntas: any[]) {
        return preguntas.map((pregunta) => {
            if (pregunta.preguntas) {
                return {
                    ...pregunta,
                    preguntas: pregunta.preguntas.map((subPregunta) =>
                        this.mapAlternativaPreguntaEstudiante(subPregunta)
                    ),
                }
            }
            return this.mapAlternativaPreguntaEstudiante(pregunta)
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
                    evaluacion: this.evaluacion,
                    evaluacionEstudiante: this.selectedEstudiante(),
                    pregunta: pregunta,
                },
                header: 'Calificar Pregunta',
            }
        )
        refModal.onClose.subscribe((result) => {
            if (result) {
                const preguntas = this.selectedEstudiante().preguntas.map(
                    (preg) => {
                        if (preg.iPreguntaId === pregunta.iPreguntaId) {
                            preg.iEstadoRespuestaEstudiante = 2
                            if (result.esRubrica) {
                                preg.nivelesLogrosAlcanzados = result.data
                            } else {
                                preg.logrosCalificacion = result.data
                            }
                        }
                        return preg
                    }
                )

                this._state.update((current) => ({
                    ...current,
                    selectedEstudiante: {
                        ...current.selectedEstudiante,
                        preguntas,
                    },
                }))

                this.obtenerEstudiantesEvaluacion()
            }
        })
    }

    public seleccionarEvaluacion() {
        this.obtenerEvaluacionRespuestasEstudiante()
    }

    guardarEvaluacionEstudiantesxDocente() {}
}

export class TopbarComponent {
    menuVisible: boolean = true

    toggleMenu(): void {
        this.menuVisible = !this.menuVisible
    }
}
