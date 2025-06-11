import { IColumn } from '@/app/shared/table-primeng/table-primeng.component'
import { ConfigFechasComponent } from '../config-fechas.component'
import { SheetToMatrix } from '../../sincronizar-archivo/bulk-data-import/utils/sheetToMatrix'
import * as XLSX from 'xlsx'
import { container } from '../actions/actions.container'
import { of, switchMap, tap } from 'rxjs'

const columns: IColumn[] = [
    {
        type: 'item',
        width: '5rem',
        field: 'item',
        header: 'Item',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'text',
        width: '5rem',
        field: 'B2/cFeriadoNombre',
        header: 'Nombre',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'text',
        width: '5rem',
        field: 'C2/dtFeriado',
        header: 'Fecha',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'text',
        width: '5rem',
        field: 'E2/cDocumento',
        header: 'Documento',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'estado-activo',
        width: '5rem',
        field: 'D2/bFeriadoEsRecuperable',
        header: 'Es recuperable',
        text_header: 'center',
        text: 'center',
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

function accionBtnItem(this: ConfigFechasComponent, { accion, item }) {
    this.form.reset()
    this.nationalHolyday.table.data.import = []

    switch (accion) {
        case 'agregar':
            this.dialogs.nationalHoliday = {
                title: 'Agregar feriado nacional',
                visible: true,
            }
            console.log(item)

            break
        case 'editar':
            this.dialogs.nationalHoliday = {
                title: 'Editar feriado nacional',
                visible: true,
            }

            const [day, month, year] = item.dtFeriado.split('/')

            this.form.patchValue({
                iFeriadoId: item.iFeriadoId,
                cFeriadoNombre: item.cFeriadoNombre,
                iYAcadId: JSON.parse(localStorage.getItem('dremoiYAcadId')),
                dtFeriado: new Date(`${month}/${day}/${year}`),
                cDocumento: item.cDocumento,
                bFeriadoEsRecuperable: Number(item.bFeriadoEsRecuperable),
            })
            break
        case 'eliminar':
            this.dialog.openConfirm({
                header: 'Eliminar Registro',
                accept: () => {
                    of(null)
                        .pipe(
                            switchMap(() =>
                                this.nationalHolidayService.deleteFeriadosNacionalesXiFeriadoId(
                                    item
                                )
                            ),
                            tap((res: any) => {
                                this.messageService.add({
                                    severity: 'success',
                                    summary: 'Feriados nacionales',
                                    detail: res.message,
                                    life: 3000,
                                })
                            }),
                            switchMap(() =>
                                this.nationalHolidayService.getFeriadosNacionales()
                            )
                        )
                        .subscribe({
                            next: (res: any) => {
                                this.nationalHolyday.table.data.core =
                                    res.data.map((item) => ({
                                        ...item,
                                        dtFeriado: this.datePipe.transform(
                                            item.dtFeriado,
                                            'dd/MM/yyyy'
                                        ),
                                    }))
                            },
                            error: (error) => {
                                this.messageService.add({
                                    severity: 'error',
                                    summary: 'Feriados nacionales',
                                    detail:
                                        error ??
                                        'Ha ocurrido un error al eliminar el feriado nacional',
                                    life: 3000,
                                })
                            },
                        })
                },
            })

            break
        case 'sincronizar':
            this.dialog.openConfirm({
                header: 'Sincronizar feriados nacionales',
                accept: () => {
                    this.nationalHolidayService
                        .syncFeriadosNacionales()
                        .subscribe({
                            next: (res: any) => {
                                const result = res.data[0]
                                const isSuccess = result.Message === 'true'

                                this.messageService.add({
                                    severity: isSuccess ? 'success' : 'error',
                                    summary: 'Feriados nacionales',
                                    detail: result.resultado,
                                    life: 3000,
                                })
                            },
                            error: (error) => {
                                this.messageService.add({
                                    severity: 'error',
                                    summary: 'Feriados nacionales',
                                    detail:
                                        error ??
                                        'Ha ocurrido un error al eliminar el feriado nacional',
                                    life: 3000,
                                })
                            },
                        })
                },
            })
            break
        case 'importar':
            this.dialogs.importNationalHolyday = {
                title: 'Importar feriados nacionales',
                visible: true,
            }
            break
    }
}

function fileChange(this: ConfigFechasComponent, file: any) {
    this.nationalHolyday.table.data.import = []

    SheetToMatrix.resetInstance('hojaDeDatosAImportar')

    if (!file) return

    this.file = file

    const reader = new FileReader()

    reader.onload = (e: ProgressEvent<FileReader>) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })

        const firstSheetName = workbook.SheetNames[0]

        const worksheet =
            workbook.Sheets[this.collection?.sheetName ?? firstSheetName]

        const excelData = SheetToMatrix.setInstance(
            'hojaDeDatosAImportar',
            worksheet,
            {
                structures: this.collection.structures,
            }
        )

        console.log('excelData')
        console.log(excelData)

        // this.columnsGroup = excelData.inTableColumnsGroup
        // this.nationalHolyday.table.columns.import = excelData.inTableColumns
        this.nationalHolyday.table.data.import = excelData.inTableData
    }

    reader.readAsArrayBuffer(file)
}

