import { Component, inject, OnInit, OnDestroy } from '@angular/core'
import { EvaluacionesFormComponent } from '../evaluaciones/evaluaciones-form/evaluaciones-form.component'
import { CompartirFormularioEvaluacionService } from './../../services/ereEvaluaciones/compartir-formulario-evaluacion.service'
import { DialogService } from 'primeng/dynamicdialog'
import { MODAL_CONFIG } from '@/app/shared/constants/modal.config'
import {
    IActionTable,
    IColumn,
    TablePrimengComponent,
} from '../../../../shared/table-primeng/table-primeng.component'
import { ApiEvaluacionesRService } from '../../services/api-evaluaciones-r.service'
import { BehaviorSubject, Subject, takeUntil } from 'rxjs'
import { IActionContainer } from '@/app/shared/container-page/container-page.component'
import { CompartirIdEvaluacionService } from './../../services/ereEvaluaciones/compartir-id-evaluacion.service'
import { PrimengModule } from '@/app/primeng.module'
import { MenuItem, MessageService } from 'primeng/api'
import { Router } from '@angular/router'
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'
import { ApiService } from '@/app/servicios/api.service'
import { IUpdateTableService } from '@/app/interfaces/api.interface'
import { UtilService } from '@/app/servicios/utils.service'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { ContainerPageAccionbComponent } from './container-page-accionb/container-page-accionb.component'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { GeneralService } from '@/app/servicios/general.service'
import { DIRECTOR_IE } from '@/app/servicios/perfilesConstantes'
import {
    ADMINISTRADOR_DREMO,
    ESPECIALISTA_DREMO,
    ESPECIALISTA_UGEL,
} from '@/app/servicios/seg/perfiles'
import { FormLiberarAreasUgelComponent } from '../../../ere/components/areas/form-liberar-areas-ugel/form-liberar-areas-ugel.component'
@Component({
    selector: 'app-evaluaciones',
    standalone: true,
    imports: [
        TablePrimengComponent,
        PrimengModule,
        ContainerPageAccionbComponent,
        FormLiberarAreasUgelComponent,
    ],
    providers: [DialogService],
    templateUrl: './evaluaciones.component.html',
    styleUrl: './evaluaciones.component.scss',
})
export class EvaluacionesComponent implements OnInit, OnDestroy {
    [x: string]: any
    dataSubject = new BehaviorSubject<any[]>([])
    mostrarBoton: boolean = false
    iEvaluacionId: number
    customers!: any
    visible: boolean = false
    opcion: string = 'seleccionar'
    isDialogVisible: boolean = false
    caption: any
    formCapas: any
    evaluacionFormGroup: FormGroup<any>
    tipoEvaluacion: any[]
    nivelEvaluacion: any[]
    acciones: any
    selectedRow: any[] = [] // Aquí se almacena la fila seleccionada
    selectedItemsAuto = []
    selectedItems = []
    cursosSeleccionados: any[] = []
    fechaHoraInicio: Date | undefined
    fechaHoraFin: Date | undefined
    cursoSeleccionado: Map<number, boolean> = new Map()
    iiEvaluacionId: number // El ID de evaluación que quieras usar
    nombreEvaluacion: string
    iPerfil: number
    item = []

    private _dialogService = inject(DialogService)
    private _apiEre = inject(ApiEvaluacionesRService)
    private _MessageService = inject(MessageService)
    private unsubscribe$: Subject<boolean> = new Subject()
    private _confirmService = inject(ConfirmationModalService) //intersector de eliminar
    private _generalService = inject(GeneralService)
    private _constantesService = inject(ConstantesService) // traer los idGlobales
    public cEvaluacionNombre: string
    public params = {
        iCompentenciaId: 0,
        iCapacidadId: 0,
        iDesempenioId: 0,
        bPreguntaEstado: -1,
    }
    public data = []
    public showModalCursosEre: boolean = false
    public showModalLiberarUgel: boolean = false
    form: FormGroup

    private _formBuilder = inject(FormBuilder) //form para obtener la variable
    public guardarIniFinCurso: FormGroup = this._formBuilder.group({})

