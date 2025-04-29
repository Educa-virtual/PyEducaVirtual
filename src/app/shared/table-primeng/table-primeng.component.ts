import { PrimengModule } from '@/app/primeng.module'
import { ChangeDetectionStrategy } from '@angular/core'
import {
    Component,
    Output,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    ContentChild,
    TemplateRef,
    ViewChild,
} from '@angular/core'
import { TableColumnFilterComponent } from './table-column-filter/table-column-filter.component'
import { IIcon } from '../icon/icon.interface'
import { IconComponent } from '../icon/icon.component'
import { isIIcon } from '../utils/is-icon-object'
import { IsIconTypePipe } from '../pipes/is-icon-type.pipe'
import { Table } from 'primeng/table'
import { SearchWordsComponent } from './search-words/search-words.component'
import { environment } from '@/environments/environment'

type TColumnType =
    | 'actions'
    | 'item'
    | 'checkbox'
    | 'expansion'
    | 'p-editor'
    | 'text'
    | 'radio'
    | 'trim'
    | 'icon-tooltip'
    | 'estado'
    | string

export interface IColumn {
    rowspan?: number
    colspan?: number
    col?: number
    type: TColumnType

    width: string
    padding?: string
    field: string
    header: string
    text_header: string
    placeholder?: string
    inputType?: string
    outputType?: string

    severity?: (
        option
    ) =>
        | 'success'
        | 'secondary'
        | 'info'
        | 'warning'
        | 'danger'
        | 'contrast'
        | undefined
    options?: {
        label: string
        value: string
    }[]
    text: string
    styles?: object | undefined
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
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-table-primeng',
    templateUrl: './table-primeng.component.html',
    styleUrls: ['./table-primeng.component.scss'],
    standalone: true,
    imports: [
        PrimengModule,
        TableColumnFilterComponent,
        IconComponent,
        IsIconTypePipe,
        SearchWordsComponent,
    ],
})
export class TablePrimengComponent implements OnChanges, OnInit {
    backend = environment.backend

    getClass(rowData: any, classes: string): { [key: string]: boolean } {
        const fieldValue = rowData?.[classes]
        if (classes) {
            return { [String(fieldValue)]: !!fieldValue } // Convertir a string y asegurarse de que sea un valor booleano.
        } else {
            return undefined
        }
    }

    @Output() accionBtnItem: EventEmitter<{ accion: any; item: any }> =
        new EventEmitter()
    @Output() selectedRowDataChange = new EventEmitter()

    @Input() selectionMode: 'single' | 'multiple' | null = null
    @Input() groupHeader: string

    @Input() expandedRowKeys = {}
    @Input() dataKey: string
    @Input() groupRowsBy
    @Input() groupfooter: IColumn[]

    debug(d) {
        console.log('d')
        console.log(d)
    }
    @Input() showCaption: boolean = true
    @Input() caption: string | undefined | null
    @Input() showPaginator: boolean = true
    @Input() sortMode: 'single' | 'multiple' | null = 'multiple'
    @Input() sortField: string | undefined | null = null
    @Input() sortOrder: number | undefined | null = null
    @Input() indiceColumnaBuscar: number = 1

    @Input() selectedRowData
    @Input() scrollable: boolean = false
    @Input() scrollHeight: string = ''

    @Input() template: 'body' | 'expandable' = 'body'

    @Input() data = []
    @Input() tableStyle: {
        [klass: string]: unknown
    } = {}

    @Input() placeholder = 'Buscar'
    @ContentChild('rowExpansionTemplate', { static: false })
    rowExpansionTemplate: TemplateRef<unknown>
    rowGroupheader: TemplateRef<unknown>

    // buscador de palabras en el primeng
    @ViewChild('dt') dt!: Table
    searchTerm: string = ''

    buscarPalabras(event: string) {
        //     this.searchTerm = event.trim().toLowerCase();

        // if (this.dt) {
        //     const columnasFiltrar = [this.columnas[1].field, this.columnas[2].field, this.columnas[3].field];

        //     columnasFiltrar.forEach(col => {
        //         this.dt.filter(this.searchTerm, col, 'contains');
        //     });
        // }
        this.searchTerm = event
        console.log('Valor es ' + this.indiceColumnaBuscar)
        if (this.dt) {
            // solo va buscar en el indice(1)
            // const filas = [this.columnas[1].field, this.columnas[2].field]
            this.dt.filter(
                this.searchTerm,
                this.columnas[this.indiceColumnaBuscar].field,
                'contains'
            )
        }
    }
    // otra forma de buscar en la table pero general demora en buscar
    // buscarPalabras(event: string) {
    //     this.searchTerm = event;

