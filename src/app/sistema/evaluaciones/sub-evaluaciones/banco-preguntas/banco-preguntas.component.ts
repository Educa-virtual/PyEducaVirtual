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
import { GeneralService } from '@/app/servicios/general.service'
import { DomSanitizer } from '@angular/platform-browser'
// import { AulaBancoPreguntasComponent } from '@/app/sistema/aula-virtual/sub-modulos/aula-banco-preguntas/aula-banco-preguntas/aula-banco-preguntas.component'
import { MessageService } from 'primeng/api'
import { IArea } from '../areas/interfaces/area.interface'
import { CompartirIdEvaluacionService } from '../../services/ereEvaluaciones/compartir-id-evaluacion.service'
@Component({
    selector: 'app-ere-preguntas',
    templateUrl: './banco-preguntas.component.html',
    standalone: true,
    imports: [BancoPreguntasModule, BancoPreguntaListaComponent],
    providers: [GeneralService],
    styleUrls: ['./banco-preguntas.component.scss'],
})
export class BancoPreguntasComponent implements OnInit, OnDestroy {
    // Injeccion de dependencias
    private _dialogService = inject(DialogService)
    private _apiEre = inject(ApiEvaluacionesRService)
    private _apiEvaluacionesR = inject(ApiEvaluacionesRService)
    private _confirmationModalService = inject(ConfirmationModalService)
    private _route = inject(ActivatedRoute)
    queryParams: any = {}
    areaId: string | null = null
    nombreCurso: string | null = null
    grado: string | null = null
    nivel: string | null = null
    seccion: string | null = null
    nombrecEvaluacion: string | null = null
    area: IArea | null = null // Declara la propiedad
    public iEvaluacionId!: number // Propiedad para almacenar el ID de evaluación
    unsubscribe$: Subject<boolean> = new Subject()
    private _MessageService = inject(MessageService)
    public areax = {
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
        //iCursoId: 1,
        iCursosNivelGradId: 0,
        iNivelTipoId: 1,
        iTipoPregId: 0,
        // iEvaluacionId: 0,
    }

