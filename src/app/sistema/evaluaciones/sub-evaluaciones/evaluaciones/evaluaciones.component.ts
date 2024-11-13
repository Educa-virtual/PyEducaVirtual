import { Component, inject, OnInit } from '@angular/core'

/*GRILLA */
import { Customer } from 'src/app/demo/api/customer'
import { CustomerService } from 'src/app/demo/service/customer.service'

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
    ],
    providers: [DialogService],
    templateUrl: './evaluaciones.component.html',
    styleUrl: './evaluaciones.component.scss',
})
export class EvaluacionesComponent implements OnInit {
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
    customers!: Customer[]
    visible: boolean = false

    accionesPrincipal: IActionContainer[] = [
        /*{
            labelTooltip: 'Asignar Matriz',
            text: 'Asignar Matriz',
            icon: {
                name: 'matGroupWork',
                size: 'xs',
                color: '',
            },
            accion: 'asignar',
            class: 'p-button-primary',
        },*/
        {
            labelTooltip: 'Agregar evaluación',
            text: 'Agregar Evaluación',
            icon: 'pi pi-plus',
            accion: 'agregar',
            class: 'p-button-secondary',
        },
    ]

    columnas: IColumn[] = [
        {
            field: 'iEvaluacionId',
            header: 'ID',
            type: 'text',
            width: '5rem',
            text: 'left',
            text_header: 'Pregunta',
        },
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
        {
            field: '',
            header: 'Acciones',
            type: 'actions',
            width: '5rem',
            text: 'left',
            text_header: '',
        },
    ]

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
        {
            labelTooltip: 'Eliminar',
            icon: 'pi pi-trash',
            accion: 'editar',
            type: 'item',
            class: 'p-button-rounded p-button-danger p-button-text',
        },
    ]

    constructor(
        private customerService: CustomerService,
        private compartirIdEvaluacionService: CompartirIdEvaluacionService
    ) {}

    ngOnInit() {
        this.customerService
            .getCustomersLarge()
            .then((customers) => (this.customers = customers))
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
                    /*.competencias = resp['data']
                    this.competencias.unshift({
                        iCompentenciaId: 0,
                        cCompetenciaDescripcion: 'Todos',
                    })*/

                    this.data = resp['data']
                    //alert(JSON.stringify(this.data))
                    //this.sourceProducts = this.data
                },
            })
    }

    accionBtnItemTable({ accion, item }) {
        if (accion === 'asignar') {
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
    // manejar las acciones
    accionBtnItem(action) {
        if (action.accion === 'agregar') {
            this.agregarEditarPregunta({
                iEvaluacionId: 0,
            })
        }
        /* if (action.accion === 'asignar') {
        //this.asignarPreguntas()
    }*/
    }
}
