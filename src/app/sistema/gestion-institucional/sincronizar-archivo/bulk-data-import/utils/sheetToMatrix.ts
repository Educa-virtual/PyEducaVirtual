import * as XLSX from 'xlsx-js-style'
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

    public static exportToExcel(worksheets: any): void {
        const workbook: XLSX.WorkBook = {
            SheetNames: worksheets.map((ws) => ws.sheetName),
            Sheets: worksheets.reduce(
                (acc, ws) => {
                    const allQuestions = new Set<number>()

                    // Paso 1: recolectar todas las preguntas únicas
                    ws.data.forEach((row) => {
                        const respuestas = JSON.parse(row.respuestas || '[]')
                        respuestas.forEach((resp: any) => {
                            allQuestions.add(resp.p)
                        })
                    })

                    const orderedQuestions = Array.from(allQuestions).sort(
                        (a, b) => a - b
                    )

                    const extendedColumns = [
                        ...ws.columns,
                        ...orderedQuestions.map((num) => ({
                            key: `p${num}`,
                            header: `${num}`,
                        })),
                    ]

                    // Mapas para estilos
                    const cellCorrectMap = new Set<string>()
                    const cellIncorrectMap = new Set<string>()

                    // Paso 2: Mapear datos
                    const mappedData = ws.data.map((row, rowIdx) => {
                        const newRow: Record<string, any> = {}
                        const respuestas = JSON.parse(row.respuestas || '[]')

                        extendedColumns.forEach((col, colIdx) => {
                            if (col.key === 'index') {
                                newRow[col.header] = rowIdx + 1
                            } else if (/^p\d+$/.test(col.key)) {
                                const questionNum = parseInt(col.header)
                                const respuesta = respuestas.find(
                                    (r: any) => r.p == questionNum
                                )
                                newRow[col.header] = respuesta?.pt ?? 0

                                const cellKey = `${rowIdx + 1}:${colIdx}`

                                if (respuesta?.c == true) {
                                    cellCorrectMap.add(cellKey)
                                } else if (respuesta && respuesta.c == false) {
                                    cellIncorrectMap.add(cellKey)
                                }
                            } else if (Array.isArray(col.key)) {
                                if (col.operation === 'sum') {
                                    const total = col.key.reduce(
                                        (acc, value) => {
                                            const num = Number(row[value]) || 0
                                            return acc + num
                                        },
                                        0
                                    )
                                    newRow[col.header] = total
                                }
                            } else {
                                newRow[col.header] = row[col.key]
                            }
                        })

                        return newRow
                    })

                    const headers = extendedColumns.map((col) => col.header)
                    const sheet = XLSX.utils.json_to_sheet(mappedData, {
                        header: headers,
                    })

                    // Paso 3: Aplicar estilos a encabezados
                    headers.forEach((header, colIdx) => {
                        const headerCellAddress = XLSX.utils.encode_cell({
                            r: 0,
                            c: colIdx,
                        })
                        const headerCell = sheet[headerCellAddress]
                        if (headerCell) {
                            headerCell.s = {
                                font: { bold: true },

                                border: {
                                    top: {
                                        style: 'thin',
                                        color: { rgb: '000000' },
                                    },
                                    bottom: {
                                        style: 'thin',
                                        color: { rgb: '000000' },
                                    },
                                    left: {
                                        style: 'thin',
                                        color: { rgb: '000000' },
                                    },
                                    right: {
                                        style: 'thin',
                                        color: { rgb: '000000' },
                                    },
                                },
                                alignment: { horizontal: 'center' },
                                fill: {
                                    patternType: 'solid',
                                    fgColor: { rgb: 'dae0e5' },
                                },
                            }
                        }

                        // Paso 4: Aplicar estilos condicionales por celda
                        for (
                            let rowIdx = 1;
                            rowIdx <= mappedData.length;
                            rowIdx++
                        ) {
                            const cellKey = `${rowIdx}:${colIdx}`
                            const cellAddress = XLSX.utils.encode_cell({
                                r: rowIdx,
                                c: colIdx,
                            })
                            const cell = sheet[cellAddress]

                            if (cell) {
                                if (cellCorrectMap.has(cellKey)) {
                                    cell.s = {
                                        font: {
                                            color: { rgb: '008000' },
                                            // bold: true,
                                        }, // Verde
                                        border: {
                                            top: {
                                                style: 'thin',
                                                color: { rgb: '000000' },
                                            },
                                            bottom: {
                                                style: 'thin',
                                                color: { rgb: '000000' },
                                            },
                                            left: {
                                                style: 'thin',
                                                color: { rgb: '000000' },
                                            },
                                            right: {
                                                style: 'thin',
                                                color: { rgb: '000000' },
                                            },
                                        },
                                        fill: {
                                            patternType: 'solid',
                                            fgColor: { rgb: 'dae0e5' },
                                        },
                                        alignment: { horizontal: 'center' },
                                    }
                                } else if (cellIncorrectMap.has(cellKey)) {
                                    cell.s = {
                                        font: {
                                            color: { rgb: 'FF0000' },
                                            // italic: true,
                                        }, // Rojo
                                        border: {
                                            top: {
                                                style: 'thin',
                                                color: { rgb: '000000' },
                                            },
                                            bottom: {
                                                style: 'thin',
                                                color: { rgb: '000000' },
                                            },
                                            left: {
                                                style: 'thin',
                                                color: { rgb: '000000' },
                                            },
                                            right: {
                                                style: 'thin',
                                                color: { rgb: '000000' },
                                            },
                                        },

                                        alignment: { horizontal: 'center' },
                                    }
                                } else {
                                    cell.s = {
                                        border: {
                                            top: {
                                                style: 'thin',
                                                color: { rgb: '000000' },
                                            },
                                            bottom: {
                                                style: 'thin',
                                                color: { rgb: '000000' },
                                            },
                                            left: {
                                                style: 'thin',
                                                color: { rgb: '000000' },
                                            },
                                            right: {
                                                style: 'thin',
                                                color: { rgb: '000000' },
                                            },
                                        },
                                    }
                                }
                            }
                        }
                    })

                    acc[ws.sheetName] = sheet
                    return acc
                },
                {} as Record<string, XLSX.WorkSheet>
            ),
        }

        XLSX.writeFile(workbook, 'datos.xlsx', { compression: true })
    }
}
