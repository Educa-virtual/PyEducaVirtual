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
import { CommonInputComponent } from '../../../../shared/components/common-input/common-input.component'
import { IeparticipaComponent } from './ieparticipa/ieparticipa.component'
import { EvaluacionAreasComponent } from './evaluacion-areas/evaluacion-areas.component'
import { FormGroup } from '@angular/forms'
import { MessageService } from 'primeng/api'

//import { Checkbox } from 'primeng/checkbox'
//import { I } from '@fullcalendar/core/internal-common'
@Component({
    selector: 'app-evaluaciones',
    standalone: true,
    imports: [
        TableModule,
        CommonModule,
        ButtonModule,
        DialogModule,
        InputTextModule,
        TablePrimengComponent,
        ContainerPageComponent,
        PrimengModule,
        CommonInputComponent,
        IeparticipaComponent,
        EvaluacionAreasComponent,
    ],
    providers: [DialogService],
    templateUrl: './evaluaciones.component.html',
    styleUrl: './evaluaciones.component.scss',
})
export class EvaluacionesComponent implements OnInit {
    isDialogVisible: boolean = false

    private unsubscribe$: Subject<boolean> = new Subject()
    public params = {
        iCompentenciaId: 0,
        iCapacidadId: 0,
        iDesempenioId: 0,
        bPreguntaEstado: -1,
    }

    public data = []
    private _dialogService = inject(DialogService)
    private _apiEre = inject(ApiEvaluacionesRService)
    private _MessageService = inject(MessageService)
    customers!: any
    visible: boolean = false
    opcion: string = 'seleccionar'
    @Output() opcionChange = new EventEmitter<string>()

    // Variable para manejar datos reactivos
    dataSubject = new BehaviorSubject<any[]>([]) // Reactivo para actualizar la tabla automáticamente

    accionesPrincipal: IActionContainer[] = [
        {
            labelTooltip: 'Agregar evaluación',
            text: 'Agregar Evaluación',
            icon: 'pi pi-plus',
            accion: 'seleccionar',
            class: 'p-button-lg',
        },
    ]
    opcionesAuto: IActionTable[] = []
    // Aqui va la columas con anterioridad
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
    selectedItemsAuto = []
    selectedItems = []
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
    ]
    caption: any
    formCapas: any
    evaluacionFormGroup: FormGroup<any>
    tipoEvaluacion: any[]
    nivelEvaluacion: any[]
    acciones: any

    //!AQUI CAMBIE MOSTRAR ROW
    @Input() dataRow: any[] = [] // Los datos que recibe la tabla
    @Input() columnasRow: any[] = [] // Las columnas que muestra la tabla
    selectedRow: any[] = [] // Aquí se almacena la fila seleccionada
    onRowSelect(event: any) {
        console.log('Datos de la fila seleccionada:', 'event', event) // Verifica los datos seleccionados
        this.selectedRow = [event]
        //this.selectedRowData.emit(this.selectedRow) // Emite los datos al componente padre
    }
    //!AQUI TERMINO
    constructor(
        // private customerService: CustomerService,
        private compartirIdEvaluacionService: CompartirIdEvaluacionService,
        private messageService: MessageService,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.obtenerEvaluacion()
        this.caption = 'Evaluaciones'
        this.dataSubject.subscribe((newData: any[]) => {
            this.data = newData // Actualizar los datos en el componente
        })
    }
    closeDialog() {
        // Aquí va la lógica para finalizar el formulario
        this.visible = false
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

    //!
    // Método para actualizar los datos
    actualizarDatos(evaluacion: any) {
        const params = { id: evaluacion.iEvaluacionId }

        this._apiEre
            .obtenerEvaluacion(params)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (resp: any) => {
                    console.log('Respuesta de la actualización:', resp) // Para depuración
                    if (resp.status === 'Success') {
                        // Verificar que el status sea 'Success'
                        this._MessageService.add({
                            severity: 'success',
                            summary: 'Actualización exitosa',
                            detail: 'La evaluación se actualizó correctamente.',
                        })
                        this.dataSubject.next(resp.data) // Emitir los nuevos datos al dataSubject
                        console.log('Datos actualizados:', resp.data) // Para depuración
                    } else {
                        console.log('Error en la respuesta:', resp) // Para depuración
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
    obtenerEvaluacion() {
        this._apiEre
            .obtenerEvaluacion(this.params)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (resp: unknown) => {
                    this.data = resp['data']
                },
            })
    }

    // asignar
    accionBtnItemTable({ accion, item }) {
        if (accion === 'seleccionar') {
            this.selectedItems = []
            this.selectedItems = [item]
            // this.asignarPreguntas()
        }
        if (accion === 'editar') {
            console.log('AQUI ESTA EL EDITAR', accion)
            this.agregarEditarPregunta(item)
        }

        if (accion === 'ver') {
            /// alert(item.iEvaluacionId)
            //console.log('Aqui: ' + item.iEvaluacionId)
            this.compartirIdEvaluacionService.iEvaluacionId = item.iEvaluacionId
            //alert(this.compartirIdEvaluacionService.iEvaluacionId)
            this.verEreEvaluacion(item)
            // this.eliminarPregunta(item)
        }
        if (accion === 'agregar') {
            // this.selectedItems = []
            // this.selectedItems = [item]
            this.opcion = 'seleccionar'

            this.caption = 'Seleccionar configuración'
            this.visible = true
            // this.asignarPreguntas()
        }
        if (accion === 'actualizar') {
            // Aquí se puede invocar el método de actualización de los datos
            this.actualizarDatos(item)
        }
    }
    verEreEvaluacion(evaluacion) {
        //alert('iEvaluacionId' + evaluacion.iEvaluacionId)
        const refModal = this._dialogService.open(EvaluacionesFormComponent, {
            ...MODAL_CONFIG,
            data: {
                accion: 'ver',
                evaluacion: evaluacion,
            },
            header: 'Ver evaluacion',
        })

        refModal.onClose.subscribe((result) => {
            if (result) {
                this.obtenerEvaluacion() // Vuelve a obtener la evaluación si se realizó algún cambio
            }
        })
    }

    // abrir el modal para agregar una nueva pregunta
    agregarEditarPregunta(evaluacion) {
        const accion = evaluacion?.iEvaluacionId ? 'editar' : 'nuevo'
        const header =
            accion === 'nuevo' ? 'Nueva evaluación' : 'Editar evaluación'

        const refModal = this._dialogService.open(EvaluacionesFormComponent, {
            ...MODAL_CONFIG,
            data: {
                accion: accion,
                evaluacion: evaluacion,
            },
            header: header,
        })

        refModal.onClose.subscribe((result) => {
            if (result) {
                this.obtenerEvaluacion()
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

    //!CREANDO COPIA DE EVALUACION
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
                        this.closeDialog()
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
            case 'sel-manual':
                break
            case 'capa1':
                this.visible = false
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
}
