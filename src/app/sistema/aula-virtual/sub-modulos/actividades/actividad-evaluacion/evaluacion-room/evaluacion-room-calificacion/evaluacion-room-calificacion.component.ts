import { CommonModule } from '@angular/common'
import {
    Component,
    computed,
    inject,
    Input,
    OnInit,
    signal,
    OnChanges,
} from '@angular/core'
import { RemoveHTMLPipe } from '@/app/shared/pipes/remove-html.pipe'
import { ApiEvaluacionesService } from '@/app/sistema/aula-virtual/services/api-evaluaciones.service'
import { Subject, takeUntil } from 'rxjs'
import { EvaluacionPreguntaComponent } from '../components/evaluacion-pregunta/evaluacion-pregunta.component'
import { PrimengModule } from '@/app/primeng.module'
import { DialogService } from 'primeng/dynamicdialog'
import { EvaluacionPreguntaCalificacionComponent } from '../evaluacion-pregunta-calificacion/evaluacion-pregunta-calificacion.component'
import { MODAL_CONFIG } from '@/app/shared/constants/modal.config'
import { ToolbarPrimengComponent } from '../../../../../../../shared/toolbar-primeng/toolbar-primeng.component'
import { EvaluacionHeaderComponent } from '../components/evaluacion-header/evaluacion-header.component'
import { NoDataComponent } from '../../../../../../../shared/no-data/no-data.component'
import { SharedAnimations } from '@/app/shared/animations/shared-animations'
import { RubricaCalificarComponent } from '@/app/sistema/aula-virtual/features/rubricas/components/rubrica-calificar/rubrica-calificar.component'
import { ActivatedRoute, Router } from '@angular/router'
import { CardOrderListComponent } from '@/app/shared/card-orderList/card-orderList.component'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { ApiAulaService } from '@/app/sistema/aula-virtual/services/api-aula.service'
import { ConstantesService } from '@/app/servicios/constantes.service'
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
        RemoveHTMLPipe,
        EvaluacionPreguntaComponent,
        ToolbarPrimengComponent,
        EvaluacionHeaderComponent,
        NoDataComponent,
        RubricaCalificarComponent,
        CardOrderListComponent,
    ],
    templateUrl: './evaluacion-room-calificacion.component.html',
    styleUrl: './evaluacion-room-calificacion.component.scss',
    providers: [DialogService],
    animations: [SharedAnimations],
})
export class EvaluacionRoomCalificacionComponent implements OnInit, OnChanges {
    @Input({ required: true }) evaluacion
    @Input({ required: true }) iEvaluacionId: string
    @Input() iEstado: number

    isExpand = false
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
    tareasFalta: any
    tareasCulminado: any
    evaluacionEstudiante: any

    // datos para listar estudiantes
    perfil: any
    idDocCursoId: any[] = []
    private _aulaService = inject(ApiAulaService)
    public estudianteMatriculadosxGrado = []

    showListaEstudiantes: boolean = true

    updateSelectedEstudiante(value: any) {
        console.log(value)
        this._state.update((state) => {
            console.log('selectedEstudiante')
            console.log(value)
            this.router.navigate([], {
                queryParams: {
                    // iEvalPromId: value.iEvalPromId ?? undefined,
                    iEstudianteId: value.iEstudianteId ?? undefined,
                },
                queryParamsHandling: 'merge',
            })

            return {
                ...state,
                selectedEstudiante: value,
            }
        })
        this.seleccionarEvaluacion()
    }

    get selectedEstudianteValue() {
        return this._state().selectedEstudiante
    }

    // injeccion de dependencias
    private _evaluacionesService = inject(ApiEvaluacionesService)
    private _dialogService = inject(DialogService)
    private _ConstantesService = inject(ConstantesService)
    private _ActivatedRoute = inject(ActivatedRoute)
    private _unsubscribe$ = new Subject<boolean>()

    private router = inject(Router)

    public leyendasOrden = ['REVISADO', 'PROCESO', 'FALTA']

    constructor(
        private store: LocalStoreService,
        private _activatedRoute: ActivatedRoute
    ) {
        this.perfil = this.store.getItem('dremoPerfil')
        //para obtener el idDocCursoId
        this.idDocCursoId =
            this._activatedRoute.snapshot.queryParams['idDocCursoId']
    }
    ngOnInit() {
        this.getData()
    }
    ngOnChanges(changes) {
        console.log('changes', changes)
        // if (changes.iEstado?.currentValue) {
        //     this.iEstado = changes.iEstado?.currentValue

        //     if (this.iEstado === 2) {
        //         this.getData()
        //     }
        // }
    }

    getData() {
        this.obtenerEstudiantesEvaluacion()
    }

    obtenerEstudiantesEvaluacion() {
        // const params = { iEvaluacionId: this.iEvaluacionId }
        // this._evaluacionesService
        //     .obtenerEstudiantesEvaluación(params)
        //     .pipe(takeUntil(this._unsubscribe$))
        //     .subscribe({
        //         next: (estudiantes) => {
        //             this.estudianteMatriculadosxGrado = estudiantes.map(
        //                 (item: any) => {
        //                     return {
        //                         ...item,
        //                         cTitulo:
        //                             (item.cEstNombres || '') +
        //                             ' ' +
        //                             (item.cEstPaterno || '') +
        //                             ' ' +
        //                             (item.cEstMaterno || ''),
        //                     }
        //                 }
        //             )
        //             this._state.update((current) => ({
        //                 ...current,
        //                 estudiantes,
        //             }))
        //         },
        //     })

        this._aulaService
            .obtenerReporteFinalDeNotas({
                iIeCursoId:
                    this._ActivatedRoute.snapshot.paramMap.get('iIeCursoId'),
                iYAcadId: this._ConstantesService.iYAcadId,
                iSedeId: this._ConstantesService.iSedeId,
                iSeccionId:
                    this._ActivatedRoute.snapshot.paramMap.get('iSeccionId'),
                iNivelGradoId:
                    this._ActivatedRoute.snapshot.paramMap.get('iNivelGradoId'),
            })
            .subscribe((Data) => {
                this.estudianteMatriculadosxGrado = Data['data']
                this.estudianteMatriculadosxGrado = Data['data'].map(
                    (item: any, index) => {
                        return {
                            ...item,
                            cTitulo: index + 1 + '.- ' + item.completoalumno,
                        }
                    }
                )
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
        this.showListaEstudiantes = false
        this.obtenerEvaluacionRespuestasEstudiante()
    }

    guardarEvaluacionEstudiantesxDocente() {}

    accionBtnItem(elemento): void {
        const { accion } = elemento
        //const { item } = elemento
        switch (accion) {
            case 'abrir-lista-estudiantes':
                this.showListaEstudiantes = true
                break
        }
    }
}

export class TopbarComponent {
    menuVisible: boolean = true

    toggleMenu(): void {
        this.menuVisible = !this.menuVisible
    }
}
