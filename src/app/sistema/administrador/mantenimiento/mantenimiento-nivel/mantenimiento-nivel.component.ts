import { Component } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { FormBuilder, FormGroup } from '@angular/forms'
import { InputNumberModule } from 'primeng/inputnumber'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { ConstantesService } from '@/app/servicios/constantes.service'
import {
    IActionTable,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'

@Component({
    selector: 'app-mantenimiento-nivel',
    standalone: true,
    imports: [PrimengModule, TablePrimengComponent, InputNumberModule],
    templateUrl: './mantenimiento-nivel.component.html',
    styleUrl: './mantenimiento-nivel.component.scss',
})
export class MantenimientoNivelComponent {
    constructor(
        private fb: FormBuilder,
        private store: LocalStoreService,
        private constantesService: ConstantesService
    ) {}
    form: FormGroup

    selectedItems = []
    //actions: IActionTable[] = []
    actionsLista: IActionTable[]

    datos = [
        {
            item: 1,
            area: 'Matemáticas',
            horasTeoricas: 4,
            horasPracticas: 2,
            totalHoras: 6,
            estado: 'Activo',
            acciones: 'Editar',
        },
        {
            item: 2,
            area: 'Lenguaje',
            horasTeoricas: '5',
            horasPracticas: 3,
            totalHoras: 6,
            estado: 'Activo',
            acciones: 'Editar',
        },
    ]

    actions: IActionTable[] = [
        {
            labelTooltip: 'Eliminar',
            icon: 'pi pi-pen-to-square',
            accion: 'eliminar',
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
            field: 'area',
            header: 'área curricular',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'horasTeoricas',
            header: 'horas teóricas',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '6rem',
            field: '',
            header: 'horas prácticas',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '6rem',
            field: '',
            header: 'Total horas ',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '3rem',
            field: '',
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
}
