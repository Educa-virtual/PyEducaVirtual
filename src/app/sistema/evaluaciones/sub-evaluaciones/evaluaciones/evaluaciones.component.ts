import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core'

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
import { Subject, takeUntil } from 'rxjs'

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
    customers!: any
    visible: boolean = false
    opcion: string = 'seleccionar'
    @Output() opcionChange = new EventEmitter<string>()

    accionesPrincipal: IActionContainer[] = [
        {
            labelTooltip: 'Agregar evaluación',
            text: 'Agregar Evaluación',
            icon: 'pi pi-plus',
            accion: 'seleccionar',
            class: 'p-button-secondary',
        },
        // {
        //     labelTooltip: 'Agregar evaluación',
        //     text: 'Agregar Evaluación',
        //     icon: 'pi pi-plus',
        //     accion: 'agregar',
        //     class: 'p-button-secondary',
        // },
    ]
    opcionesAuto: IActionTable[] = []
    // Aqui va la columas con anterioridad
    columnasBase: IColumn[] = [
        // {
        //     field: 'iEvaluacionId',
        //     header: 'ID',
        //     type: 'text',
        //     width: '5rem',
        //     text: 'left',
        //     text_header: 'Pregunta',
        // },
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
        // {
        //     field: '',
        //     header: 'Acciones',
        //     type: 'actions',
        //     width: '5rem',
        //     text: 'left',
        //     text_header: '',
        // },
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

            // field: '',
            // header: 'Acciones',
            // type: 'actions',
            // width: '5rem',
            // text: 'left',
            // text_header: '',
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
        // {
        //     labelTooltip: 'Eliminar',
        //     icon: 'pi pi-trash',
        //     accion: 'editar',
        //     type: 'item',
        //     class: 'p-button-rounded p-button-danger p-button-text',
        // },
    ]
    caption: any
    formCapas: any
    evaluacionFormGroup: FormGroup<any>
    tipoEvaluacion: any[]
    nivelEvaluacion: any[]
    acciones: any

    constructor(
        // private customerService: CustomerService,
        private compartirIdEvaluacionService: CompartirIdEvaluacionService
    ) {}

    ngOnInit() {
        this.obtenerEvaluacion()
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
            /* templates: {
                footer: BotonosModalFormComponent,
            },*/
        })
    }

    obtenerEvaluacion() {
        this._apiEre
            .obtenerEvaluacion(this.params)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (resp: unknown) => {
                    this.data = resp['data']
                    //alert(JSON.stringify(this.data))
                    //this.sourceProducts = this.data
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
        if (accion === 'editar') {
            this.opcion = 'seleccionar'
        }
        if (accion === 'capa1') {
            this.visible = false
            console.log(this.visible, 'ESTOY EN CAPA 1')
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
                this.caption = 'Registrar'
                this.acciones = 'manual'
                break
            case 'auto':
                this.opcion = 'auto'
                this.caption = 'Registrar'
                this.acciones = 'auto'
                break
        }
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
        // Emitir el valor de `opcion` al componente padre
        //this.opcionChange.emit(this.opcion)
        /* if (action.accion === 'asignar') {
        //this.asignarPreguntas()
    }*/
    }
}
