import { PrimengModule } from '@/app/primeng.module'
import {
    Component,
    Output,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
} from '@angular/core'

export interface IColumn {
    type: string
    width: string
    field: string
    header: string
    text_header: string
    text: string
}

@Component({
    selector: 'app-table-primeng',
    templateUrl: './table-primeng.component.html',
    styleUrls: ['./table-primeng.component.scss'],
    standalone: true,
    imports: [PrimengModule],
})
export class TablePrimengComponent implements OnChanges, OnInit {
    @Output() accionBtnItem = new EventEmitter()

    @Input() showCaption: boolean = true
    @Input() showPaginator: boolean = true

    @Input() data = []
    @Input() tableStyle: {
        [klass: string]: unknown
    } = { 'min-width': '50rem' }

    @Input() columnas: IColumn[] = [
        {
            type: 'text',
            width: '5rem',
            field: 'cActividad1',
            header: 'Actividad1',
            text_header: 'center',
            text: 'justify',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cActividad2',
            header: 'Actividad2',
            text_header: 'center',
            text: 'justify',
        },
        {
            type: 'text',
            width: '20rem',
            field: 'cActividad3',
            header: 'Actividad3',
            text_header: 'center',
            text: 'justify',
        },
        {
            type: 'actions',
            width: '3rem',
            field: 'actions',
            header: 'Acciones',
            text_header: 'center',
            text: 'center',
        },
    ]

    @Input() actions = [
        {
            labelTooltip: 'Agregar',
            icon: 'pi pi-plus',
            accion: 'agregar',
            type: 'item',
            class: 'p-button-rounded p-button-primary p-button-text',
        },
        {
            labelTooltip: 'Agregar',
            icon: 'pi pi-plus',
            accion: 'agregar',
            type: 'item',
            class: 'p-button-rounded p-button-danger p-button-text',
        },
        {
            labelTooltip: 'Editar',
            icon: 'pi pi-plus',
            accion: 'editar',
            type: 'item',
            class: 'p-button-rounded p-button-success p-button-text',
        },
    ]

    @Input() subactions = [
        {
            labelTooltip: 'Agregar',
            icon: 'pi pi-plus',
            accion: 'agregar',
            type: 'item',
            sub: [],
        },
        {
            labelTooltip: 'Agregar',
            icon: 'pi pi-plus',
            accion: 'agregar',
            type: 'item',
            sub: [],
        },
        {
            labelTooltip: 'Agregar',
            icon: 'pi pi-plus',
            accion: 'agregar',
            type: 'item',
            sub: [],
        },
        {
            labelTooltip: 'Agregar',
            icon: 'pi pi-plus',
            accion: 'agregar',
            type: 'dropdown',
            sub: [
                {
                    labelTooltip: 'Agregar',
                    icon: 'add',
                    accion: 'agregar',
                    color: 'primary',
                    type: 'link',
                },
            ],
        },
    ]

    _columnasSeleccionadas: IColumn[] = []

    loading: boolean = false

    constructor() {}

    ngOnInit() {
        this._columnasSeleccionadas = this.columnas
    }

    ngOnChanges(changes) {
        console.log(changes)

        const { currentValue } = changes.data
        this.data = currentValue
    }

    accionBtn(accion, item) {
        const data = {
            accion,
            item,
        }
        this.accionBtnItem.emit(data)
    }

    get selectedColumns(): IColumn[] {
        return this._columnasSeleccionadas
    }

    set selectedColumns(val: IColumn[]) {
        this._columnasSeleccionadas = this.columnas.filter((col) =>
            val.includes(col)
        )
    }
}