    areas: any[] = []
    selectedItems = []
    public iEvaluacionIdS: number | null = null
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
            field: 'checked',
            header: '',
            type: 'checkbox',
            width: '5rem',
            text: 'left',
            text_header: '',
        },
        {
            field: 'cPregunta',
            header: 'Pregunta',
            type: 'text',
            width: '5rem',
            text: 'left',
            text_header: 'Pregunta',
        },
        {
            field: 'iEncabPregId',
            header: 'Encabezado',
            type: 'text',
            width: '5rem',
            text: 'left',
            text_header: 'Encabezado',
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
            field: '',
            header: 'Acciones',
            type: 'actions',
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
    ]
    constructor(
        private compartirFormularioEvaluacionService: CompartirFormularioEvaluacionService,
        private compartirIdEvaluacionService: CompartirIdEvaluacionService,
        private query: GeneralService,
        private sanitizer: DomSanitizer,
        private route: ActivatedRoute
    ) {
        // Obtener el areaId dinámicamente desde la ruta
        this.areaId = this.route.snapshot.paramMap.get('areaId')
        console.log('Areas Id:', this.areaId)

        // Si el areaId es válido, asignarlo a iCursosNivelGradId
        if (this.areaId) {
            this.params.iCursosNivelGradId = parseInt(this.areaId) // Convertirlo a número si es necesario
        }
    }

    ngOnInit() {
        this.getParamsByUrl()
        this.initializeData()
        this.fetchInitialData()
        this.getTipoAmbiente()

        this.iEvaluacionIdS = this.compartirIdEvaluacionService.iEvaluacionId
        console.log(
            'Evaluacion Servicio ---->',
            this.compartirIdEvaluacionService.iEvaluacionId
        )
        // Capturar el parámetro de la URL
        this.areaId = this.route.snapshot.paramMap.get('areaId')
        console.log('Areas Id:', this.areaId)

        // Capturar los parámetros de consulta (queryParams)
        this.route.queryParams.subscribe((params) => {
            this.queryParams = params
            // Construir el objeto area de tipo IArea
            const area: IArea = {
                id: this.areaId,
                nombre: params['nombreCurso'],
                seccion: params['seccion'],
                grado: params['grado'],
                nivel: params['nivel'],
                descripcion: params['descripcion'] || 'Sin descripción', // Valor por defecto si no está disponible
                totalEstudiantes: parseInt(
                    params['totalEstudiantes'] || '0',
                    10
                ),
            }
            this.iEvaluacionId = +params['iEvaluacionId'] // Asegúrate de convertir el valor a número
            console.log('Params:', this.queryParams)
            console.log('Objeto IArea:', area)

            console.log('ID de Evaluación:', this.iEvaluacionId)
        })

        //Capturamos el parámetro iEvaluacionId de la URL
        // this._route.queryParams.subscribe((params) => {
        //     this.evaluaciones = params['iEvaluacionId']
        //     this.nombreEvaluacion = params['nombreEvaluacion']
        // })

        this.nombrecEvaluacion =
            this.compartirFormularioEvaluacionService.getcEvaluacionNombre()
        this.grado = this.compartirFormularioEvaluacionService.getGrado()
        this.nivel = this.compartirFormularioEvaluacionService.getNivel()
        this.seccion = this.compartirFormularioEvaluacionService.getSeccion()

        console.log('Datos recibidos:', {
            nombrecEvaluacion: this.nombrecEvaluacion,
            grado: this.grado,
            nivel: this.nivel,
            seccion: this.seccion,
        })
    }

    getParamsByUrl() {
        this._route.queryParams.subscribe((params) => {
            this.areax = {
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
        // Obtener el areaId dinámicamente desde la ruta
        this.areaId = this.route.snapshot.paramMap.get('areaId')
        console.log('Areas Id:', this.areaId)

        // Si el areaId es válido, asignarlo a iCursosNivelGradId
        if (this.areaId) {
            this.params.iCursosNivelGradId = parseInt(this.areaId) // Convertirlo a número si es necesario
        }

        // Llamar a la API para obtener el banco de preguntas
        this._apiEre
            .obtenerBancoPreguntas(this.params)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (data) => {
                    console.log('Datos completos de banco de preguntas:', data)

                    // Filtrar las preguntas por iCursosNivelGradId
                    this.data = data.filter(
                        (item) =>
                            item.iCursosNivelGradId ===
                            this.params.iCursosNivelGradId
                    )

                    // Expandir automáticamente las filas si es necesario
                    this.data.forEach((item) => {
                        this.expandedRowKeys[item.iPreguntaId] = true
                    })
                    this.expandedRowKeys = Object.assign(
                        {},
                        this.expandedRowKeys
                    )

                    console.log(
                        'Datos filtrados de banco de preguntas:',
                        this.data
                    )
                },
            })

        console.log('Parámetros enviados:', this.params)
    }

    preguntastocursos = []
    //!
    getTipoAmbiente() {
        this.query

            .searchCalAcademico({
                esquema: 'ere',
                tabla: 'preguntas',
                campos: 'iPreguntaId,iDesempenoId,iTipoPregId,cPregunta,cPreguntaTextoAyuda,iPreguntaNivel,iPreguntaPeso,bPreguntaEstado,cPreguntaClave,iEstado,iSesionId,iEspecialistaId,iNivelGradoId,iEncabPregId,iCursosNivelGradId',
                condicion: '1=1',
            })
            .subscribe({
                next: (data: any) => {
                    // Truncar los campos cPregunta y cPreguntaTextoAyuda
                    this.preguntastocursos = data.data.map((pregunta: any) => ({
                        ...pregunta,
                        cPregunta:
                            pregunta.cPregunta.length > 100
                                ? pregunta.cPregunta.slice(0, 100) + '...'
                                : pregunta.cPregunta,
                    }))
                    console.log(this.preguntastocursos)
                },
                error: (error) => {
                    console.error('Error fetching Años Académicos:', error)
                },
                complete: () => {
                    console.log('Request completed')
                },
            })
    }
    onRowSelectionChange(event: any) {
        console.log('Cambios en selección:', event) // Este evento debería contener las filas seleccionadas
        console.log('Variable seleccionados:', this.selectedItems)
    }

    generarPdfMatriz(): void {
        if (this.selectedItems.length === 0) {
            this._confirmationModalService.openAlert({
                header: 'Debe seleccionar al menos una pregunta.',
            })
            return
        }

        let preguntas = []

        // Procesar las preguntas seleccionadas
        this.selectedItems.forEach((item) => {
            if (item.iEncabPregId == -1) {
                preguntas = [...preguntas, item] // Agregar la pregunta directamente si no tiene encabezado
            } else {
                preguntas = [...preguntas, ...item.preguntas] // Agregar preguntas anidadas si tienen encabezado
            }
        })

        // Crear un array de IDs de preguntas
        const ids = preguntas.map((item) => item.iPreguntaId).join(',')

        const params = {
            iEvaluacionId: this.iEvaluacionId,
            nombreEvaluacion: this.nombrecEvaluacion,
            areaId: this.areaId,
            ids,
            seccion: this.queryParams.seccion,
            grado: this.queryParams.grado,
            nivel: this.queryParams.nivel,
            nombreCurso: this.queryParams.nombreCurso,
        }
        console.log('Parametros para el servicio:', params)
        //!
        // Llamar al servicio para generar el PDF
        this._apiEre.generarPdfMatrizbyEvaluacionId(params).subscribe(
            (response) => {
                console.log('Respuesta del backend:', response)

                if (response) {
                    console.log(
                        'Áreas decodificadas desde Laravel:',
                        response.areas
                    )
                }
                //console.log('Respuesta de Evaluación:', iEvaluacionId)

                // Mostrar mensaje de éxito
                this._MessageService.add({
                    severity: 'success',
                    detail: 'Comienza la descarga de la Matriz',
                })

                // Crear un enlace de descarga para el archivo PDF
                const blob = response as Blob
                const link = document.createElement('a')
                link.href = URL.createObjectURL(blob)
                link.download = `matriz_evaluacion.pdf`
                link.click()
            },
            (error) => {
                const errorMessage =
                    error?.message ||
                    'No hay datos suficientes para descargar la Matriz'

                // Mostrar mensaje de error
                this._MessageService.add({
                    severity: 'error',
                    detail: errorMessage,
                })
            }
        )
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
            // iCursoId: this.params.iCursoId,
            iCursosNivelGradId: this.params.iCursosNivelGradId,
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
                    // iCursoId: this.params.iCursoId,
                    iCursosNivelGradId: this.params.iCursosNivelGradId,
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
