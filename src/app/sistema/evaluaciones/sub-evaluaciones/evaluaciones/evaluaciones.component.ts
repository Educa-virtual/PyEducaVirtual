import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    inject,
    Input,
    OnInit,
    Output,
} from '@angular/core'

/*GRILLA */

import { TableModule } from 'primeng/table'
import { CommonModule } from '@angular/common'

/*BOTONES */
import { ButtonModule } from 'primeng/button'

/*MODAL */
import { DialogModule } from 'primeng/dialog'

/*INPUT TEXT */
import { InputTextModule } from 'primeng/inputtext'

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

import {
    ContainerPageComponent,
    IActionContainer,
} from '@/app/shared/container-page/container-page.component'
import { CompartirIdEvaluacionService } from './../../services/ereEvaluaciones/compartir-id-evaluacion.service'
import { PrimengModule } from '@/app/primeng.module'

import { MessageService } from 'primeng/api'
import { Router } from '@angular/router'
//Calendario
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
} from '@angular/forms'
@Component({
    selector: 'app-evaluaciones',
    standalone: true,
    imports: [
        TableModule,
        CommonModule,
        ButtonModule,
        DialogModule,
        InputTextModule,
        ReactiveFormsModule,

        TablePrimengComponent,
        ContainerPageComponent,
        PrimengModule,
    ],
    providers: [DialogService],
    templateUrl: './evaluaciones.component.html',
    styleUrl: './evaluaciones.component.scss',
})
export class EvaluacionesComponent implements OnInit {
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
    @Output() opcionChange = new EventEmitter<string>()
    @Input() dataRow: any[] = [] // Los datos que recibe la tabla
    @Input() columnasRow: any[] = [] // Las columnas que muestra la tabla

    private _dialogService = inject(DialogService)
    private _apiEre = inject(ApiEvaluacionesRService)
    private _MessageService = inject(MessageService)
    private unsubscribe$: Subject<boolean> = new Subject()
    public cEvaluacionNombre: string
    public params = {
        iCompentenciaId: 0,
        iCapacidadId: 0,
        iDesempenioId: 0,
        bPreguntaEstado: -1,
    }
    public data = []
    public showModalCursosEre: boolean = false
    form: FormGroup

    constructor(
        private router: Router,
        private compartirIdEvaluacionService: CompartirIdEvaluacionService,
        private compartirFormularioEvaluacionService: CompartirFormularioEvaluacionService,
        private messageService: MessageService,
        private cdr: ChangeDetectorRef,
        private fb: FormBuilder
    ) {
        this.form = this.fb.group({})
    }