    // Variable donde se almacenan las acciones filtradas
    // public accionesTabla: IActionTable[] = [];
    showActions: boolean = false //Habilitar botón para crear evaluaciones
    constructor(
        private router: Router,
        private compartirIdEvaluacionService: CompartirIdEvaluacionService,
        private compartirFormularioEvaluacionService: CompartirFormularioEvaluacionService,
        private fb: FormBuilder,
        private apiservice: ApiService,
        private utils: UtilService
    ) {
        this.form = this.fb.group({})
    }
    resetSelect: boolean = false
    searchTerm: string = ''
    filteredData: any[] = []

    // se inicializa..
    ngOnInit() {
        this.obtenerEvaluacion()
        this.obtenerPerfil()
        this.caption = 'Evaluaciones'
        this.dataSubject.subscribe((newData: any[]) => {
            this.data = newData
            console.log('mis eva', this.data)
            this.filteredData = this.data
        })
        this.cEvaluacionNombre =
            this.compartirFormularioEvaluacionService.getcEvaluacionNombre()
        // Establece el ID de la evaluación
        this.compartirFormularioEvaluacionService.setEvaluacionId(
            this.iiEvaluacionId
        )
        this.compartirFormularioEvaluacionService.setcEvaluacionNombre(
            this.cEvaluacionNombre
        )
        this.form.valueChanges.subscribe((value) => {
            value
        })
        this.showActions = this.iPerfilId !== ADMINISTRADOR_DREMO ? false : true
    }
    filterData() {
        if (!this.searchTerm) {
            this.filteredData = [...this.data] // Restablecer si el input está vacío
            return
        }

        const lowerCaseTerm = this.searchTerm.toLowerCase().trim()

        this.filteredData = this.data.filter((item) =>
            item.cEvaluacionNombre?.toLowerCase().includes(lowerCaseTerm)
        )
    }
    // obtener idPerfil
    iPerfilId: number

    obtenerPerfil() {
        this.iPerfilId = this._constantesService.iPerfilId
    }
    ejecutarAccion(event: { accion: string; item: IActionContainer }) {
        console.log('Acción seleccionada:', event.accion)
        if (event.accion === 'agregar') {
            // Lógica para agregar
        } else if (event.accion === 'descargar_pdf') {
            // Lógica para descargar PDF
        }
    }
    listaCursos: any[] = []
    lista: any
    objectKeys = Object.keys

    evaluacionCursos
    async obtenerCursos() {
        if (!this.iiEvaluacionId) {
            console.warn('El ID de evaluación no está definido.')
            return
        }

        const [evaluacionCursos] = await this.apiservice.getData({
            esquema: 'ere',
            tabla: 'V_EspecialistasEvaluacionesCursos',
            campos: '*',
            where: 'iEvaluacionId = ' + this.iiEvaluacionId,
        })

        // Verifica si la respuesta tiene la propiedad 'cursos_niveles'
        if (!evaluacionCursos || !evaluacionCursos.cursos_niveles) {
            console.error(
                'No se encontró la propiedad cursos_niveles en la respuesta'
            )
            return
        }

        this.evaluacionCursos = evaluacionCursos
        const agruparPorNivelYGrado = () => {
            const niveles = {}
            evaluacionCursos.cursos_niveles.forEach((data) => {
                const { iNivelTipoId, cNivelTipoNombre } = data
                const {
                    cGradoAbreviacion,
                    cCursoNombre,
                    dtExamenFechaInicio,
                    dtExamenFechaFin,
                    iCursoNivelGradId,
                    iExamCurId,
                } = data

                if (!niveles[iNivelTipoId]) {
                    niveles[iNivelTipoId] = {
                        iNivelTipoId,
                        cNivelTipoNombre,
                        grados: [],
                    }
                }

                let grado = niveles[iNivelTipoId].grados.find(
                    (g) => g.cGradoAbreviacion === cGradoAbreviacion
                )

                if (!grado) {
                    grado = { cGradoAbreviacion, cursos: [] }
                    niveles[iNivelTipoId].grados.push(grado)
                }

                grado.cursos.push({
                    iExamCurId,
                    iCursoNivelGradId,
                    cCursoNombre,
                    dtExamenFechaInicio,
                    dtExamenFechaFin,
                })
            })

            return Object.values(niveles)
        }
        const nivelesConGradosYCursos = agruparPorNivelYGrado()
        this.listaCursos = nivelesConGradosYCursos
        this.listaCursos.forEach((nivel) => {
            nivel.grados.forEach((grado) => {
                grado.cursos.forEach((curso) => {
                    this.form.addControl(
                        `${curso.cCursoNombre}${curso.iCursoNivelGradId}[${curso.iExamCurId}]Inicio`,
                        new FormControl(
                            curso.dtExamenFechaInicio
                                ? new Date(curso.dtExamenFechaInicio)
                                : null
                        )
                    )
                    this.form.addControl(
                        `${curso.cCursoNombre}${curso.iCursoNivelGradId}[${curso.iExamCurId}]Fin`,
                        new FormControl(
                            curso.dtExamenFechaFin
                                ? new Date(curso.dtExamenFechaFin)
                                : null
                        )
                    )
                })
            })
        })
    }
    //!New

