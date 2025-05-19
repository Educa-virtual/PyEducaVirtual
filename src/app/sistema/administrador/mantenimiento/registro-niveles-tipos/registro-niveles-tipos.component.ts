import { Component, OnInit } from '@angular/core'
import { PanelModule } from 'primeng/panel'
import { InputTextModule } from 'primeng/inputtext'
import {
    FormsModule,
    ReactiveFormsModule,
    FormBuilder,
    FormGroup,
} from '@angular/forms'
import {
    IActionTable,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'
import { DropdownModule } from 'primeng/dropdown'
import { GeneralService } from '@/app/servicios/general.service'

interface Niveles_tipos {
    name: string
    value: any // o number si es ID numérico
}

@Component({
    selector: 'app-registro-niveles-tipos',
    standalone: true,
    imports: [
        PanelModule,
        InputTextModule,
        TablePrimengComponent,
        FormsModule,
        ReactiveFormsModule,
        DropdownModule,
    ],
    templateUrl: './registro-niveles-tipos.component.html',
    styleUrls: ['./registro-niveles-tipos.component.scss'],
})
export class RegistroNivelesTiposComponent implements OnInit {
    formGroup!: FormGroup

    NivelesTipos: Niveles_tipos[] = [] // para el dropdown

    constructor(
        private fb: FormBuilder,
        private generalService: GeneralService
    ) {
        this.formGroup = this.fb.group({
            selectednivel_tip: [null],
        })
    }

    actions: IActionTable[] = [
        {
            labelTooltip: 'Editar',
            icon: 'pi pi-pen-to-square',
            accion: 'editar',
            type: 'item',
            class: 'p-button-rounded p-button-danger p-button-text',
        },
    ]

    columns = [
        {
            type: 'item',
            width: '2rem',
            field: '',
            header: 'Item',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '10rem',
            field: 'nombciclo',
            header: 'Nombre del Ciclo',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cicloabrev',
            header: 'Abreviación del Ciclo',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '3rem',
            field: 'estado',
            header: 'Estado',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'actions',
            width: '3rem',
            field: '',
            header: 'Acciones',
            text_header: 'center',
            text: 'center',
        },
    ]

    ngOnInit(): void {
        const filtro = {
            esquema: 'acad',
            tabla: 'nivel_tipos',
            campos: 'iNivelTipoId, cNivelTipoNombre',
            condicion: 'iEstado = 1',
        }

        this.generalService.searchTablaXwhere(filtro).subscribe({
            next: (res: any[]) => {
                this.NivelesTipos = res.map((item: any) => ({
                    name: item.cNivelTipoNombre,
                    value: item.iNivelTipoId,
                }))
            },
            error: (err) => {
                console.error('Error al cargar tipos de nivel:', err)
            },
        })
    }
}