    cursoSeleccionado: Map<number, boolean> = new Map()
    iiEvaluacionId: number // El ID de evaluación que quieras usar
    ngOnInit() {
        this.obtenerEvaluacion()

        this.caption = 'Evaluaciones'
        this.dataSubject.subscribe((newData: any[]) => {
            this.data = newData
        })
        this.cEvaluacionNombre =
            this.compartirFormularioEvaluacionService.getcEvaluacionNombre()

        // Establece el ID de la evaluación
        this.compartirFormularioEvaluacionService.setEvaluacionId(
            this.iiEvaluacionId
        )

        this.form.valueChanges.subscribe((value) => {
            console.log('Form value changes', value)
        })
    }
    listaCursos: any[] = []
    lista: any
    objectKeys = Object.keys
    // Método para obtener los cursos seleccionados
    // obtenerCursos(): void {
    //     if (!this.iiEvaluacionId) {
    //         console.warn('El ID de evaluación no está definido.')
    //         return
    //     }
    //     // Llamar a searchAmbienteAcademico para obtener los datos estructurados
    //     this.compartirFormularioEvaluacionService
    //         .searchAmbienteAcademico()
    //         .then((lista: any[]) => {
    //             // Almacenar la lista en la propiedad `this.lista`
    //             this.lista = lista
    //             // Obtener los cursos seleccionados y combinarlos
    //             return this.compartirFormularioEvaluacionService.obtenerCursosSeleccionados()
    //         })
    //         .then((cursosSeleccionadosMap: Map<number, boolean>) => {
    //             // Filtrar solo los cursos seleccionados
    //             this.listaCursos = this.lista
    //                 .map((nivel: any) => ({
    //                     nivel: nivel.nivel,
    //                     grados: Object.keys(nivel.grados)
    //                         .map((grado) => ({
    //                             grado,
    //                             cursos: nivel.grados[grado].filter(
    //                                 (curso: any) =>
    //                                     cursosSeleccionadosMap.get(
    //                                         curso.iCursoNivelGradId
    //                                     ) || false // Filtrar solo los seleccionados
    //                             ),
    //                         }))
    //                         .filter((grado: any) => grado.cursos.length > 0), // Filtrar grados sin cursos
    //                 }))
    //                 .filter(
    //                     (nivel: any) => nivel.grados.length > 0 // Filtrar niveles sin grados seleccionados
    //                 )
    //             console.log(
    //                 'Lista de cursos seleccionados y estructurados:',
    //                 this.listaCursos
    //             )
    //         })
    //         .catch((error) => {
    //             console.error('Error al obtener los cursos:', error)
    //         })
    // }
    obtenerCursos(): void {
        if (!this.iiEvaluacionId) {
            console.warn('El ID de evaluación no está definido.')
            return
        }

        // Llamar a searchAmbienteAcademico para obtener los datos estructurados
        this.compartirFormularioEvaluacionService
            .searchAmbienteAcademico()
            .then((lista: any[]) => {
                // Almacenar la lista en la propiedad `this.lista`
                this.lista = lista

                // Obtener los cursos seleccionados y combinarlos
                return this.compartirFormularioEvaluacionService.obtenerCursosSeleccionados()
            })
            .then((cursosSeleccionadosMap: Map<number, boolean>) => {
                // Estructurar la lista de cursos, eliminando los cursos no seleccionados
                this.listaCursos = this.lista
                    .map((nivel: any) => ({
                        nivel: nivel.nivel,
                        grados: Object.keys(nivel.grados)
                            .map((grado) => ({
                                grado,
                                cursos: nivel.grados[grado].filter(
                                    (curso: any) =>
                                        cursosSeleccionadosMap.get(
                                            curso.iCursoNivelGradId
                                        ) || false
                                ), // Solo seleccionados
                            }))
                            .filter((grado: any) => grado.cursos.length > 0), // Filtrar grados sin cursos seleccionados
                    }))
                    .filter((nivel: any) => nivel.grados.length > 0) // Filtrar niveles sin grados seleccionados

                console.log(
                    'Lista de cursos seleccionados y estructurados:',
                    this.listaCursos
                )

                this.listaCursos.forEach((nivel) => {
                    nivel.grados.forEach((grado) => {
                        grado.cursos.forEach((curso) => {
                            this.form.addControl(
                                `${curso.cCursoNombre}${curso.iCursoNivelGradId}Inicio`,
                                new FormControl()
                            )
                            this.form.addControl(
                                `${curso.cCursoNombre}${curso.iCursoNivelGradId}Fin`,
                                new FormControl()
                            )
                        })
                    })
                })

                console.log('Form', this.form)
            })
            .catch((error) => {
                console.error('Error al obtener los cursos:', error)
            })

        // this.form.addControl('cursosSeleccionados', this.fb.array([]))
    }