    toggleCurso(curso: any): void {
        curso.isSelected = !curso.isSelected // Cambiar el estado seleccionado
    }
    async guardarInicioFinalExmAreas() {
        const coincidencias: IUpdateTableService[] = [] // Arreglo para almacenar coincidencias
        this.evaluacionCursos.cursos_niveles.forEach((data) => {
            const inicioKey = `${data.cCursoNombre}${data.iCursoNivelGradId}[${data.iExamCurId}]Inicio`
            const finKey = `${data.cCursoNombre}${data.iCursoNivelGradId}[${data.iExamCurId}]Fin`

            // Obtén los valores de inicio y fin del formulario
            const inicioValue = this.form.value[inicioKey]
            const finValue = this.form.value[finKey]
            if (inicioValue || finValue) {
                coincidencias.push({
                    esquema: 'ere',
                    tabla: 'examen_cursos',
                    campos: {
                        iExamCurId: data.iExamCurId,
                        dtExamenFechaInicio:
                            this.utils.convertToSQLDateTime(inicioValue) ||
                            null, // Asigna el valor o null si no existe
                        dtExamenFechaFin:
                            this.utils.convertToSQLDateTime(finValue) || null, // Asigna el valor o null si no existe
                    },
                    where: {
                        COLUMN_NAME: 'iExamCurId',
                        VALUE: data.iExamCurId,
                    },
                })
            }
        })
        // Envía los datos al servicio para actualizar en la base de datos
        await this.apiservice.updateData(coincidencias)

        this.visible = false
        this.showModalCursosEre = false
        this.form.reset()
        this.removeControls()
    }
    toggleBotonc(): void {
        this.mostrarBoton = !this.mostrarBoton
    }
    generarAccines(): boolean {
        return this.iPerfilId !== DIRECTOR_IE
    }
    // el buton select
    accionesPrincipal: MenuItem[] = [
        {
            items: [
                {
                    label: 'Crear evaluación',
                    icon: 'pi pi-plus',
                    accion: 'seleccionar',
                    visible: this.generarAccines(),
                },
            ],
        },
    ]
    opcionesAuto: IActionTable[] = []
    // nombre de las columnas de listar evaluaciones
    columnasBase: IColumn[] = [
        {
            type: 'item',
            width: '0.5rem',
            field: 'index',
            header: '#',
            text_header: 'center',
            text: 'center',
        },
        {
            field: 'cEvaluacionNombre',
            header: 'Nombre evaluación',
            type: 'text',
            width: '7rem',
            text: 'left',
            text_header: 'Clave',
        },
        {
            field: 'cTipoEvalDescripcion',
            header: 'Tipo evaluación',
            type: 'text',
            width: '1rem',
            text: 'left',
            text_header: 'Tipo evaluación',
        },
        {
            field: 'cNivelEvalNombre',
            header: 'Nivel evaluación',
            type: 'text',
            width: '3rem',
            text: 'left',
            text_header: 'Puntaje',
        },
        {
            field: 'dtEvaluacionFechaInicio',
            header: 'Fecha Inicio',
            type: 'text',
            width: '4rem',
            text: 'left',
            text_header: 'Nivel',
        },
        {
            field: 'dtEvaluacionFechaFin',
            header: 'Fecha Fin',
            type: 'text',
            width: '3rem',
            text: 'left',
            text_header: 'Nivel',
        },
    ]
    //COPIANDO COLUMNA PARA MODAL
    columnas: IColumn[] = [
        ...this.columnasBase,
        {
            field: '',
            header: 'Acciones',
            type: 'actions',
            width: '5rem',
            text: 'left',
            text_header: '',
        },
    ]
    columnasAuto: IColumn[] = [
        {
            type: 'radio-action',
            width: '3rem',
            field: 'iConfigId',
            header: 'Seleccionar',
            text_header: 'center',
            text: 'center',
        },
        ...this.columnasBase,
    ] // Perfil del usuario

