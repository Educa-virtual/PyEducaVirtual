import { Component, OnInit, inject, OnDestroy } from '@angular/core'

import {
    IActionTable,
    IColumn,
} from '../../../../shared/table-primeng/table-primeng.component'
import { IActionContainer } from '@/app/shared/container-page/container-page.component'
import { DialogService } from 'primeng/dynamicdialog'
import { MODAL_CONFIG } from '@/app/shared/constants/modal.config'
import { AsignarMatrizPreguntasFormComponent } from './asignar-matriz-preguntas-form/asignar-matriz-preguntas-form.component'
import { Subject, takeUntil } from 'rxjs'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { ApiEvaluacionesRService } from '../../services/api-evaluaciones-r.service'
import { ActivatedRoute } from '@angular/router'
import { BancoPreguntasModule } from './banco-preguntas.module'
import { BancoPreguntaListaComponent } from './components/banco-pregunta-lista/banco-pregunta-lista.component'
import { BancoPreguntasFormContainerComponent } from './banco-preguntas-form-container/banco-preguntas-form-container.component'
import { CompartirFormularioEvaluacionService } from '../../services/ereEvaluaciones/compartir-formulario-evaluacion.service'

@Component({
    selector: 'app-ere-preguntas',
    templateUrl: './banco-preguntas.component.html',
    standalone: true,
    imports: [BancoPreguntasModule, BancoPreguntaListaComponent],
    styleUrls: ['./banco-preguntas.component.scss'],
})
export class BancoPreguntasComponent implements OnInit, OnDestroy {
    // Injeccion de dependencias
    private _dialogService = inject(DialogService)
    private _apiEre = inject(ApiEvaluacionesRService)
    private _apiEvaluacionesR = inject(ApiEvaluacionesRService)
    private _confirmationModalService = inject(ConfirmationModalService)
    private _route = inject(ActivatedRoute)

    nombreCurso: string | null = null
    grado: string | null = null
    nivel: string | null = null
    seccion: string | null = null

    private unsubscribe$: Subject<boolean> = new Subject()

    public area = {
        nombreCurso: '',
        grado: '',
        seccion: '',
        nivel: '',
        nombreEvaluacion: '',
    }
    public desempenos = []
    public estados = []
    public evaluaciones = []
    public nombreEvaluacion = []
    public tipoPreguntas = []
    public expandedRowKeys = {}

    public params = {
        bPreguntaEstado: -1,
        iCursoId: 1,
        iNivelTipoId: 1,
        iTipoPregId: 0,
        iEvaluacionId: 0,
    }

    selectedItems = []
    // acciones Contenedor
    accionesPrincipal: IActionContainer[] = [
        {
            labelTooltip: 'Word',
            text: 'Word',
            icon: 'pi pi-file-word',
            accion: 'generar-word',
            class: 'p-button-info',
        },
        {
            labelTooltip: 'Asignar Matriz',
            text: 'Asignar Matriz',
            icon: {
                name: 'matGroupWork',
                size: 'xs',
                color: '',
            },
            accion: 'asignar',
            class: 'p-button-primary',
        },
        {
            labelTooltip: 'Agregar Pregunta',
            text: 'Agregar Preguntass',
            icon: 'pi pi-plus',
            accion: 'agregar',
            class: 'p-button-secondary',
        },
    ]

    public data = []

