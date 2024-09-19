import { Component, OnInit, ViewChild, ElementRef, inject } from '@angular/core'
import { SelectItem } from 'primeng/api'
import { Customer, Representative } from 'src/app/demo/api/customer'
import { CustomerService } from 'src/app/demo/service/customer.service'
import { Product } from 'src/app/demo/api/product'
import { ProductService } from 'src/app/demo/service/product.service'
import { Table } from 'primeng/table'
import { Button } from 'primeng/button'
import { InputTextModule } from 'primeng/inputtext'
import { MultiSelectModule } from 'primeng/multiselect'
import { FormsModule } from '@angular/forms'
import { DropdownModule } from 'primeng/dropdown'

import { AlternativasComponent } from './alternativas/alternativas.component'
import { CompetenciasComponent } from '../competencias/competencias.component'

//EDITOR
import {
    IColumn,
    TablePrimengComponent,
} from '../../../../shared/table-primeng/table-primeng.component'
import {
    ContainerPageComponent,
    IActionContainer,
} from '@/app/shared/container-page/container-page.component'
import { provideIcons } from '@ng-icons/core'
import { matGroupWork } from '@ng-icons/material-icons/baseline'

interface expandedRows {
    [key: string]: boolean
}

/* modal  */
import { DialogService } from 'primeng/dynamicdialog'
import { BancoPreguntasFormComponent } from '../banco-preguntas/banco-preguntas-form/banco-preguntas-form.component'
import { MODAL_CONFIG } from '@/app/shared/constants/modal.config'
@Component({
    selector: 'app-banco-preguntas',
    templateUrl: './banco-preguntas.component.html',
    providers: [provideIcons({ matGroupWork }), DialogService],
    standalone: true,
    imports: [
        AlternativasComponent,
        CompetenciasComponent,
        InputTextModule,
        MultiSelectModule,
        FormsModule,
        DropdownModule,
        ContainerPageComponent,
        Button,
        TablePrimengComponent,
    ],
})
export class BancoPreguntasComponent implements OnInit {
    private _dialogService = inject(DialogService)

    display: boolean = false

    customers1: Customer[] = []

    selectedCustomers1: Customer[] = []

    selectedCustomer: Customer = {}

    representatives: Representative[] = []

    statuses: Product[] = []

    products: Product[] = []

    rowGroupMetadata: Product

    expandedRows: expandedRows = {}

    activityValues: number[] = [0, 100]

    loading: boolean = true
    valSwitch: boolean = false
    selectedDrop: SelectItem = { value: '' }
    nivel: SelectItem[] = []
    grado: SelectItem[] = []
    area: SelectItem[] = []

    competencia: SelectItem[] = []
    capacidad: SelectItem[] = []
    desempenio: SelectItem[] = []
    tipo_pregunta: SelectItem[] = []
    clave: SelectItem[] = []

    text
    textAyuda

    selectedItems = []
    accionesPrincipal: IActionContainer[] = [
        {
            labelTooltip: 'Asignar',
            text: 'Asignar',
            icon: {
                name: 'matGroupWork',
                size: 'xs',
                color: '',
            },
            accion: 'agregar',
            class: 'p-button-primary',
        },
        {
            labelTooltip: 'Agregar Pregunta',
            text: 'Agregar Pregunta',
            icon: 'pi pi-plus',
            accion: 'agregar',
            class: 'p-button-secondary',
        },
    ]

    data = [
        {
            id: 1,
            cPregunta: 'Pregunta 1',
            tiempo: '0h 2m 0s',
            iPreguntaPeso: '2',
        },
        {
            id: 2,
            cPregunta: 'Pregunta 2',
            tiempo: '0h 2m 0s',
            iPreguntaPeso: '2',
        },
    ]

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
            field: 'tiempo',
            header: 'Tiempo',
            type: 'text',
            width: '5rem',
            text: 'left',
            text_header: 'Puntaje',
        },

        {
            field: 'iPreguntaPeso',
            header: 'Puntaje',
            type: 'text',
            width: '5rem',
            text: 'left',
            text_header: 'Puntaje',
        },
    ]

    @ViewChild('filter') filter!: ElementRef

    constructor(
        private customerService: CustomerService,
        private productService: ProductService
    ) {}

    ngOnInit() {
        this.customerService.getCustomersLarge().then((customers) => {
            this.customers1 = customers
            this.loading = false

            /*  this.customers1.forEach(
                (customer) => (customer.date = new Date(customer.date))
            )*/
        })

        this.nivel = [
            {
                label: 'Nivel Primaria',
                value: { id: 1, name: 'New York', code: 'NY' },
            },
            {
                label: 'Nivel Secundaria',
                value: { id: 2, name: 'Rome', code: 'RM' },
            },
        ]
        this.grado = [
            { label: '2do.', value: { id: 1, name: 'New York', code: 'NY' } },
            { label: '4to.', value: { id: 2, name: 'Rome', code: 'RM' } },
        ]
        this.area = [
            {
                label: 'Matemáticas',
                value: { id: 1, name: 'New York', code: 'NY' },
            },
            {
                label: 'Comunicación',
                value: { id: 2, name: 'Rome', code: 'RM' },
            },
        ]
    }

    onSort() {
        this.updateRowGroupMetaData()
    }

    updateRowGroupMetaData() {
        this.rowGroupMetadata = {}
    }

    formatCurrency(value: number) {
        return value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
        })
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains')
    }

    clear(table: Table) {
        table.clear()
        this.filter.nativeElement.value = ''
    }

    ok() {
        console.log(this.textAyuda)
        alert(this.textAyuda)
    }

    setSelectedItems(event) {
        this.selectedItems = event
    }

    accionBtnItem(action) {
        console.log(action)
    }

    agregarPregunta() {
        // if (event.accion === 'calificar') {
        console.log('agregar')
        this._dialogService.open(BancoPreguntasFormComponent, {
            ...MODAL_CONFIG,
            header: 'Nueva pregunta',
        })
        // }
    }
}