    //     if (this.dt) {
    //       this.dt.filterGlobal(this.searchTerm, 'contains');
    //     }
    // }

    public isIIcon = isIIcon

    @Input() typeHeaderColumn: 'simple' | 'group' = 'simple'
    @Input() columnsGroup: IColumn[][]

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
    set columnas(value: IColumn[] | undefined) {
        if (value) {
            this._columnas = value.map((column) => ({
                ...column,
                selected: true,
            }))
        } else {
            this._columnas = [] // Valor predeterminado en caso de undefined
        }
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
        this.columnsGroupSeleccionadas = this.columnsGroup
        //this.selectedCells = {}
    }

    getStyleColumnGroup(col: any, colIndex: number) {
        if (col.colspan && col.colspan > 1) {
            return (colIndex + 1) % 2 !== 0
                ? { 'background-color': '#c9c8d9' }
                : { 'background-color': '#dddde8' }
        }

        return { 'background-color': '#e6e6ee' }
    }

    ngOnChanges(changes: any) {
        if (changes.data?.currentValue) {
            this.data = changes.data.currentValue
        }
        if (changes.columnas?.currentValue) {
            this.columnas = changes.columnas.currentValue
            this.columnasSeleccionadas = this.columnas
        }

        if (changes.columnsGroup?.currentValue) {
            this.columnsGroupSeleccionadas = changes.columnsGroup.currentValue
        }

        if (changes.selectedRowData?.currentValue) {
            this.selectedRowData = changes.selectedRowData.currentValue
        }

        if (changes.expandedRowKeys?.currentValue) {
            this.expandedRowKeys = changes.expandedRowKeys.currentValue
        }
    }

    accionBtn(accion, item) {
        const data = {
            accion,
            item,
        }
        this.accionBtnItem.emit(data)
    }

    columnsGroupSeleccionadas
    onColumnSelected(columns) {
        console.log('columns', columns)

        if (this.columnsGroup) {
            // 1. Detectar columnas eliminadas por `field`
            const removedCols = this.columnas
                .filter(
                    (original) =>
                        !columns.find((col) => col.field === original.field)
                )
                .map((col) => col.col)

            // 2. Llamar a función con columnas originales y columnas eliminadas
            const { inTableColumns, inTableColumnsGroup } =
                this.removeColumnAndUpdateGroups({
                    targetCols: removedCols,
                    inTableColumns: [...this.columnas], // copia de las originales
                    inTableColumnsGroup: this.columnsGroup,
                })

            this.columnsGroupSeleccionadas = inTableColumnsGroup
            this.columnasSeleccionadas = inTableColumns

            this.reAddRemovedCells(removedCols, this.columnsGroup)
        } else {
            this.columnasSeleccionadas = columns
        }

        console.log(this.columnsGroupSeleccionadas)
    }

    reAddRemovedCells(removedCols, inTableColumnsGroup) {
        // Aseguramos que las celdas eliminadas sean agregadas de nuevo en la posición correcta
        const reAddedCells = removedCols.filter((col) => {
            // Verificamos si la columna está de nuevo en el rango de las columnas visibles
            return !this.columnsGroup.some((group) =>
                group.some((cell) => cell.col === col)
            )
        })

        // Reagregamos las celdas eliminadas
        reAddedCells.forEach((col) => {
            inTableColumnsGroup.forEach((row) => {
                row.forEach((cell) => {
                    if (cell.col === col) {
                        // Reagregamos la celda eliminada, ajustando su colspan si es necesario
                        const updatedCell = {
                            ...cell,
                            colspan: 1, // O el valor apropiado de `colspan`
                            col: col,
                        }
                        row.push(updatedCell)
                    }
                })
            })
        })
    }