    // Columnas Tabla Banco Preguntas
    columnas: IColumn[] = [
        {
            field: '',
            header: '',
            type: 'expansion',
            width: '2rem',
            text: 'left',
            text_header: 'left',
        },
        {
            field: 'cEncabPregTitulo',
            header: 'Encabezado',
            type: 'text',
            width: '5rem',
            text: 'left',
            text_header: 'Encabezado',
        },
        {
            field: 'cTipoPregDescripcion',
            header: 'Tipo Pregunta',
            type: 'text',
            width: '5rem',
            text: 'left',
            text_header: 'Tipo Pregunta',
        },
        {
            field: 'time',
            header: 'Tiempo',
            type: 'text',
            width: '5rem',
            text: 'left',
            text_header: 'Tiempo',
        },
        {
            field: 'iPreguntaPeso',
            header: 'Puntaje',
            type: 'text',
            width: '5rem',
            text: 'left',
            text_header: 'Puntaje',
        },
        {
            field: 'iPreguntaNivel',
            header: 'Nivel',
            type: 'text',
            width: '5rem',
            text: 'left',
            text_header: 'Nivel',
        },
        {
            field: 'cPreguntaClave',
            header: 'Clave',
            type: 'text',
            width: '5rem',
            text: 'left',
            text_header: 'Clave',
        },
        {
            field: 'bPreguntaEstado',
            header: 'Estado',
            type: 'estado',
            width: '5rem',
            text: 'left',
            text_header: 'Estado',
            customFalsy: {
                trueText: 'Con Matriz',
                falseText: 'Sin Matriz',
            },
        },
        {
            field: '',
            header: 'Acciones',
            type: 'actions',
            width: '5rem',
            text: 'left',
            text_header: '',
        },
        {
            field: 'checked',
            header: '',
            type: 'checkbox',
            width: '5rem',
            text: 'left',
            text_header: '',
        },
    ]

    // Acciones tabla Banco Preguntas
    public accionesTabla: IActionTable[] = [
        {
            labelTooltip: 'Editar',
            icon: 'pi pi-pencil',
            accion: 'editar',
            type: 'item',
            class: 'p-button-rounded p-button-warning p-button-text',
        },
        {
            labelTooltip: 'Eliminar',
            icon: 'pi pi-trash',
            accion: 'eliminar',
            type: 'item',
            class: 'p-button-rounded p-button-danger p-button-text',
        },
        {
            labelTooltip: 'Asignar Matriz',
            icon: {
                name: 'matGroupWork',
                size: 'xs',
            },
            accion: 'asignar',
            type: 'item',
            class: 'p-button-rounded p-button-primary p-button-text',
        },
    ]
    constructor(
        private compartirFormularioEvaluacionService: CompartirFormularioEvaluacionService
    ) {}

    ngOnInit() {
        this.getParamsByUrl()
        this.initializeData()
        this.fetchInitialData()
        // Capturamos el parámetro iEvaluacionId de la URL
        this._route.queryParams.subscribe((params) => {
            this.evaluaciones = params['iEvaluacionId']
            console.log(
                'iEvaluacionId recibido en BancoPreguntasComponent:',
                this.evaluaciones
            )
            this.nombreEvaluacion = params['nombreEvaluacion']
            console.log(
                'NombreEvaluacion recibido en BancoPreguntasComponent:',
                this.nombreEvaluacion
            )
        })
        this.nombreCurso =
            this.compartirFormularioEvaluacionService.getcEvaluacionNombre()
        this.grado = this.compartirFormularioEvaluacionService.getGrado()
        this.nivel = this.compartirFormularioEvaluacionService.getNivel()
        this.seccion = this.compartirFormularioEvaluacionService.getSeccion()

        console.log('Datos recibidos:', {
            nombreCurso: this.nombreCurso,
            grado: this.grado,
            nivel: this.nivel,
            seccion: this.seccion,
        })
    }

    getParamsByUrl() {
        this._route.queryParams.subscribe((params) => {
            this.area = {
                nombreCurso: params['nombreCurso'],
                grado: params['grado'] ?? '',
                seccion: params['seccion'] ?? '',
                nivel: params['nivel'] ?? '',
                nombreEvaluacion: params['nombreEvaluacion'] ?? '',
            }
        })
    }

    // obtener información inicial
    fetchInitialData() {
        this.obtenerBancoPreguntas()
        this.obtenerDesempenos()
        this.obtenerTipoPreguntas()
    }

    // Inicializar filtros
    initializeData() {
        this.tipoPreguntas = [
            {
                iTipoPregId: 0,
                cTipoPregDescripcion: 'Todos',
            },
        ]

        this.estados = [
            {
                bPreguntaEstado: -1,
                cDSC: 'Todos',
            },
            {
                bPreguntaEstado: 0,
                cDSC: 'Sin Asignar',
            },
            {
                bPreguntaEstado: 1,
                cDSC: 'Asignado',
            },
        ]
    }

