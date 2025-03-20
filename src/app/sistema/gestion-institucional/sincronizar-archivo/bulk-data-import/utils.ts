import * as XLSX from 'xlsx'
import { Excel } from './types/excel'

interface Options {
    structures: {
        header?: Excel['Range']
        data: Excel['Cell']
    }[]
}

export class SheetToMatrix {
    private worksheet: XLSX.WorkSheet
    private matrix: {
        fullData: any
        subData?: any
        locations: {
            [key: Excel['Cell']]: { r: number; c: number; merge: XLSX.Range }
        }
    }
    private options: Options

    constructor(worksheet: XLSX.WorkSheet, options: Options) {
        this.worksheet = worksheet

        this.options = options

        this.matrix = {
            fullData: this.initializeMatrix(),
            locations: this.assignLocations(),
        }

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
            // Validar antes de agregar
            acc[header] = {}
            return acc
        }, {})
    }

    private processCells(): void {
        for (const cellName of Object.keys(this.matrix['locations'])) {
            this.assignMerges(cellName)
        }
    }

    private assignLocations() {
        const Locations = {
            headers: {},
            data: {},
        }

        // if (structure.header) {
        //     const range = XLSX.utils.decode_range(structure.header)
        for (const [cellName] of Object.entries(this.worksheet)) {
            for (const structure of this.options.structures) {
                // }

                console.log('range')
                console.log(structure)
                // console.log(range)

                if (cellName.includes('!')) continue
                const { r: row, c: column } = XLSX.utils.decode_cell(cellName)
                Locations[cellName] = { r: row, c: column }
            }
        }

        return Locations
    }

    private assignMerges(cellName) {
        for (const merge of this.worksheet['!merges']) {
            const { s, e } = merge // s: inicio, e: fin del merge

            const location = this.matrix.locations[cellName]

            // r: fila, c: columna
            if (location?.r === s.r && location?.c === s.c) {
                this.matrix.locations[cellName]['merge'] = { s, e }
            }
        }
    }
}
