import * as XLSX from 'xlsx'
import { Excel, isRange } from '../types/excel'
import { IColumn } from '@/app/shared/table-primeng/table-primeng.component'

interface Options {
    structures: {
        header?: Excel['Range']
        data: Excel['Cell']
        columns: IColumn[]
        inTableColumn: boolean
    }[]
}

export class SheetToMatrix {
    private worksheet: XLSX.WorkSheet
    public inTableColumns: IColumn[] = []
    public inTableColumnsGroup: IColumn[][] = []
    public inTableData: IColumn[] = []
    public extraData: any[] = []
    public dataAccordingColumns: any
    public matrix: {
        fullData: any
        subData?: any
        locations: {
            [key: Excel['Range']]: {
                header: {
                    [key: Excel['Cell']]: {
                        r: number
                        c: number
                        merge: XLSX.Range
                    }
                }
                columns: IColumn[]
                inTableColumns: IColumn[]
                data: {
                    [key: Excel['Cell']]: {
                        r: number
                        c: number
                        merge: XLSX.Range
                    }
                }
            }
        }
    }
    private options: Options

    constructor(worksheet: XLSX.WorkSheet, options: Options) {
        this.worksheet = worksheet

        this.options = options

        this.matrix = {
            subData: {},
            fullData: this.initializeMatrix(),
            locations: {},
        }

        this.matrix.locations = this.assignLocations()

        this.matrix.subData = this.assignSheetData()

        this.processCells()
        // this.applyMerges()
    }

    private initializeMatrix(): any[][] {
        const range = XLSX.utils.decode_range(this.worksheet['!ref'] || 'A1')
        return Array.from(
            { length: range.e.r - range.s.r },
            () => new Array(range.e.c - range.s.c)
        )
    }

    private processCells(): void {
        this.assignSheetData()
        this.assignTableData()
    }

    private assignLocations() {
        const locations = {}

        // if (structure.header) {
        //     const range = XLSX.utils.decode_range(structure.header)
        for (const [cellName] of Object.entries(this.worksheet)) {
            if (cellName.includes('!')) continue

            const { r: row, c: column } = XLSX.utils.decode_cell(cellName)
            const cellAddress = XLSX.utils.decode_cell(cellName)
            const merge = this.assignMerges(cellName)

            for (const structure of this.options.structures) {
                const key = structure.header ?? structure.data

                if (!key) continue

                if (!locations[key]) {
                    locations[key] = {
                        header: {},
                        data: {},
                        inTableColumns: [],
                    }
                }

                const structureHeaderAddress = XLSX.utils.decode_range(
                    structure.header ?? structure.data
                )
                const structureDataAddress = XLSX.utils.decode_range(
                    structure.data
                )

                const headersInRange =
                    structureHeaderAddress.s.c <= cellAddress.c &&
                    structureHeaderAddress.s.r <= cellAddress.r &&
                    structureHeaderAddress.e.c >= cellAddress.c &&
                    structureHeaderAddress.e.r >= cellAddress.r

                if (headersInRange) {
                    locations[key].header[cellName] = {
                        r: row,
                        c: column,
                        ...(merge && { merge }),
                    }
                }

                if (structureHeaderAddress == structureDataAddress) continue

                // let dataInRange

                if (isRange(structure.data)) {
                    const dataInRange =
                        structureDataAddress.s.c <= cellAddress.c &&
                        structureDataAddress.s.r <= cellAddress.r &&
                        structureDataAddress.e.c >= cellAddress.c &&
                        structureDataAddress.e.r >= cellAddress.r

                    if (dataInRange) {
                        locations[key].data[cellName] = {
                            r: row,
                            c: column,
                            ...(merge && { merge }),
                        }
                    }
                } else {
                    const dataInRange =
                        structureDataAddress.s.c <= cellAddress.c &&
                        structureDataAddress.s.r <= cellAddress.r &&
                        structureHeaderAddress.e.c >= cellAddress.c

                    if (dataInRange) {
                        locations[key].data[cellName] = {
                            r: row,
                            c: column,
                            ...(merge && { merge }),
                        }
                    }
                }

                if (locations[key].inTableColumns.length <= 0) {
                    locations[key].inTableColumns = structure.columns
                }
            }
        }

        return locations
    }

