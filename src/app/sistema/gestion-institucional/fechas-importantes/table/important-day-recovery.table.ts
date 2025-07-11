import { IColumn } from '@/app/shared/table-primeng/table-primeng.component'
import { FechasImportentesComponent } from '../fechas-importantes.component'
import { of, switchMap, tap } from 'rxjs'
import { table } from '../actions/important-day-recovery.actions.table'

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
        type: 'actions',
        width: '3rem',
        field: 'actions',
        header: 'Acciones',
        text_header: 'center',
        text: 'center',
    },
]

function accionBtnItem(this: FechasImportentesComponent, { accion, item }) {
    this.forms.importantDayRecovery.reset()

    switch (accion) {
        case 'agregar':
            this.dialogs.importantDayRecovery = {
                title: 'Agregar fecha de recuperación',
                visible: true,
            }

            this.importantDay.typeActive = 3 /* FECHA DE RECUPERACIÓN */

            this.forms.importantDayRecovery.patchValue({
                iDepFechaImpId:
                    this.forms.importantDayRecovery.value.iFechaImpId,
            })
            break
        case 'editar':
            this.dialogs.importantDayRecovery = {
                title: 'Editar fecha de recuperación',
                visible: true,
            }

            this.importantDay.typeActive = 3 /* FECHA DE RECUPERACIÓN */

            this.forms.importantDayRecovery.patchValue({
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

                iDepFechaImpId:
                    this.forms.importantDayRecovery.value.iFechaImpId,
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
                                this.importantDayService.getDependenciaFechas(
                                    this.forms.importantDay.value
                                )
                            )
                        )
                        .subscribe({
                            next: (res: any) => {
                                const result = res.data[0]
                                const iDepFechaImpId =
                                    result && 'iFechaImpId' in result

                                if (iDepFechaImpId) {
                                    this.importantDay.table.data.recovery =
                                        res.data.map((item) => ({
                                            ...item,
                                            dtFechaImpFecha:
                                                this.datePipe.transform(
                                                    item.dtFechaImpFecha,
                                                    'dd/MM/yyyy'
                                                ),
                                        }))
                                } else {
                                    this.importantDay.table.data.recovery = []
                                }
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
        iTipoFerId: 3 /* FECHA DE RECUPERACIÓN */,
        cFechaImpNombre: this.forms.importantDayRecovery.value.cFechaImpNombre,
        iCalAcadId: this.importantDay.calendar?.iCalAcadId,
        dtFechaImpFecha: this.datePipe.transform(
            this.forms.importantDayRecovery.value.dtFechaImpFecha,
            'yyyy-MM-dd'
        ),
        bFechaImpSeraLaborable: Number(
            this.forms.importantDayRecovery.value.bFechaImpSeraLaborable
        ),
        cFechaImpURLDocumento:
            this.forms.importantDayRecovery.value.cFechaImpURLDocumento,
        cFechaImpInfoAdicional:
            this.forms.importantDayRecovery.value.cFechaImpInfoAdicional,
        iDepFechaImpId: this.forms.importantDay.value.iFechaImpId,
    }

    if (!this.forms.importantDayRecovery.value.iFechaImpId) {
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
                switchMap(() =>
                    this.importantDayService.getDependenciaFechas(
                        this.forms.importantDay.value
                    )
                )
            )
            .subscribe({
                next: (res: any) => {
                    const result = res.data[0]
                    const iDepFechaImpId = result && 'iFechaImpId' in result

                    if (iDepFechaImpId) {
                        this.importantDay.table.data.recovery = res.data.map(
                            (item) => ({
                                ...item,
                                dtFechaImpFecha: this.datePipe.transform(
                                    item.dtFechaImpFecha,
                                    'dd/MM/yyyy'
                                ),
                            })
                        )
                    }

                    this.dialogs.importantDayRecovery.visible = false
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
        data.iFechaImpId = this.forms.importantDayRecovery.value.iFechaImpId

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
                switchMap(() =>
                    this.importantDayService.getDependenciaFechas(
                        this.forms.importantDay.value
                    )
                )
            )
            .subscribe({
                next: (res: any) => {
                    const result = res.data[0]
                    const iDepFechaImpId = result && 'iFechaImpId' in result

                    if (iDepFechaImpId) {
                        this.importantDay.table.data.recovery = res.data.map(
                            (item) => ({
                                ...item,
                                dtFechaImpFecha: this.datePipe.transform(
                                    item.dtFechaImpFecha,
                                    'dd/MM/yyyy'
                                ),
                            })
                        )
                    }

                    this.dialogs.importantDayRecovery.visible = false
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

export const importantDayRecovery = {
    columns,
    accionBtnItem,
    saveData,
    table,
}