    toggleCurso(curso: any): void {
        curso.isSelected = !curso.isSelected // Cambiar el estado seleccionado
        console.log('Estado actualizado del curso:', curso)
    }
    toggleBotonc(): void {
        this.mostrarBoton = !this.mostrarBoton
    }
    accionesPrincipal: IActionContainer[] = [
        {
            labelTooltip: 'Agregar evaluacións',
            text: 'Agregar Evaluación',
            icon: 'pi pi-plus',
            accion: 'seleccionar',
            class: 'p-button-lg',
        },
    ]
    opcionesAuto: IActionTable[] = []
    columnasBase: IColumn[] = [
        {
            field: 'cTipoEvalDescripcion',
            header: 'Tipo evaluación',
            type: 'text',
            width: '5rem',
            text: 'left',
            text_header: 'Tipo evaluación',
        },
        {
            field: 'cNivelEvalNombre',
            header: 'Nivel evaluación',
            type: 'text',
            width: '5rem',
            text: 'left',
            text_header: 'Puntaje',
        },
        {
            field: 'dtEvaluacionCreacion',
            header: 'Fecha creación',
            type: 'text',
            width: '5rem',
            text: 'left',
            text_header: 'Nivel',
        },
        {
            field: 'cEvaluacionNombre',
            header: 'Nombre evaluación',
            type: 'text',
            width: '5rem',
            text: 'left',
            text_header: 'Clave',
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
    ]

    public accionesTabla: IActionTable[] = [
        {
            labelTooltip: 'Ver',
            icon: 'pi pi-eye',
            accion: 'ver',
            type: 'item',
            class: 'p-button-rounded p-button-warning p-button-text',
        },
        {
            labelTooltip: 'Editar',
            icon: 'pi pi-pencil',
            accion: 'editar',
            type: 'item',
            class: 'p-button-rounded p-button-warning p-button-text',
        },
        {
            labelTooltip: 'Banco Preguntas',
            icon: 'pi pi-cog',
            accion: 'BancoPreguntas',
            type: 'item',
            class: 'p-button-rounded p-button-warning p-button-text',
        },
        {
            labelTooltip: 'Asignar Fecha de publicacion',
            icon: 'pi pi-cog',
            accion: 'fechaPublicacion',
            type: 'item',
            class: 'p-button-rounded p-button-warning p-button-text',
        },
    ]

    //!AQUI CAMBIE MOSTRAR ROW

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
    click() {}
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
        if (accion === 'seleccionar') {
            this.selectedItems = []
            this.selectedItems = [item]
        }
        if (accion === 'editar') {
            this.agregarEditarPregunta(item)
        }

        if (accion === 'ver') {
            this.compartirIdEvaluacionService.iEvaluacionId = item.iEvaluacionId
            this.verEreEvaluacion(item)
        }
        if (accion === 'agregar') {
            this.opcion = 'seleccionar'
            this.caption = 'Seleccionar configuración'
            this.visible = true
        }
        if (accion === 'actualizar') {
            this.actualizarDatos(item)
        }
        if (accion === 'BancoPreguntas') {
            this.compartirFormularioEvaluacionService.setcEvaluacionNombre(
                item.cEvaluacionNombre
            )
            this.compartirIdEvaluacionService.iEvaluacionId = item.iEvaluacionId
            this.router.navigate(['/evaluaciones/areas'])
        }
        if (accion === 'fechaPublicacion') {
            this.modalActivarCursosEre()
            this.onEvaluacionSeleccionada({ value: item.iEvaluacionId })
        }
    }
    onEvaluacionSeleccionada(event: any) {
        // Asigna dinámicamente el valor seleccionado
        this.iiEvaluacionId = event.value
        console.log('Evaluación seleccionada:', this.iiEvaluacionId)

        // Establece el ID de la evaluación en el servicio
        this.compartirFormularioEvaluacionService.setEvaluacionId(
            this.iiEvaluacionId
        )

        // Mostrar el ID en consola para verificar
        console.warn('ID de Evaluación establecido:', this.iiEvaluacionId)

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
            data: {
                accion: 'ver', // Acción específica para ver
                evaluacion: evaluacion, // Datos de la evaluación
            },
            header: header, // Header dinámico con el nombre de la evaluación
        })

        // Manejar el cierre del modal
        refModal.onClose.subscribe((result) => {
            if (result) {
                this.obtenerEvaluacion() // Vuelve a obtener la lista de evaluaciones si hubo cambios
            }
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
            data: {
                accion: accion, // Acción (nuevo o editar)
                evaluacion: evaluacion, // Datos de la evaluación a editar (si existe)
            },
            header: header, // Aquí asignamos el header dinámico
        })

        // Imprimir el modal ref para ver cómo se abre
        console.log('MODAL DE AGREGAR EDITAR PREGUNTA', refModal)

        // Suscribirse al cierre del modal para actualizar las evaluaciones
        refModal.onClose.subscribe((result) => {
            if (result) {
                this.obtenerEvaluacion() // Actualizar la lista de evaluaciones después de cerrar el modal
            }
        })
    }

    accionbtn(accion) {
        switch (accion) {
            case 'manual':
                this.opcion = 'manual'
                this.caption = 'Nueva Evaluacion'
                this.acciones = 'manual'
                break
            case 'auto':
                this.opcion = 'auto'
                this.caption = 'Recuperar Evaluacion'
                this.acciones = 'auto'
                break
        }
    }

    //CREANDO COPIA DE EVALUACION
    copiarEvaluacion(iEvaluacionId: number): Promise<any[]> {
        return new Promise((resolve, reject) => {
            //this.copiarEvaluacion(iEvaluacionId)
            this._apiEre
                .copiarEvaluacion(iEvaluacionId)
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe({
                    next: (resp: any) => {
                        this._MessageService.add({
                            severity: 'success',
                            summary: 'Éxito',
                            detail: resp.message,
                        })

                        resolve(resp)
                        console.log('Copiar Evaluacion exitosa:', resp)
                    },
                    error: (error) => {
                        console.error('Error al Copiar Evaluacion:', error)
                        this._MessageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Error al copiar la Evaluacion',
                        })
                        reject(error)
                    },
                })
        })
    }
    // manejar las acciones
    accionBtnItem(elemento) {
        const { accion } = elemento

        switch (accion) {
            case 'seleccionar':
                this.visible = true
                this.opcion = 'seleccionar'
                break
            case 'agregar':
                this.agregarEditarPregunta({
                    iEvaluacionId: 0,
                })
                this.opcion = 'seleccionar'
                break
            case 'copiarEvaluacion':
                this.copiarEvaluacion(this.selectedRow[0].iEvaluacionId).then(
                    (resp) => {
                        console.log('Copiar evaluacion', resp)
                        this.closeDialog(resp)
                    }
                )
                break
            case 'auto':
                this.opcion = 'auto'
                break
            case 'manual':
                this.opcion = 'manual'
                this.caption = 'Registrar'

                break
            case 'formularioEvaluacion':
                this.visible = false
                this.opcion = 'formularioEvaluacion'
                this.formCapas = 'formularioEvaluacion'
                this.isDialogVisible = true

                this.agregarEditarPregunta({ iEvaluacionId: null })
                break
        }
    }
    modalActivarCursosEre() {
        this.showModalCursosEre = true
    }
    ngOnDestroy(): void {
        this.unsubscribe$.next(true)
        this.unsubscribe$.complete()
    }
}
