import { Component, OnInit, ViewChild, ElementRef, inject } from '@angular/core'
import { SelectItem } from 'primeng/api'
import { Customer, Representative } from 'src/app/demo/api/customer'
import { CustomerService } from 'src/app/demo/service/customer.service'
import { Product } from 'src/app/demo/api/product'
import { ProductService } from 'src/app/demo/service/product.service'
import { Table, TableModule } from 'primeng/table'
import { MessageService, ConfirmationService, PrimeTemplate } from 'primeng/api'
import { ButtonDirective, Button } from 'primeng/button'
import { InputTextModule } from 'primeng/inputtext'
import { InputSwitchModule } from 'primeng/inputswitch'
import { MultiSelectModule } from 'primeng/multiselect'
import { FormsModule } from '@angular/forms'
import { DropdownModule } from 'primeng/dropdown'
import { SliderModule } from 'primeng/slider'
import { ProgressBarModule } from 'primeng/progressbar'
import { NgClass, NgIf, CurrencyPipe, DatePipe } from '@angular/common'
import { ToggleButtonModule } from 'primeng/togglebutton'
import { ToastModule } from 'primeng/toast'
import { Ripple } from 'primeng/ripple'
import { RatingModule } from 'primeng/rating'
import { DialogModule } from 'primeng/dialog'

import { AlternativasComponent } from './alternativas/alternativas.component'
import { CompetenciasComponent } from '../competencias/competencias.component'

//EDITOR
import { EditorModule } from 'primeng/editor'

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
    providers: [MessageService, ConfirmationService, DialogService],
    standalone: true,
    imports: [
        AlternativasComponent,
        CompetenciasComponent,

        EditorModule,
        TableModule,
        DialogModule,
        PrimeTemplate,
        ButtonDirective,
        InputTextModule,
        MultiSelectModule,
        FormsModule,
        DropdownModule,
        SliderModule,
        ProgressBarModule,
        NgClass,
        ToggleButtonModule,
        ToastModule,
        Ripple,
        RatingModule,
        Button,
        NgIf,
        CurrencyPipe,
        DatePipe,
        InputSwitchModule,
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

    isExpanded: boolean = false

    idFrozen: boolean = false

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
