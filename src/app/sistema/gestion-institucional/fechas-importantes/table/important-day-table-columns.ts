import { IColumn } from '@/app/shared/table-primeng/table-primeng.component'
import { FechasImportentesComponent } from '../fechas-importantes.component'
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
        field: 'cFechaImpNombre',
        header: 'Nombre',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'text',
        width: '5rem',
        field: 'dtFechaImpFecha',
        header: 'Fecha',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'text',
        width: '5rem',
        field: 'cFechaImpURLDocumento',
        header: 'Documento',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'estado-activo',
        width: '5rem',
        field: 'bFechaImpSeraLaborable',
        header: 'Sera laborable',
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

function accionBtnItem(this: FechasImportentesComponent, { accion, item }) {
    this.form.reset()
    this.importantDay.table.data.import = []

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

            const [day, month, year] = item.dtFechaImpFecha.split('/')

            this.form.patchValue({
                iFechaImpId: item.iFechaImpId,
                iTipoFerId: item.iTipoFerId,
                cFechaImpNombre: item.cFechaImpNombre,
                dtFechaImpFecha: new Date(`${month}/${day}/${year}`),
                cFechaImpURLDocumento: item.cFechaImpURLDocumento,
                bFechaImpSeraLaborable: Number(item.bFechaImpSeraLaborable),
                cFechaImpInfoAdicional: item.cFechaImpInfoAdicional,
            })
            break
        case 'eliminar':
            this.dialog.openConfirm({
                header: 'Eliminar Registro',
                accept: () => {
                    of(null)
                        .pipe(
                            switchMap(() =>
                                this.importantDayService.deleteFechasImportantes(
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
                                this.importantDayService.getFechasImportantes()
                            )
                        )
                        .subscribe({
                            next: (res: any) => {
                                this.importantDay.table.data.core =
                                    res.data.map((item) => ({
                                        ...item,
                                        dtFechaImpFecha:
                                            this.datePipe.transform(
                                                item.dtFechaImpFecha,
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
    }
}

function saveData(this: FechasImportentesComponent) {
    const data: any = {
        iTipoFerId: this.form.value.iTipoFerId,
        cFechaImpNombre: this.form.value.cFechaImpNombre,
        iCalAcadId: this.importantDay.calendar.iCalAcadId,
        dtFechaImpFecha: this.datePipe.transform(
            this.form.value.dtFechaImpFecha,
            'yyyy-MM-dd'
        ),
        bFechaImpSeraLaborable: Number(this.form.value.bFechaImpSeraLaborable),
        cFechaImpURLDocumento: this.form.value.cFechaImpURLDocumento,
        cFechaImpInfoAdicional: this.form.value.cFechaImpInfoAdicional,
    }

    if (!this.form.value.iFechaImpId) {
        of(null)
            .pipe(
                switchMap(() =>
                    this.importantDayService.insFechasImportantes(data)
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
                switchMap(() => this.importantDayService.getFechasImportantes())
            )
            .subscribe({
                next: (res: any) => {
                    this.importantDay.table.data.core = res.data.map(
                        (item) => ({
                            ...item,
                            dtFechaImpFecha: this.datePipe.transform(
                                item.dtFechaImpFecha,
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
        data.iFechaImpId = this.form.value.iFechaImpId

        of(null)
            .pipe(
                switchMap(() =>
                    this.importantDayService.updFechasImportantes(data)
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
                switchMap(() => this.importantDayService.getFechasImportantes())
            )
            .subscribe({
                next: (res: any) => {
                    this.importantDay.table.data.core = res.data.map(
                        (item) => ({
                            ...item,
                            dtFechaImpFecha: this.datePipe.transform(
                                item.dtFechaImpFecha,
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

export const importantDay = {
    columns,
    accionBtnItem,
    saveData,
    container,
}