    private assignMerges(cellName) {
        if (!this.worksheet['!merges']) return undefined

        for (const merge of this.worksheet['!merges']) {
            const { s, e } = merge // s: inicio, e: fin del merge
            const location = XLSX.utils.decode_cell(cellName)
            // r: fila, c: columna
            if (location?.r === s.r && location?.c === s.c) {
                return { s, e }
            }
        }

        return undefined
    }

    private assignSheetData() {
        let resultHeader = []
        const rangeGroup = {}
        let rowHeaderGroup = []
        let rowDataGroup = []
        const colHeaderGroup = []
        const parentHeaderMap = {}

        for (const [
            rangeName,
            { header, data, inTableColumns },
        ] of Object.entries(this.matrix.locations)) {
            for (const [cell, location] of Object.entries(header)) {
                if (!header) continue // Ignorar valores vacíos

                const obj = { cell, location }

                if (!this.worksheet[cell].v) continue

                // Si la celda es parte de un merge, establecer el padre
                if (location.merge) {
                    parentHeaderMap[cell] = { cell, merge: location.merge } // Guardar como posible padre
                }

                for (const [
                    parentCell,
                    { c: parentC, r: parentR },
                ] of Object.entries(header)) {
                    if (!this.worksheet[parentCell].v) continue

                    const { s, e } = header[parentCell].merge || {}
                    const { r, c } = location

                    const inRange = s && e && r >= e.r && c >= s.c && c <= e.c

                    const inColumn = r >= parentR && c == parentC

                    if (inRange && parentCell != cell) {
                        obj['parent'] = parentCell
                    } else if (inColumn && parentCell != cell) {
                        obj['parent'] = parentCell
                    }

                    const matchedColumn = inTableColumns.find(
                        (column) => column.header === this.worksheet[cell].v
                    )

                    if (matchedColumn) {
                        const { header: headerColumn, field } = matchedColumn
                        // Usar headerColumn y field como necesites
                        rowHeaderGroup[location.r] = {
                            ...rowHeaderGroup[location.r],
                            [obj.cell]: {
                                type: 'text',
                                width: '5rem',
                                text_header: 'center',
                                field: cell + '/' + headerColumn + '/' + field,
                                header: this.worksheet[obj.cell].v,
                                text: 'center',
                            },
                        }
                    } else {
                        rowHeaderGroup[location.r] = {
                            ...rowHeaderGroup[location.r],
                            [obj.cell]: {
                                type: 'text',
                                width: '5rem',
                                text_header: 'center',
                                field: cell + '/' + this.worksheet[cell].v,
                                header: this.worksheet[obj.cell].v,
                                text: 'center',
                            },
                        }
                    }
                }

                resultHeader.push(obj)
            }

            console.log('result')
            console.log(resultHeader)

            const rowHeadersInData: typeof resultHeader = Object.values(
                resultHeader.reduce((acc, item) => {
                    const col: any = item.location.c
                    if (!acc[col] || item.location.r > acc[col].location.r) {
                        acc[col] = item
                    }
                    return acc
                }, {})
            )

            const columns = rowHeadersInData.map((header) => {
                if (header.cell === 'F12') {
                    console.log('header.cell')
                    console.log(header.cell)
                    console.log(this.worksheet[header.cell])
                }

                const matchedColumn = inTableColumns.find(
                    (column) => column.header === this.worksheet[header.cell].v
                )

                if (matchedColumn) {
                    const { header: headerColumn, field } = matchedColumn
                    // Usar headerColumn y field como necesites
                    return {
                        type: 'text',
                        width: '5rem',
                        text_header: 'center',
                        field: header.cell + '/' + headerColumn + '/' + field,
                        header: this.worksheet[header.cell].v,
                        text: 'center',
                    }
                } else {
                    return {
                        type: 'text',
                        width: '5rem',
                        text_header: 'center',
                        field:
                            header.cell + '/' + this.worksheet[header.cell].v,
                        header: this.worksheet[header.cell].v,
                        text: 'center',
                    }
                }
            })

            for (const [, currCol] of Object.entries(resultHeader)) {
                let colspan = 0

                for (const [, col] of Object.entries(resultHeader)) {
                    if (col.parent && currCol.cell == col.parent) {
                        colspan++
                    }

                    if (currCol.parent) {
                        colHeaderGroup[currCol.location.c] = {
                            ...colHeaderGroup[currCol.location.c],
                            [currCol.cell]: {},
                            [currCol.parent]: {},
                        }
                    } else {
                        colHeaderGroup[currCol.location.c] = {
                            ...colHeaderGroup[currCol.location.c],
                            [currCol.cell]: {},
                        }
                    }
                }

                colspan = colspan > 0 ? colspan : 1

                rowHeaderGroup[currCol.location.r][currCol.cell]['colspan'] =
                    colspan
            }

            console.log('rangeName')
            console.log(rangeName)

            for (const [currCell, currCol] of Object.entries(resultHeader)) {
                const range = XLSX.utils.decode_range(rangeName)

                const parent = currCol.parent
                    ? this.matrix.locations[rangeName].header[currCol?.parent]
                    : null

                let rowspan = range.e.r - range.s.r + 1

                let isParent = parent ? true : false

                for (const [cell, col] of Object.entries(resultHeader)) {
                    if (currCell === cell) continue

                    isParent = currCol.cell === col?.parent

                    const inColumn = col.location.c === currCol.location.c
                    const inRow = col.location.r != currCol.location.r

                    const inRangeColumnParent =
                        parent &&
                        parent.merge &&
                        (parent.merge.s.c <= col.location.c ||
                            parent.merge.e.c >= col.location.c)

                    if (!isParent) continue

                    if (inRangeColumnParent || (inColumn && inRow)) {
                        isParent = false
                        rowspan--
                    }
                }

                rowHeaderGroup[currCol.location.r][currCol.cell]['rowspan'] =
                    rowspan
            }

            for (const [, currCol] of Object.entries(rowHeadersInData)) {
                for (const [cell, location] of Object.entries(data)) {
                    if (location.c != currCol.location.c) continue

                    const matchedColumn = this.matrix.locations[
                        rangeName
                    ].inTableColumns.find(
                        (column) =>
                            column.header === this.worksheet[currCol.cell].v
                    )

                    if (matchedColumn) {
                        const { field } = matchedColumn
                        // Usar headerColumn y field como necesites
                        rowDataGroup[location.r] = {
                            ...rowDataGroup[location.r],
                            [currCol.cell +
                            '/' +
                            this.worksheet[currCol.cell].v +
                            '/' +
                            field]: this.worksheet[cell].v,
                        }
                    } else {
                        rowDataGroup[location.r] = {
                            ...rowDataGroup[location.r],
                            [currCol.cell +
                            '/' +
                            this.worksheet[currCol.cell].v]:
                                this.worksheet[cell].v,
                        }
                        // Manejar el caso en que no se encontró la columna
                    }
                }
            }

            rangeGroup[rangeName] = {
                header: rowHeaderGroup,
                columns: columns,
                data: rowDataGroup,
            }

            rowHeaderGroup = []
            resultHeader = []
            rowDataGroup = []
        }

        console.log('rangeGroup')

        console.log(rangeGroup)

        return rangeGroup
    }

