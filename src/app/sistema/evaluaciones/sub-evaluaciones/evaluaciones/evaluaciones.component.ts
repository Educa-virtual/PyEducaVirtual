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

import { BotonosModalFormComponent } from '../evaluaciones/evaluaciones-form/botonos-modal-form/botonos-modal-form.component'

import {
    IActionTable,
    IColumn,
    TablePrimengComponent,
} from '../../../../shared/table-primeng/table-primeng.component'

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
    ],
    providers: [DialogService],
    templateUrl: './evaluaciones.component.html',
    styleUrl: './evaluaciones.component.scss',
})
export class EvaluacionesComponent implements OnInit {
    private _dialogService = inject(DialogService)

    customers!: Customer[]
    visible: boolean = false

    columnas: IColumn[] = [
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
    ]

    data = [{ id: 0 }, { id: 1 }, { id: 2 }]

    selectedItems = []
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
            accion: 'editar',
            type: 'item',
            class: 'p-button-rounded p-button-danger p-button-text',
        },
        {
            labelTooltip: 'Asignar I.E ',
            icon: {
                name: 'matGroupWork',
                size: 'xs',
            },
            accion: 'agregar',
            type: 'item',
            class: 'p-button-rounded p-button-primary p-button-text',
        },
    ]

    constructor(private customerService: CustomerService) {}

    ngOnInit() {
        this.customerService
            .getCustomersLarge()
            .then((customers) => (this.customers = customers))
    }
    showDialog() {
        this.visible = true
    }
    click() {}

    agregarEvaluacion() {
        this._dialogService.open(EvaluacionesFormComponent, {
            ...MODAL_CONFIG,
            header: 'Nueva evaluación',
            templates: {
                footer: BotonosModalFormComponent,
            },
        })
    }

    // manejar las acciones
    accionBtnItem(action) {
        if (action.accion === 'agregar') {
            //this.agregarPregunta()
        }
        if (action.accion === 'asignar') {
            //this.asignarPreguntas()
        }
    }

    accionBtnItemTable({ accion, item }) {
        if (accion === 'agregar') {
            this.selectedItems = []
            this.selectedItems = [item]
            //.asignarPreguntas()
        }
    }
}
