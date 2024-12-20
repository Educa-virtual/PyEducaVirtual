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
import { MenuItem, MessageService } from 'primeng/api'
import { IArea } from '../areas/interfaces/area.interface'
import { CompartirIdEvaluacionService } from '../../services/ereEvaluaciones/compartir-id-evaluacion.service'
import { MenuModule } from 'primeng/menu'
import { DialogModule } from 'primeng/dialog'
import { CommonModule } from '@angular/common'
@Component({
    selector: 'app-ere-preguntas',
    templateUrl: './banco-preguntas.component.html',
    standalone: true,
    imports: [
        BancoPreguntasModule,
        BancoPreguntaListaComponent,
        MenuModule,
        DialogModule,
        CommonModule,
    ],
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
    public iPreguntaId!: number // Propiedad para almacenar el ID de evaluación
    preguntasSeleccionadas: any // Aquí se guardarán las preguntas seleccionadas
    preguntasInformacionBanco: any // Aquí se guardarán las preguntas seleccionadas
    bancoPregunta: any
    preguntasInformacion: any[] = [] // Aquí se guardarán las preguntas seleccionadas
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
    public showModalBancoPreguntas: boolean = false
    public mostrarModalBaPrInformacion: boolean = false
    areas: any[] = []
    selectedItems = []
    public iEvaluacionIdS: number | null = null
    public informacionPregunta: any = null
    public informacinoBanco: any = null
    // Datos seleccionados para la segunda tabla
    dataSeleccionado: any[] = [] // Aquí se guardarán las preguntas seleccionadas
    selectedItemsForm = []
    preguntaSelecionada: any[] = []
    preguntastocursos = []
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
            text: 'Agregar Preguntas',
            icon: 'pi pi-plus',
            accion: 'agregar',
            class: 'p-button-secondary',
        },
        // {
        //     labelTooltip: 'asignar',
        //     text: 'asignar',
        //     icon: 'pi pi-plus',
        //     accion: 'asignar',
        //     class: 'p-button-secondary',
        // },
    ]

    public data = []

    // Columnas Tabla Banco Preguntas
    columnas: IColumn[] = [
        // {
        //     field: '',
        //     header: '',
        //     type: 'expansion',
        //     width: '2rem',
        //     text: 'left',
        //     text_header: 'left',
        // },

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
    columnasSelect: IColumn[] = [
        // {
        //     field: '',
        //     header: '',
        //     type: 'expansion',
        //     width: '2rem',
        //     text: 'left',
        //     text_header: 'left',
        // },
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
        {
            labelTooltip: 'Ver',
            icon: 'pi pi-eye',
            accion: 'ver',
            type: 'item',
            class: 'p-button-rounded p-button-warning p-button-text',
        },
    ]
    public accionesTablaSelect: IActionTable[] = [
        {
            labelTooltip: 'Ver',
            icon: 'pi pi-eye',
            accion: 'ver',
            type: 'item',
            class: 'p-button-rounded p-button-warning p-button-text',
        },
    ]

    tiposAgrecacionPregunta: MenuItem[] = [
        {
            label: 'Nueva Pregunta',
            icon: 'pi pi-plus',
            command: () => {
                // this.handleNuevaPregunta()
                this.agregarEditarPregunta({
                    iPreguntaId: 0,
                    preguntas: [],
                    iEncabPregId: -1,
                })
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
        //this.getTipoAmbiente()

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
        //!

        this.obtenerPreguntaSeleccionada(this.iEvaluacionId)
        this.compartirFormularioEvaluacionService.getAreasId()
        console.log(
            'ID de área:',
            this.compartirFormularioEvaluacionService.getAreasId()
        )
    }
    handleBancopregunta() {
        this.showModalBancoPreguntas = true
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

    //!
    // getTipoAmbiente() {
    //     this.query

    //         .searchCalAcademico({
    //             esquema: 'ere',
    //             tabla: 'preguntas',
    //             campos: 'iPreguntaId,iDesempenoId,iTipoPregId,cPregunta,cPreguntaTextoAyuda,iPreguntaNivel,iPreguntaPeso,bPreguntaEstado,cPreguntaClave,iEstado,iSesionId,iEspecialistaId,iNivelGradoId,iEncabPregId,iCursosNivelGradId',
    //             condicion: '1=1',
    //         })
    //         .subscribe({
    //             next: (data: any) => {
    //                 // Truncar los campos cPregunta y cPreguntaTextoAyuda
    //                 this.preguntastocursos = data.data.map((pregunta: any) => ({
    //                     ...pregunta,
    //                     cPregunta:
    //                         pregunta.cPregunta.length > 100
    //                             ? pregunta.cPregunta.slice(0, 100) + '...'
    //                             : pregunta.cPregunta,
    //                 }))
    //             },
    //             error: (error) => {
    //                 console.error('Error fetching Años Académicos:', error)
    //             },
    //             complete: () => {
    //                 console.log('Request completed')
    //             },
    //         })
    // }
    onRowSelectionChange(event: any) {
        this.selectedItems
        console.log('Cambios en selección:', event) // Este evento debería contener las filas seleccionadas
        console.log('Variable seleccionados:', this.selectedItems)

        // this.selectedItemsForm
        // console.log(
        //     'Variable seleccionados selectedItemsForm:',
        //     this.selectedItemsForm
        // )
    }

    guardarPreguntasSeleccionadas(iEvaluacionId: number) {
        // Filtrar las preguntas seleccionadas que aún no están en `dataSeleccionado`
        const nuevasPreguntas = this.selectedItems.filter(
            (item) =>
                !this.dataSeleccionado.some(
                    (seleccionado) =>
                        seleccionado.iPreguntaId === item.iPreguntaId
                )
        )

        // Preparar el payload con todas las preguntas seleccionadas
        const payload = {
            iEvaluacionId: iEvaluacionId, // ID de evaluación
            preguntas: nuevasPreguntas.map((pregunta) => ({
                iPreguntaId: pregunta.iPreguntaId, // ID de cada pregunta
            })),
        }
        console.log('Payload:', payload)
        // Enviar el payload al backend en una sola solicitud
        this._apiEre
            .insertarPreguntaSeleccionada(payload) // Endpoint que maneja múltiples preguntas
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (response) => {
                    console.log('Preguntas guardadas exitosamente:', response)

                    // Actualizar la lista de seleccionados si se guardaron correctamente
                    this.dataSeleccionado = [
                        ...this.dataSeleccionado,
                        ...nuevasPreguntas,
                    ]
                },
                error: (error) => {
                    console.error('Error al guardar las preguntas:', error)
                },
            })

        // Limpiar las preguntas seleccionadas del formulario
        this.selectedItems = []

        // Log para confirmar el proceso
        console.log('Payload enviado al backend:', payload)
        console.log(
            'Estado actualizado de preguntas seleccionadas:',
            this.dataSeleccionado
        )
    }
    // obtenerPreguntaSeleccionada(iEvaluacionId: number) {
    //     if (!iEvaluacionId || iEvaluacionId < 0) {
    //         console.error(
    //             'El parámetro iEvaluacionIdS no está definido o es inválido'
    //         )
    //         return
    //     }
    //     this._apiEre.obtenerPreguntaSeleccionada(iEvaluacionId).subscribe({
    //         next: (data) => {
    //             //console.log('Preguntas seleccionadas:', data)
    //             this.preguntasSeleccionadas = data // Guardamos las preguntas en una variable
    //             console.log(
    //                 'Datos completos de banco de preguntas:',
    //                 this.preguntasSeleccionadas
    //             )
    //         },
    //         error: (error) => {
    //             console.error(
    //                 'Error al obtener las preguntas seleccionadas:',
    //                 error
    //             )
    //         },
    //     })
    // }

    //!
    obtenerPreguntaSeleccionada(iEvaluacionId: number) {
        if (!iEvaluacionId || iEvaluacionId < 0) {
            console.error(
                'El parámetro iEvaluacionId no está definido o es inválido'
            )
            return
        }

        // Obtener el areaId dinámicamente desde la ruta
        this.areaId = this.route.snapshot.paramMap.get('areaId')
        console.log('Area Id:', this.areaId)

        // Si el areaId es válido, asignarlo a iCursosNivelGradId
        if (this.areaId) {
            this.params.iCursosNivelGradId = parseInt(this.areaId) // Convertir el areaId a número
            console.log(
                'iCursosNivelGradId asignado:',
                this.params.iCursosNivelGradId
            )
        }

        this._apiEre.obtenerPreguntaSeleccionada(iEvaluacionId).subscribe({
            next: (data: any[]) => {
                console.log('Datos sin filtrar:', data) // Verifica los datos originales

                // Convertir ambos valores a string para asegurar la comparación
                this.preguntasSeleccionadas = data.filter(
                    (item) =>
                        item.iCursosNivelGradId.toString() ===
                        this.params.iCursosNivelGradId.toString()
                )

                console.log('Datos filtrados:', this.preguntasSeleccionadas)
            },
            error: (error) => {
                console.error(
                    'Error al obtener las preguntas seleccionadas:',
                    error
                )
            },
        })
    }

    //!

    accionVerPreguntas(): void {
        this._apiEre
            .obtenerPreguntaInformacion(
                this.iEvaluacionId,
                this.selectedItems.map((item) => item.iPreguntaId).join(',')
            )
            .subscribe({
                next: (resp: any) => {
                    console.log('Respuesta completa de la API:', resp)

                    // Filtrar la respuesta para obtener solo la pregunta seleccionada
                    const preguntaSeleccionada = resp.find(
                        (pregunta: any) =>
                            // pregunta.iPreguntaId ===
                            // this.informacionPregunta.iPreguntaId
                            parseInt(pregunta.iPreguntaId) ===
                            parseInt(this.informacionPregunta.iPreguntaId)
                    )

                    if (preguntaSeleccionada) {
                        this.preguntasInformacion = [preguntaSeleccionada] // Asignar la pregunta seleccionada
                    } else {
                        this.preguntasInformacion = [] // Si no se encuentra la pregunta, no se muestra nada
                    }

                    console.log(
                        'Pregunta seleccionada del Const Pregunta Seleccionada:',
                        preguntaSeleccionada
                    )
                    console.log(
                        'Pregunta seleccionada de PreguntasInformacion:',
                        this.preguntasInformacion
                    )
                },
                error: (err) => {
                    console.error('Error al cargar datos:', err)
                },
            })
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
        if (accion === 'ver') {
            this.informacionPregunta = item
            this.mostrarModalBaPrInformacion = true
            //this.showModalBancoPreguntas = true
            console.log('Informacion de la pregunta de ITEM', item)
            this.accionVerPreguntas() // Llamar a la función
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
