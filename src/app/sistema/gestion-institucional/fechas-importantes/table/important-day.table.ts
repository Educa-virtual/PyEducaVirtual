import { IColumn } from '@/app/shared/table-primeng/table-primeng.component'
import { FechasImportentesComponent } from '../fechas-importantes.component'
import { container } from '../actions/important-day.actions.container'
import { of, switchMap, tap } from 'rxjs'
import { table } from '../actions/important-day.actions.table'

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
        type: 'text',
        width: '5rem',
        field: 'observacion',
        header: 'Observación',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'actions',
        width: '3rem',
        field: 'actions',
        header: 'Acciones',
        text_header: 'center',
        text: 'right',
    },
]

function accionBtnItem(this: FechasImportentesComponent, { accion, item }) {
    this.forms.importantDay.reset()
    this.forms.importantDay.enable()
    this.importantDay.table.data.import = []
    1
    this.importantDay.typeActive = undefined /* SIN TIPO */

    switch (accion) {
        case 'agregar':
            this.dialogs.importantDay = {
                title: 'Agregar fecha importante',
                visible: true,
            }
            break
        case 'editar':
            this.dialogs.importantDay = {
                title: 'Editar fecha importante',
                visible: true,
            }

            this.forms.importantDay.patchValue({
                iFechaImpId: item.iFechaImpId,
                iTipoFerId: item.iTipoFerId,
                cFechaImpNombre: item.cFechaImpNombre,
                dtFechaImpFecha: new Date(
                    (() => {
                        const [day, month, year] =
                            item.dtFechaImpFecha.split('/')
                        return `${month}/${day}/${year}`
                    })()
                ),
                cFechaImpURLDocumento: item.cFechaImpURLDocumento,
                bFechaImpSeraLaborable: Number(item.bFechaImpSeraLaborable),
                cFechaImpInfoAdicional: item.cFechaImpInfoAdicional,
            })
            break
        case 'eliminar':
            this.dialog.openConfirm({
                header: `Eliminar fecha importante: ${item?.cFechaImpNombre}`,
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
                                    summary: 'Fechas importantes',
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
                                    summary: 'Fechas importantes',
                                    detail:
                                        error ??
                                        'Ha ocurrido un error al eliminar el fecha importante',
                                    life: 3000,
                                })
                            },
                        })
                },
            })

            break

        case 'mostrarFechaRecuperable':
            this.forms.importantDay.disable()
            this.importantDay.table.data.recovery = []

            this.dialogs.importantDaysRecovery = {
                title: 'Fechas de recuperación',
                visible: true,
            }

            this.forms.importantDay.patchValue({
                iFechaImpId: item.iFechaImpId,
                iTipoFerId: item.iTipoFerId,
                cFechaImpNombre: item.cFechaImpNombre,
                dtFechaImpFecha: new Date(
                    (() => {
                        const [day, month, year] =
                            item.dtFechaImpFecha.split('/')
                        return `${month}/${day}/${year}`
                    })()
                ),
                cFechaImpURLDocumento: item.cFechaImpURLDocumento,
                bFechaImpSeraLaborable: Number(item.bFechaImpSeraLaborable),
                cFechaImpInfoAdicional: item.cFechaImpInfoAdicional,
            })

            this.importantDayService
                .getDependenciaFechas(this.forms.importantDay.value)
                .subscribe({
                    next: (res: any) => {
                        const result = res.data[0]
                        const iDepFechaImpId = result && 'iFechaImpId' in result

                        if (iDepFechaImpId) {
                            this.importantDay.table.data.recovery =
                                res.data.map((item) => ({
                                    ...item,
                                    dtFechaImpFecha: this.datePipe.transform(
                                        item.dtFechaImpFecha,
                                        'dd/MM/yyyy'
                                    ),
                                }))
                        }
                    },
                })
            break
    }
}

function saveData(this: FechasImportentesComponent) {
    if (!this.importantDay.calendar?.iCalAcadId) {
        this.messageService.add({
            severity: 'warn',
            summary: 'Fechas importantes',
            detail: 'No se ha configurado del calendario académico',
            life: 3000,
        })

        return
    }

    const data: any = {
        iTipoFerId: 4 /* FECHA ESPECIAL IE */,
        cFechaImpNombre: this.forms.importantDay.value.cFechaImpNombre,
        iCalAcadId: this.importantDay.calendar?.iCalAcadId,
        dtFechaImpFecha: this.datePipe.transform(
            this.forms.importantDay.value.dtFechaImpFecha,
            'yyyy-MM-dd'
        ),
        bFechaImpSeraLaborable: Number(
            this.forms.importantDay.value.bFechaImpSeraLaborable
        ),
        cFechaImpURLDocumento:
            this.forms.importantDay.value.cFechaImpURLDocumento,
        cFechaImpInfoAdicional:
            this.forms.importantDay.value.cFechaImpInfoAdicional,
    }

    if (!this.forms.importantDay.value.iFechaImpId) {
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
                        summary: 'Fechas importantes',
                        detail: result.resultado,
                        life: 3000,
                    })

                    this.dialogs.importantDay.visible = !isSuccess
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

                    if (result.Message) {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Fechas importantes',
                            detail: result.resultado,
                            life: 3000,
                        })
                    }
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Fechas importantes',
                        detail:
                            error ??
                            'Ha ocurrido un error al guardar los fecha importante|',
                        life: 3000,
                    })
                },
            })
    } else {
        data.iFechaImpId = this.forms.importantDay.value.iFechaImpId

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
                        summary: 'Fechas importantes',
                        detail: result.resultado,
                        life: 3000,
                    })

                    this.dialogs.importantDay.visible = !isSuccess
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
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Fechas importantes',
                        detail:
                            error ??
                            'Ha ocurrido un error al guardar los fecha importante',
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
    table,
}
