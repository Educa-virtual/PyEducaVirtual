import { PrimengModule } from '@/app/primeng.module'
import {
    Component,
    Output,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    ContentChild,
    TemplateRef,
} from '@angular/core'
import { TableColumnFilterComponent } from './table-column-filter/table-column-filter.component'
import { IIcon } from '../icon/icon.interface'
import { IconComponent } from '../icon/icon.component'
import { isIIcon } from '../utils/is-icon-object'
import { IsIconTypePipe } from '../pipes/is-icon-type.pipe'

export interface IColumn {
    type: string
    width: string
    field: string
    header: string
    text_header: string
    text: string
    customFalsy?: {
        trueText: string
        falseText: string
    }
}

export interface IActionTable {
    labelTooltip: string
    icon: string | IIcon
    accion: string
    type: string
    class: string
    isVisible?: (row) => boolean
}

@Component({
    selector: 'app-table-primeng',
    templateUrl: './table-primeng.component.html',
    styleUrls: ['./table-primeng.component.scss'],
    standalone: true,
    imports: [
        PrimengModule,
        TableColumnFilterComponent,
        IconComponent,
        IsIconTypePipe,
    ],
})
export class TablePrimengComponent implements OnChanges, OnInit {
    @Output() accionBtnItem = new EventEmitter()
    @Output() selectedRowDataChange = new EventEmitter()

    @Input() dataKey: string

    @Input() showCaption: boolean = true
    @Input() showPaginator: boolean = true

    @Input() selectedRowData
    @Input() scrollable: boolean = false
    @Input() scrollHeight: string = ''

    @Input() data = []
    @Input() tableStyle: {
        [klass: string]: unknown
    } = { 'min-width': '50rem' }

    @ContentChild('rowExpansionTemplate', { static: false })
    rowExpansionTemplate: TemplateRef<unknown>

    public isIIcon = isIIcon

    private _columnas: IColumn[] = [
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
        {
            type: 'p-editor',
            width: 'auto',
            field: 'cEditor',
            header: 'Descripcion',
            text_header: 'left',
            text: 'left',
        },
    ]

    @Input()
    set columnas(value: IColumn[]) {
        this._columnas = value.map((column) => ({
            ...column,
            selected: true,
        }))
    }

    get columnas(): IColumn[] {
        return this._columnas
    }

    @Input() actions: IActionTable[] = [
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
            isVisible: () => true,
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

    public columnasSeleccionadas: IColumn[] = []

    loading: boolean = false

    constructor() {}

    ngOnInit() {
        this.columnasSeleccionadas = this.columnas
    }

    ngOnChanges(changes) {
        if (changes.data?.currentValue) {
            this.data = changes.data.currentValue
        }

        if (changes.selectedRowData?.currentValue) {
            this.selectedRowData = changes.selectedRowData.currentValue
        }
    }

    accionBtn(accion, item) {
        const data = {
            accion,
            item,
        }
        this.accionBtnItem.emit(data)
    }

    onColumnSelected(columns) {
        this.columnasSeleccionadas = columns
    }

    onSelectionChange(event) {
        this.selectedRowData = event
        this.selectedRowDataChange.emit(event)
    }
}