    removeColumnAndUpdateGroups({
        targetCols,
        inTableColumns,
        inTableColumnsGroup,
    }) {
        targetCols.sort((a, b) => b - a)

        // Actualizamos las columnas visibles (para la tabla)
        const updatedColumns = inTableColumns
            .filter((col) => !targetCols.includes(col.col))
            .map((col) => ({
                ...col,
                col: col.col - targetCols.filter((t) => t < col.col).length,
            }))

        // Actualizamos las columnas agrupadas (para encabezados)
        const updatedGroups = inTableColumnsGroup.map((row) => {
            return row
                .map((cell) => {
                    const start = cell.col
                    const span = cell.colspan ?? 1
                    // const end = start + span - 1;

                    // columnas cubiertas por la celda
                    const range = Array.from(
                        { length: span },
                        (_, i) => start + i
                    )
                    const remainingCols = range.filter(
                        (col) => !targetCols.includes(col)
                    )

                    if (remainingCols.length === 0) {
                        // Toda la celda debe eliminarse
                        return null
                    }

                    const newCol =
                        remainingCols[0] -
                        targetCols.filter((t) => t < remainingCols[0]).length

                    return {
                        ...cell,
                        col: newCol,
                        colspan: remainingCols.length,
                    }
                })
                .filter(Boolean) // Eliminamos las celdas nulas
        })

        return {
            inTableColumns: updatedColumns,
            inTableColumnsGroup: updatedGroups,
        }
    }

    onSelectionChange(event) {
        this.selectedRowData = event
        this.selectedRowDataChange.emit(event)
    }

    @Output() selectedColumn = new EventEmitter()

    findNivelLogroId(obj) {
        for (const key in obj) {
            if (obj[key]?.logros) {
                const logro = obj[key].logros.find(
                    (logro) => logro.iNivelLogroAlcId !== undefined
                )
                if (logro) {
                    return logro.iNivelLogroAlcId
                }
            }
        }
        return null // Si no se encuentra ningún id
    }

    selectCell(col: any, field: string, row: any): void {
        const nivelEvaId = row.values?.[field]?.iNivelEvaId

        this.selectedColumn.emit([
            col,
            {
                iCriterioId: row.values?.[field]?.iCriterioId,
                iNivelEvaId: nivelEvaId,
                iNivelLogroAlcId: this.findNivelLogroId(row.values),
            },
        ])

        // Si la celda seleccionada es la misma, la deseleccionamos
        // if (this.selectedCells[nivelEvaId] === field) {
        //     delete this.selectedCells[nivelEvaId];
        // } else {
        //     this.selectedCells = {}
        //     this.selectedCells[nivelEvaId] = field; // Asignar nueva celda seleccionada
        // }
    }

    // selectRow(row: any, field: string): void {
    //     this.selectedColumn.emit(row)
    // }

    // selectedCells: { [rowId: string]: string } = {};

    @Input() enableCellSelection
    @Input() enableViewSelections
    @Input() showSortIcon = true
    @Input() showAdvancedFilter = false

    isAction(columns) {
        return columns.filter((column) => column.type === 'actions')[0]
    }

    // firstLoadRubrica = true

    // isCellSelected(rowData: any, field: string): boolean {

    //     console.log('selected estudiante')

    //     const iNivelEvaId = rowData.values?.[field]?.iNivelEvaId;

    //     if (rowData.values?.[field]?.logros != null && !this.selectedCells[iNivelEvaId]) {
    //         this.selectedCells[iNivelEvaId] = field;

    //     }
    //    // return this.selectedCells.hasOwnProperty(iNivelEvaId);
    // }

    // isFirstCellSelected(rowData: any, field: string): boolean {
    //     const iNivelEvaId = rowData.values?.[field]?.iNivelEvaId;

    //     return this.selectedCells.hasOwnProperty(iNivelEvaId);
    // }

    openFile(item) {
        switch (Number(item.type)) {
            case 1:
            case 4:
                window.open(this.backend + '/' + item.ruta, '_blank')
                break
            case 2:
            case 3:
                const ruta = item.ruta.includes('http')
                window.open(ruta ? item.ruta : 'http://' + item.ruta, '_blank')
                break
        }
    }
    updateUrl(item) {
        item.ruta = 'users/no-image.png'
    }

    selectedValue: { [key: string]: any } = {}
    formatGroupHeader(header: string, data: any): string {
        return header.replace(/\b\w+\b/g, (key) => data[key] || key)
    }
    /*
     * Mapea estilos de tag
     * @param row fila seleccionada
     * @param col datos del header de columna seleccionada
     * @returns string 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast'
     */
    mapTagStyles(
        row,
        col
    ): 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast' {
        if (col.styles === undefined) return 'secondary'
        const severity = [
            'success',
            'info',
            'warning',
            'danger',
            'secondary',
        ].includes(col.styles[row[col.field]])
        return severity ? col.styles[row[col.field]] : 'secondary'
    }
}