    // Acciones del listar evaluaciones creadas
    public accionesTabla: IActionTable[] = [
        {
            labelTooltip: 'Ver',
            icon: 'pi pi-eye',
            accion: 'ver',
            type: 'item',
            class: 'p-button-rounded p-button-primary p-button-text',
        },
        {
            labelTooltip: 'Editar',
            icon: 'pi pi-pencil',
            accion: 'editar',
            type: 'item',
            class: 'p-button-rounded p-button-warning p-button-text',
            isVisible: () => this.iPerfilId === ADMINISTRADOR_DREMO,
        },
        {
            labelTooltip: 'Eliminar',
            icon: 'pi pi-trash',
            accion: 'eliminar',
            type: 'item',
            class: 'p-button-rounded p-button-danger p-button-text',
            isVisible: () => this.iPerfilId === ADMINISTRADOR_DREMO,
        },
        {
            labelTooltip: 'Gestionar Preguntas',
            icon: 'pi pi-list-check',
            accion: 'gestionarPreguntas',
            type: 'item',
            class: 'p-button-rounded p-button-help p-button-text',
            isVisible: () =>
                this.iPerfilId === ESPECIALISTA_DREMO ||
                this.iPerfilId === ADMINISTRADOR_DREMO,
        },
        {
            labelTooltip: 'Asignar horario de publicación',
            icon: 'pi pi-clock',
            accion: 'fechaPublicacion',
            type: 'item',
            class: 'p-button-rounded p-button-secondary p-button-text',
            isVisible: () => this.iPerfilId === DIRECTOR_IE,
        },
        {
            labelTooltip: 'Liberar Evaluación',
            icon: 'pi pi-verified',
            accion: 'liberarUgelEvaluacion',
            type: 'item',
            class: 'p-button-rounded p-button-success p-button-text',
            isVisible: () => this.iPerfilId === ESPECIALISTA_UGEL,
        },
        {
            labelTooltip: 'Resultados',
            icon: 'pi pi-chart-bar',
            accion: 'resultados',
            type: 'item',
            class: 'p-button-rounded p-button-info p-button-text',
        },
    ]
    // ].filter(accion => accion.visible !== false);
    onRowSelect(event: any) {
        this.selectedRow = [event]
        //this.selectedRowData.emit(this.selectedRow) // Emite los datos al componente padre
    }
    closeDialog(evaluacion: any) {
        // Aquí va la lógica para finalizar el formulario
        this.visible = false
        // Llamar a actualizarDatos automáticamente al cerrar
        this.actualizarDatos(evaluacion)
    }
    showDialog() {
        this.visible = true
    }
    //No es la ventana modal
    agregarEvaluacion() {
        this._dialogService.open(EvaluacionesFormComponent, {
            ...MODAL_CONFIG,
            header: 'Nueva evaluación',
        })
    }