    private assignTableData() {
        let mergedHeaders = new Map<number, any>() // { index: mergedHeader }
        let mergeData = new Map<number, any>()

        for (const [, structure] of Object.entries(this.options.structures)) {
            if (structure?.inTableColumn) {
                const subData = this.matrix.subData[structure.header]

                if (!subData || !Array.isArray(subData.header)) {
                    console.error(
                        `No se encontró 'header' en subData para '${structure.header}'`
                    )
                    continue
                }

                // Recorrer cada cabecera con su índice
                subData.header.forEach((header, index) => {
                    if (header instanceof Object) {
                        if (mergedHeaders.has(index)) {
                            // Si ya existe en el índice, fusionamos los objetos
                            mergedHeaders.set(index, {
                                ...mergedHeaders.get(index),
                                ...header,
                            })
                        } else {
                            // Si no existe, lo agregamos
                            mergedHeaders.set(index, header)
                        }
                    }
                })

                this.inTableColumns.push(
                    ...(Array.isArray(this.inTableColumns)
                        ? this.inTableColumns
                        : []),
                    ...subData.columns
                )

                subData.data.forEach((header, index) => {
                    if (header instanceof Object) {
                        if (mergeData.has(index)) {
                            // Si ya existe en el índice, fusionamos los objetos
                            mergeData.set(index, {
                                ...mergeData.get(index),
                                ...header,
                            })
                        } else {
                            // Si no existe, lo agregamos
                            mergeData.set(index, header)
                        }
                    }
                })

                this.inTableColumnsGroup = Array.from(mergedHeaders.entries())
                    .sort(([indexA], [indexB]) => indexA - indexB) // Ordenar por índice
                    .map(([, header]) => {
                        console.log('header')
                        const columns = []

                        for (const [, column] of Object.entries(header)) {
                            columns.push(column)
                        }

                        return columns
                    }) // Extraer solo los valores

                this.inTableData = Array.from(mergeData.entries())
                    .sort(([indexA], [indexB]) => indexA - indexB) // Ordenar por índice
                    .map(([, header]) => {
                        return header
                    }) // Extraer solo los valores
            } else {
                mergedHeaders = new Map<number, any>()
                mergeData = new Map<number, any>()

                const subData = this.matrix.subData[structure.header]

                if (!subData || !Array.isArray(subData.header)) {
                    console.error(
                        `No se encontró 'header' en subData para '${structure.header}'`
                    )
                    continue
                }

                // Recorrer cada cabecera con su índice
                subData.header.forEach((header, index) => {
                    if (header instanceof Object) {
                        if (mergedHeaders.has(index)) {
                            // Si ya existe en el índice, fusionamos los objetos
                            mergedHeaders.set(index, {
                                ...mergedHeaders.get(index),
                                ...header,
                            })
                        } else {
                            // Si no existe, lo agregamos
                            mergedHeaders.set(index, header)
                        }
                    }
                })

                subData.inTableColumns = []

                subData.inTableColumns.push(
                    ...(Array.isArray(subData.inTableColumns)
                        ? subData.inTableColumns
                        : []),
                    ...subData.columns
                )

                subData.data.forEach((header, index) => {
                    if (header instanceof Object) {
                        if (mergeData.has(index)) {
                            // Si ya existe en el índice, fusionamos los objetos
                            mergeData.set(index, {
                                ...mergeData.get(index),
                                ...header,
                            })
                        } else {
                            // Si no existe, lo agregamos
                            mergeData.set(index, header)
                        }
                    }
                })

                subData.inTableColumnsGroup = Array.from(
                    mergedHeaders.entries()
                )
                    .sort(([indexA], [indexB]) => indexA - indexB) // Ordenar por índice
                    .map(([, header]) => {
                        console.log('header')
                        const columns = []

                        for (const [, column] of Object.entries(header)) {
                            columns.push(column)
                        }

                        return columns
                    }) // Extraer solo los valores

                subData.inTableData = Array.from(mergeData.entries())
                    .sort(([indexA], [indexB]) => indexA - indexB) // Ordenar por índice
                    .map(([, header]) => {
                        return header
                    }) // Extraer solo los valores

                if (
                    subData.inTableColumns &&
                    subData.inTableColumnsGroup &&
                    subData.inTableData
                ) {
                    this.extraData.push([
                        subData.inTableColumnsGroup,
                        subData.inTableColumns,
                        subData.inTableData,
                    ])
                }
            }
        }
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