    obtenerDesempenos() {
        this._apiEre
            .obtenerDesempenos(this.params)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (data) => {
                    this.desempenos = data
                },
            })
    }

    obtenerBancoPreguntas() {
        this._apiEre
            .obtenerBancoPreguntas(this.params)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (data) => {
                    this.data = data
                    this.data.forEach((item) => {
                        this.expandedRowKeys[item.iPreguntaId] = true
                    })

                    this.expandedRowKeys = Object.assign(
                        {},
                        this.expandedRowKeys
                    )
                },
            })
    }

    obtenerTipoPreguntas() {
        this._apiEvaluacionesR
            .obtenerTipoPreguntas()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (data) => {
                    this.tipoPreguntas = [
                        {
                            iTipoPregId: 0,
                            cTipoPregDescripcion: 'Todos',
                        },
                        ...data,
                    ]
                },
            })
    }

    // manejar las acciones
    accionBtnItem(action) {
        if (action.accion === 'agregar') {
            this.agregarEditarPregunta({
                iPreguntaId: 0,
                preguntas: [],
                iEncabPregId: -1,
            })
        }
        if (action.accion === 'asignar') {
            this.asignarPreguntas()
        }

        if (action.accion === 'generar-word') {
            this.generarWord()
        }
    }

    generarWord() {
        if (this.selectedItems.length === 0) {
            this._confirmationModalService.openAlert({
                header: 'Debe seleccionar almenos una pregunta.',
            })
            return
        }

        let preguntas = []

        this.selectedItems.forEach((item) => {
            if (item.iEncabPregId == -1) {
                preguntas = [...preguntas, item]
            } else {
                preguntas = [...preguntas, ...item.preguntas]
            }
        })

        const ids = preguntas.map((item) => item.iPreguntaId).join(',')

        const params = {
            iCursoId: this.params.iCursoId,
            ids,
        }
        this._apiEvaluacionesR.generarWordByPreguntasIds(params)
    }

    accionBtnItemTable({ accion, item }) {
        if (accion === 'asignar') {
            this.selectedItems = []
            this.selectedItems = [item]
            this.asignarPreguntas()
        }
        if (accion === 'editar') {
            this.agregarEditarPregunta(item)
        }

        if (accion === 'eliminar') {
            this.eliminarPregunta(item)
        }
    }

    eliminarPregunta(item) {
        let ids = item.iPreguntaId
        if (item.iEncabPregId != -1) {
            ids = item.preguntas.map((item) => item.iPreguntaId).join(',')
        }

        this._confirmationModalService.openConfirm({
            header: 'Esta seguro de eliminar la alternativa?',
            accept: () => {
                this._apiEvaluacionesR.eliminarPreguntaById(ids).subscribe({
                    next: () => {
                        this.obtenerBancoPreguntas()
                    },
                })
            },
            reject: () => {},
        })
    }

    // abrir el modal para asignar preguntas
    asignarPreguntas() {
        if (this.selectedItems.length === 0) {
            this._confirmationModalService.openAlert({
                header: 'Debe seleccionar una pregunta para asignarla.',
            })
            return
        }
        const refModal = this._dialogService.open(
            AsignarMatrizPreguntasFormComponent,
            {
                ...MODAL_CONFIG,
                data: {
                    preguntas: this.selectedItems,
                    desempenos: this.desempenos,
                },
                header: 'Asignar preguntas',
            }
        )

        refModal.onClose.subscribe((result) => {
            if (result) {
                this.obtenerBancoPreguntas()
            }
        })
    }

    // abrir el modal para agregar una nueva pregunta
    agregarEditarPregunta(pregunta) {
        const refModal = this._dialogService.open(
            BancoPreguntasFormContainerComponent,
            {
                ...MODAL_CONFIG,
                data: {
                    tipoPreguntas: this.tipoPreguntas,
                    pregunta: pregunta,
                    iCursoId: this.params.iCursoId,
                    iEvaluacionId: this.evaluaciones, // Pasamos iEvaluacionId para el BancoPreguntaFormContainer
                },
                header:
                    pregunta.iPreguntaId == 0
                        ? 'Nueva pregunta'
                        : 'Editar pregunta',
            }
        )
        refModal.onClose.subscribe((result) => {
            if (result) {
                this.obtenerBancoPreguntas()
            }
        })
    }

    // desuscribirse de los observables cuando se destruye el componente
    ngOnDestroy(): void {
        this.unsubscribe$.next(true)
        this.unsubscribe$.complete()
    }
}