    /**
     * Actualiza los datos de una evaluación específica obteniéndolos del servidor.
     *
     * @param evaluacion Objeto que contiene información de la evaluación, incluyendo `iEvaluacionId`,
     *                   que es el identificador único de la evaluación.
     *
     * Ejemplo del objeto `evaluacion` esperado:
     * ```json
     * {
     *   "iEvaluacionId": 123
     * }
     * ```
     */
    actualizarDatos(evaluacion: any) {
        const params = { id: evaluacion.iEvaluacionId }
        this._apiEre
            .obtenerEvaluacion(params)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (resp: any) => {
                    if (resp.status === 'Success') {
                        // Verificar que el status sea 'Success'
                        this._MessageService.add({
                            severity: 'success',
                            summary: 'Actualización exitosa',
                            detail: 'La evaluación se actualizó correctamente.',
                        })
                        this.dataSubject.next(resp.data) // Emitir los nuevos datos al dataSubject
                    } else {
                        this._MessageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Hubo un error al actualizar la evaluación.',
                        })
                    }
                },
                error: (error) => {
                    this._MessageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error al conectar con el servidor.',
                    })
                    console.error('Error al actualizar la evaluación:', error)
                },
            })
    }

    // asignar
    accionBtnItemTable({ accion, item }) {
        switch (accion) {
            case 'seleccionar':
                this.selectedItems = []
                this.selectedItems = [item]
                break
            case 'editar':
                this.agregarEditarPregunta(item)
                break
            case 'ver':
                this.verEreEvaluacion(item)
                break
            case 'agregar':
                this.opcion = 'seleccionar'
                this.caption = 'Seleccionar configuración'
                this.visible = true
                break
            case 'actualizar':
                this.actualizarDatos(item)
                break
            case 'eliminar':
                this._confirmService.openConfirm({
                    header:
                        '¿Esta seguro de eliminar la Evaluación: ' +
                        item['cEvaluacionNombre'] +
                        ' ?',
                    accept: () => {
                        this.eliminarEvaluacionXId(item)
                    },
                })
                break
            case 'gestionarPreguntas':
                this.compartirFormularioEvaluacionService.setcEvaluacionNombre(
                    item.cEvaluacionNombre
                )
                this.router.navigate([
                    'ere/evaluaciones/' +
                        item.iEvaluacionIdxHash +
                        '/gestionar-preguntas',
                ])
                break
            case 'fechaPublicacion':
                this.modalActivarCursosEre()
                this.onEvaluacionSeleccionada({
                    value: item.iEvaluacionId,
                    value1: item.cEvaluacionNombre,
                })
                this.cEvaluacionNombre = item.cEvaluacionNombre
                break
            case 'resultados':
                alert('En proceso de desarrollo')
                break
            case 'liberarUgelEvaluacion':
                if (!(this.iPerfilId === ESPECIALISTA_UGEL)) {
                    return
                }
                this.showModalLiberarUgel = true
                this.item = item

                break
            case 'close-modal-liberar-ugel-evaluacion':
                this.showModalLiberarUgel = false
                break
        }
    }
    eliminarEvaluacionXId(item) {
        const params = {
            petition: 'post',
            group: 'ere',
            prefix: 'evaluacion',
            ruta: 'handleCrudOperation',
            data: {
                opcion: 'ELIMINARxiEvaluacionId',
                valorBusqueda: null,
                iEvaluacionId: item.iEvaluacionId,
            },
        }
        console.log('datos para eliminar', params)
        this._generalService.getGralPrefix(params).subscribe({
            next: (resp) => {
                if (resp.validated) {
                    this.obtenerEvaluacion()
                }
            },
        })
    }
    onEvaluacionSeleccionada(event: any) {
        // console.log('Evento recibido:', event); // Verifica qué valores llegan
        // Asigna dinámicamente el valor seleccionado
        this.iiEvaluacionId = event.value

        // Establece el ID de la evaluación en el servicio
        this.compartirFormularioEvaluacionService.setEvaluacionId(
            this.iiEvaluacionId
        )
        this.nombreEvaluacion = event.value1
        this.compartirFormularioEvaluacionService.setcEvaluacionNombre(
            this.nombreEvaluacion
        )
        // Llamar al servicio para obtener los cursos seleccionados
        this.obtenerCursos()
    }
    verEreEvaluacion(evaluacion) {
        // Obtener el nombre de la evaluación
        const nombreEvaluacion =
            evaluacion?.cEvaluacionNombre ||
            this.compartirFormularioEvaluacionService.getcEvaluacionNombre() ||
            'Sin Nombre'

        // Construir el header dinámico
        const header = `Ver evaluación: ${nombreEvaluacion}`

        // Abrir el modal con el header dinámico
        const refModal = this._dialogService.open(EvaluacionesFormComponent, {
            ...MODAL_CONFIG,
            maximizable: true,
            data: {
                accion: 'ver', // Acción específica para ver
                evaluacion: evaluacion, // Datos de la evaluación
            },
            header: header, // Header dinámico con el nombre de la evaluación
        })

        // Manejar el cierre del modal
        refModal.onClose.subscribe((result) => {
            console.log(result)
        })
    }
    obtenerEvaluacion() {
        // Realizar la solicitud a la API con los parámetros actuales
        this._apiEre
            .obtenerEvaluacion(this.params)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (resp: unknown) => {
                    // Acceder y mostrar el contenido específico de la respuesta
                    if (resp && resp['data']) {
                        this.data = resp['data'] // Asignar la data obtenida
                        this.filteredData = this.data
                        console.log('evaluaciones', this.filteredData)
                    } else {
                        console.warn(
                            'La respuesta no contiene la propiedad "data" o es nula:',
                            resp
                        )
                    }
                },
                error: (err) => {
                    // Manejo de errores
                    console.error('Error en obtenerEvaluacion:', err)
                },
                complete: () => {
                    console.log('La función obtenerEvaluacion() ha finalizado.')
                },
            })
    }
    agregarEditarPregunta(evaluacion) {
        // Determina si la acción es 'nuevo' o 'editar'
        const accion = evaluacion?.iEvaluacionId ? 'editar' : 'nuevo'

        // Obtener el nombre de la evaluación
        let nombreEvaluacion: string

        if (accion === 'nuevo') {
            // Sobrescribir explícitamente el nombre de la evaluación
            nombreEvaluacion = '' //Manda el nombre

            // Verificamos si el servicio devuelve un valor válido
            if (!nombreEvaluacion || nombreEvaluacion.trim() === '') {
                // Si no existe un valor válido, asignamos un valor por defecto
                nombreEvaluacion = '' //Manda el nombre
            }
        } else {
            // Para el caso 'editar', obtenemos el nombre desde el objeto de evaluación
            nombreEvaluacion =
                evaluacion?.cEvaluacionNombre || 'Editar Evaluación'
        }

        // Construir el header dinámico
        const header =
            accion === 'nuevo'
                ? `Nueva evaluación: ${nombreEvaluacion}`
                : `Editar evaluación: ${nombreEvaluacion}`

        // Abre el modal con el header dinámico y los datos correspondientes
        const refModal = this._dialogService.open(EvaluacionesFormComponent, {
            ...MODAL_CONFIG,
            maximizable: true,
            data: {
                accion: accion, // Acción (nuevo o editar)
                evaluacion: evaluacion, // Datos de la evaluación a editar (si existe)
            },
            header: header, // Aquí asignamos el header dinámico
        })
        // Suscribirse al cierre del modal para actualizar las evaluaciones
        refModal.onClose.subscribe((result) => {
            console.log(result)
            this.opcion = null
            // if (result) {
            this.resetSelect = true
            this.obtenerEvaluacion() // Actualizar la lista de evaluaciones después de cerrar el modal
            // }
        })
    }

    // manejar las acciones
    accionBtnItem(elemento) {
        const { accion } = elemento
        switch (accion) {
            case 'agregar':
                this.agregarEditarPregunta({
                    iEvaluacionId: 0,
                })
                this.opcion = 'seleccionar'
                break
            case 'auto':
                this.opcion = 'auto'
                break
            case 'manual':
                this.opcion = 'manual'
                this.caption = 'Registrar'

                break
            // formulario de crear evaluación ERE
            case 'seleccionar':
                this.visible = false
                this.opcion = 'formularioEvaluacion'
                this.formCapas = 'formularioEvaluacion'
                this.isDialogVisible = true
                this.resetSelect = false

                this.agregarEditarPregunta({ iEvaluacionId: null })
                break
        }
    }
    modalActivarCursosEre() {
        this.showModalCursosEre = true
    }

    removeControls() {
        Object.keys(this.form.controls).forEach((controlName) => {
            this.form.removeControl(controlName)
        })
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next(true)
        this.unsubscribe$.complete()
    }
}
