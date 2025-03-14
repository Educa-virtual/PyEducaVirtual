import * as XLSX from 'xlsx'

export class SheetToMatrix {
    private worksheet: XLSX.WorkSheet
    private matrix: { [key: string]: any } = {}

    private matrices: { [key: string]: any } = {}

    constructor(worksheet: XLSX.WorkSheet, cellGuide: string[] = []) {
        this.worksheet = worksheet
        this.matrix['fullData'] = this.initializeMatrix()
        this.matrix['subData'] = this.initializeMatrices(cellGuide)

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

    private initializeMatrices(cellGuide: string[]): Record<string, any> {
        return cellGuide.reduce((acc, header) => {
            if (this.isValidKey(header)) {
                // Validar antes de agregar
                acc[header] = {}
            }
            return acc
        }, {})
    }

    private processCells(): void {
        for (const [cellName] of Object.entries(this.worksheet)) {
            const { r: row, c: column } = XLSX.utils.decode_cell(cellName)
            if (!this.isValidKey(cellName)) continue
            this.assignLocations(cellName, row, column)
            // this.assignCellValue(row, column, cell.v)
            // this.assignMatrix()
            // this.assignLocationsMatrices(cellName, row, column)
        }

        for (const cellName of Object.keys(this.matrix['locations'])) {
            this.assignMerges(cellName)
        }

        this.identifierHeader()
    }

    private identifierHeader() {
        if (!this.matrix['locations']) return

        const groupColumns = this.groupByColumn(this.matrix['locations'])
        console.log('groupColumns', groupColumns)

        // Obtener los headers actuales
        const matrixCurrent: any = {
            cellCurr: '',
            mergeCurr: {},
            guide: {
                name: '',
            },
            subHeaders: {},
        }

        const matrices = []

        let addedMatrix = true

        for (const colIndex in groupColumns) {
            const column = groupColumns[colIndex]

            let addedStartHeaderRow = false
            let expandHeader = true

            for (const cellName in column) {
                const cellRow = this.matrix['locations'][cellName].r
                const cellCol = this.matrix['locations'][cellName].c

                if (!addedStartHeaderRow) {
                    this.matrix['subData'][cellName] = {}
                    addedStartHeaderRow = true

                    matrixCurrent.cellCurr = cellName
                    matrixCurrent.merge =
                        this.matrix['locations'][cellName]?.merge || {}

                    if (addedMatrix) {
                        matrixCurrent.guide = cellName
                        addedMatrix = false
                        matrices.push(matrixCurrent)
                        console.log(matrices)
                    }

                    this.matrix['subData'][cellName].ref = {
                        header: {
                            s: {
                                c: cellCol,
                                r: cellRow,
                            },
                            e: {
                                c: cellCol,
                                r: cellRow,
                            },
                        },
                    }
                }

                if (
                    matrixCurrent &&
                    (!column[cellName].v ||
                        this.matrix['subData'][matrixCurrent.cellCurr]) &&
                    !expandHeader
                ) {
                    this.matrix['subData'][
                        matrixCurrent.cellCurr
                    ].ref.header.e = {
                        c: cellCol,
                        r: cellRow,
                    }

                    this.matrix['subData'][matrixCurrent.cellCurr].ref.data = {
                        s: {
                            c: cellCol,
                            r: cellRow + 1,
                        },
                        e: {
                            c: cellCol,
                            r: cellRow + 1,
                        },
                    }
                } else {
                    expandHeader = false
                }

                if (
                    !expandHeader &&
                    this.matrix['subData'][matrixCurrent.cellCurr].ref.data
                ) {
                    this.matrix['subData'][matrixCurrent.cellCurr].ref.data.e =
                        {
                            c: cellCol,
                            r: cellRow,
                        }
                }

                // if (!expandHeader) {
                //     'd'
                // }
            }

            // for (const cellName in column) {
            //     const headers = this.matrix['subData'] || {}
            //     let added = false

            //     for (header in headers) {
            //         if (
            //             this.matrix['locations'][header]?.c ===
            //             this.matrix['locations'][cellName]?.c
            //         ) {
            //             added = true
            //             break
            //         }

            //         // if (this.matrix['locations'][header]?.r === this.matrix['locations'][cellName]?.r) {
            //         //     rowHeader = true
            //         //     break
            //         // }
            //     }

            //     if (added) {
            //         this.matrix['subData'][header].data[cellName] = {}

            //     } else {
            //         header = cellName
            //         this.matrix['subData'][header] = { data: {}, headers: [] }
            //     }

            // }
        }
    }

    checkPattern() {}

    groupByColumn(
        obj: Record<string, { r: number; c: number }>
    ): Record<number, { [key: string]: { r: number; c: number; v: string } }> {
        const result: Record<
            number,
            { [key: string]: { r: number; c: number; v: string } }
        > = {}

        for (const key in obj) {
            const column = obj[key].c
            if (!result[column]) {
                result[column] = {}
            }
            result[column][key] = { ...obj[key], v: this.worksheet[key].v }
        }

        return result
    }

    private assignSubData() {}

    private assignLocations(
        cellName: string,
        row: number,
        column: number
    ): void {
        if (!this.matrix['locations']) {
            this.matrix['locations'] = {}
        }

        this.matrix['locations'][cellName] = { r: row, c: column }
    }

    private assignMerges(cellName) {
        for (const merge of this.worksheet['!merges']) {
            const { s, e } = merge // s: inicio, e: fin del merge

            const location = this.matrix['locations'][cellName]

            // r: fila, c: columna
            if (location?.r === s.r && location?.c === s.c) {
                this.matrix['locations'][cellName]['merge'] = { s, e }
            }
        }
    }

    private assignMatrix() {
        for (const matrix of Object.keys(this.matrices)) {
            if (!this.isValidKey(matrix)) continue

            console.log('matrix')
            console.log(this.matrices)
            console.log(matrix)

            this.matrices[matrix]['matrix'] = this.matrix
        }
    }

    private assignCellValue(row: number, column: number, value: any): void {
        if (this.matrix[row]) {
            this.matrix[row][column] = value
        }
    }

    private assignLocationsMatrices(
        cellName: string,
        row: number,
        column: number
    ): void {
        if (!this.matrices) return

        console.log('row')
        console.log(cellName)
        console.log(row)
        console.log([{ row: [].push(cellName) }])

        for (const header of Object.keys(this.matrices)) {
            if (!this.isValidKey(header)) {
                this.matrices[header] = `${header} Incorrect Key`
                continue
            }

            if (header === cellName) {
                this.matrices[cellName]['location'] = { row, column }
            }
        }
    }

    isValidKey(key: string) {
        return /^[A-Z]+\d+$/.test(key)
    }
}