function saveData(this: ConfigFechasComponent) {
    const data: any = {
        cFeriadoNombre: this.form.value.cFeriadoNombre,
        iYearId: JSON.parse(localStorage.getItem('dremoYear')),
        dtFeriado: this.datePipe.transform(
            this.form.value.dtFeriado,
            'yyyy-MM-dd'
        ),
        bFeriadoEsRecuperable: Number(this.form.value.bFeriadoEsRecuperable),
        cDocumento: this.form.value.cDocumento,
    }

    if (!this.form.value.iFeriadoId) {
        of(null)
            .pipe(
                switchMap(() =>
                    this.nationalHolidayService.insFeriadosNacionales(data)
                ),
                tap((res: any) => {
                    const result = res.data[0]
                    const isSuccess = result.Message === 'true'

                    this.messageService.add({
                        severity: isSuccess ? 'success' : 'warn',
                        summary: 'Feriados nacionales',
                        detail: result.resultado,
                        life: 3000,
                    })

                    this.dialogs.nationalHoliday.visible = !isSuccess
                }),
                switchMap(() =>
                    this.nationalHolidayService.getFeriadosNacionales()
                )
            )
            .subscribe({
                next: (res: any) => {
                    this.nationalHolyday.table.data.core = res.data.map(
                        (item) => ({
                            ...item,
                            dtFeriado: this.datePipe.transform(
                                item.dtFeriado,
                                'dd/MM/yyyy'
                            ),
                        })
                    )

                    const result = res.data[0]
                    console.log('result')
                    console.log(result)

                    if (result.Message) {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Feriados nacionales',
                            detail: result.resultado,
                            life: 3000,
                        })
                    }
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Feriados nacionales',
                        detail:
                            error ??
                            'Ha ocurrido un error al guardar los feriados nacionales',
                        life: 3000,
                    })
                },
            })
    } else {
        data.iFeriadoId = this.form.value.iFeriadoId

        of(null)
            .pipe(
                switchMap(() =>
                    this.nationalHolidayService.updFeriadosNacionales(data)
                ),
                tap((res: any) => {
                    const result = res.data[0]
                    const isSuccess = result.Message === 'true'

                    this.messageService.add({
                        severity: isSuccess ? 'success' : 'warn',
                        summary: 'Feriados nacionales',
                        detail: result.resultado,
                        life: 3000,
                    })

                    this.dialogs.nationalHoliday.visible = !isSuccess
                }),
                switchMap(() =>
                    this.nationalHolidayService.getFeriadosNacionales()
                )
            )
            .subscribe({
                next: (res: any) => {
                    this.nationalHolyday.table.data.core = res.data.map(
                        (item) => ({
                            ...item,
                            dtFeriado: this.datePipe.transform(
                                item.dtFeriado,
                                'dd/MM/yyyy'
                            ),
                        })
                    )

                    // const result = res.data[0]
                    // console.log('result')
                    // console.log(result)

                    // if (result.Message) {
                    //     this.messageService.add({
                    //         severity: 'error',
                    //         summary: 'Feriados nacionales',
                    //         detail: result.resultado,
                    //         life: 3000,
                    //     })
                    // }
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Feriados nacionales',
                        detail:
                            error ??
                            'Ha ocurrido un error al guardar los feriados nacionales',
                        life: 3000,
                    })
                },
            })
    }
}

function importData(this: ConfigFechasComponent) {
    this.nationalHolyday.import.loading = true
    const data = SheetToMatrix.getInstance('hojaDeDatosAImportar')
    data.setDataAccordingColumns()

    data.dataAccordingColumns = data.dataAccordingColumns.map((item) => {
        const [year, month, day] = item.dtFeriado.split('-')

        return {
            ...item,
            dtFeriado: this.datePipe.transform(
                new Date(`${month}-${day}-${year}`),
                'yyyy-MM-dd'
            ),
            iYearId: JSON.parse(localStorage.getItem('dremoYear')),
        }
    })

    if (data.dataAccordingColumns.length > 0) {
        of(null)
            .pipe(
                switchMap(() =>
                    this.nationalHolidayService.insFeriadosNacionalesMasivo(
                        data.dataAccordingColumns
                    )
                ),
                tap((res: any) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Feriados nacionales',
                        detail: res.message,
                        life: 3000,
                    })
                }),
                switchMap(() =>
                    this.nationalHolidayService.getFeriadosNacionales()
                )
            )
            .subscribe({
                next: (res: any) => {
                    this.nationalHolyday.table.data.core = res.data.map(
                        (item) => ({
                            ...item,
                            dtFeriado: this.datePipe.transform(
                                item.dtFeriado,
                                'dd/MM/yyyy'
                            ),
                        })
                    )

                    this.dialogs.importNationalHolyday.visible = false
                },
                error: (error) => {
                    this.nationalHolyday.import.loading = false

                    this.messageService.add({
                        severity: 'error',

                        summary: 'Feriados nacionales',
                        detail:
                            error ??
                            'Ha ocurrido un error al importar los feriados nacionales',
                        life: 3000,
                    })
                },
                complete: () => {
                    this.nationalHolyday.import.loading = false
                    this.file = undefined
                },
            })
    } else {
        this.nationalHolyday.import.loading = false
        this.messageService.add({
            severity: 'success',
            summary: 'Feriados nacionales',
            detail: 'Sin datos',
            life: 3000,
        })
    }
}

function syncData() {}

export const nationalHoliday = {
    columns,
    fileChange,
    accionBtnItem,
    saveData,
    importData,
    container,
    syncData,
}
