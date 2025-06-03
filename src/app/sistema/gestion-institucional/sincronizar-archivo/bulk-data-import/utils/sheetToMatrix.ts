import * as XLSX from 'xlsx'
import { Excel, isRange } from '../types/excel'
import { IColumn } from '@/app/shared/table-primeng/table-primeng.component'

interface Options {
    structures: {
        header?: Excel['Range']
        data: Excel['Cell']
        columns: {
            inTableColumnsGroup: IColumn[][]
            inTableColumns: IColumn[]
        }
        inTableColumn: boolean
    }[]
}

export class SheetToMatrix {
    private worksheet: XLSX.WorkSheet
    public inTableColumns: IColumn[] = []
    public inTableColumnsGroup: IColumn[][] = []
    public inTableData = []
    public fullData: any[] = []
    public dataAccordingColumns: any
    private options: Options

    constructor(worksheet: XLSX.WorkSheet, options: Options) {
        this.worksheet = worksheet

        this.options = options

        this.assignTableData()
    }

    private assignTableData() {
        for (const { columns, data, header, inTableColumn } of this.options
            .structures) {
            const rowDataGroup = []
            const structureDataAddress = XLSX.utils.decode_range(data)
            const structureHeaderAddress = XLSX.utils.decode_range(header)

            columns.inTableColumnsGroup = this.assignColWithSpan(
                columns?.inTableColumnsGroup
            )

            columns.inTableColumns = columns?.inTableColumns?.map(
                (column, index) => ({ ...column, col: index + 1 })
            )

            for (const [cellName, any] of Object.entries(this.worksheet)) {
                if (cellName.includes('!')) continue

                const locationCellName = XLSX.utils.decode_cell(cellName)

                if (columns.inTableColumns) {
                    for (const { field } of columns.inTableColumns) {
                        const [cellNameColumn] = field.split('/')

                        const locationCellColumn =
                            XLSX.utils.decode_cell(cellNameColumn)

                        const InColum =
                            locationCellColumn.c === locationCellName.c

                        if (!InColum) {
                            // console.log('cellName', cellName)
                            // console.log('locationCellName', locationCellName)
                            // console.log('any', any.v)

                            continue
                        }

                        if (isRange(data)) {
                            const dataInRange =
                                structureDataAddress.s.c <=
                                    locationCellName.c &&
                                structureDataAddress.s.r <=
                                    locationCellName.r &&
                                structureDataAddress.e.c >=
                                    locationCellName.c &&
                                structureDataAddress.e.r >= locationCellName.r

                            if (dataInRange) {
                                rowDataGroup[locationCellName.r] = {
                                    ...rowDataGroup[locationCellName.r],
                                    [field]: any.w,
                                }
                            }
                        } else {
                            const dataInRange =
                                structureDataAddress.s.c <=
                                    locationCellName.c &&
                                structureDataAddress.s.r <=
                                    locationCellName.r &&
                                structureHeaderAddress.e.c >= locationCellName.c

                            if (dataInRange) {
                                rowDataGroup[locationCellName.r] = {
                                    ...rowDataGroup[locationCellName.r],
                                    [field]: any.w,
                                }
                            }
                        }
                    }

                    if (inTableColumn) {
                        this.inTableColumnsGroup = columns.inTableColumnsGroup
                        this.inTableColumns = columns.inTableColumns
                        this.inTableData = Object.values(rowDataGroup)
                    }
                }
            }

            this.fullData.push([
                columns?.inTableColumnsGroup,
                columns.inTableColumns,
                Object.values(rowDataGroup),
            ])
        }
    }

    private assignColWithSpan(table: any[][]) {
        if (!table) return table

        const occupied: Record<number, Record<number, boolean>> = {} // fila -> columnas ocupadas
        const result: any[][] = []

        for (let row = 0; row < table.length; row++) {
            const newRow: any[] = []
            let colIndex = 0

            occupied[row] ??= {}

            for (const cell of table[row]) {
                // Buscar la siguiente columna libre
                while (occupied[row][colIndex]) colIndex++

                // Asignar col
                const newCell = { ...cell, col: colIndex + 1 }
                newRow.push(newCell)

                const colspan = cell.colspan ?? 1
                const rowspan = cell.rowspan ?? 1

                // Marcar celdas ocupadas por rowspan y colspan
                for (let r = 0; r < rowspan; r++) {
                    occupied[row + r] ??= {}
                    for (let c = 0; c < colspan; c++) {
                        occupied[row + r][colIndex + c] = true
                    }
                }

                // Avanzar colIndex para la próxima celda
                colIndex += colspan
            }

            result.push(newRow)
        }

        return result
    }

    public setDataAccordingColumns() {
        if (this.inTableData.length <= 0) return

        this.dataAccordingColumns = this.inTableData.map((obj) => {
            const transformed: Record<string, any> = {}

            for (const [key, value] of Object.entries(obj)) {
                const lastKey = key.split('/').pop() // Última parte
                transformed[lastKey!] = value // Usa ! para evitar error de posible undefined
            }
            return transformed
        })
        return this.dataAccordingColumns
    }

    private static _instances: Map<string, SheetToMatrix> = new Map()

    public static getInstance(
        key: string,
        worksheet?: any,
        options?: { structures: any }
    ): SheetToMatrix {
        if (!SheetToMatrix._instances.has(key)) {
            // Validar que se pasen los parámetros necesarios
            if (!worksheet || !options) {
                throw new Error(
                    `SheetToMatrix: Falta worksheet/options/columns para crear nueva instancia con key: ${key}`
                )
            }

            const instance = new SheetToMatrix(worksheet, options)
            SheetToMatrix._instances.set(key, instance)
        }

        return SheetToMatrix._instances.get(key)!
    }
    public static setInstance(
        key: string,
        worksheet?: any,
        options?: { structures: any }
    ): SheetToMatrix {
        if (!SheetToMatrix._instances.has(key)) {
            // Validar que se pasen los parámetros necesarios
            if (!worksheet || !options) {
                throw new Error(
                    `SheetToMatrix: Falta worksheet/options/columns para crear nueva instancia con key: ${key}`
                )
            }

            const instance = new SheetToMatrix(worksheet, options)
            SheetToMatrix._instances.set(key, instance)
        }

        return SheetToMatrix._instances.get(key)!
    }

    public static resetInstance(key: string): void {
        SheetToMatrix._instances.delete(key)
    }

    // Reset de todas
    public static clearAllInstances(): void {
        SheetToMatrix._instances.clear()
    }
}
