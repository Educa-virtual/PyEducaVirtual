import { IColumn } from '@/app/shared/table-primeng/table-primeng.component'
import { actions } from '../actions/bloques.actions.table'
import { ConfBlockHorarioComponent } from '../../conf-block-horario.component'
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
        field: 'tBloqueInicio',
        header: 'Hora inicio',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'text',
        width: '5rem',
        field: 'tBloqueFin',
        header: 'Hora de fin',
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

function accionBtnItem(this: ConfBlockHorarioComponent, { accion, item }) {
    this.forms.bloque.reset()

    switch (accion) {
        case 'agregar':
            this.dialogs.bloque = {
                title: 'Agregar bloque',
                visible: true,
            }
            break
        case 'editar':
            this.dialogs.bloque = {
                title: 'Editar bloque',
                visible: true,
            }

            this.forms.bloque.patchValue({
                iDetBloqueId: item.iDetBloqueId,
                iConfBloqueId: item.iConfBloqueId,
                tBloqueInicio: item.tBloqueInicio,
                tBloqueFin: item.tBloqueFin,
                cDetalle: item.cDetalle,
            })
            break
        case 'eliminar':
            this.dialogConfirm.openConfirm({
                header: `¿Esta seguro de eliminar el bloque: ${item.tBloqueInicio} - ${item.tBloqueFin} ?`,
                accept: () => {
                    of(null)
                        .pipe(
                            switchMap(() =>
                                this.bloqueService.deleteBloque(
                                    item.iDetBloqueId
                                )
                            ),
                            tap((res: any) => {
                                const result = res?.data?.[0]
                                const isSuccess = result?.Message === 'true'

                                this.messageService.add({
                                    severity: isSuccess ? 'success' : 'warn',
                                    summary: 'Fechas importantes',
                                    detail: result?.resultado,
                                    life: 3000,
                                })
                            }),
                            switchMap(() =>
                                this.bloqueService.getBloques(
                                    this.forms.configuracionBloque.value
                                        .iConfBloqueId
                                )
                            )
                        )
                        .subscribe({
                            next: (res: any) => {
                                this.bloques.table.data = res.data.map(
                                    (item) => ({
                                        ...item,
                                        tBloqueInicio: this.datePipe.transform(
                                            (() => {
                                                const [hours, minutes] =
                                                    item.tBloqueInicio.split(
                                                        ':'
                                                    )
                                                const date = new Date()
                                                date.setHours(
                                                    Number(hours),
                                                    Number(minutes),
                                                    0,
                                                    0
                                                ) // h, m, s, ms
                                                return date
                                            })(),
                                            'HH:mm'
                                        ),
                                        tBloqueFin: this.datePipe.transform(
                                            (() => {
                                                const [hours, minutes] =
                                                    item.tBloqueFin.split(':')
                                                const date = new Date()
                                                date.setHours(
                                                    Number(hours),
                                                    Number(minutes),
                                                    0,
                                                    0
                                                ) // h, m, s, ms
                                                return date
                                            })(),
                                            'HH:mm'
                                        ),
                                    })
                                )
                            },
                        })
                },
            })
            break
    }
}

function saveData(this: ConfBlockHorarioComponent) {
    const data: any = {
        iDetBloqueId: this.forms.bloque.value.iDetBloqueId,
        iConfBloqueId:
            this.forms.bloque.value.iConfBloqueId ??
            this.forms.configuracionBloque.value.iConfBloqueId,
        tBloqueInicio: this.datePipe.transform(
            this.forms.bloque.value.tBloqueInicio,
            'yyyy-MM-ddTHH:mm:ss'
        ),
        tBloqueFin: this.datePipe.transform(
            this.forms.bloque.value.tBloqueFin,
            'yyyy-MM-ddTHH:mm:ss'
        ),
        cDetalle: this.forms.bloque.value.cDetalle,
    }

    if (!this.forms.bloque.value.iDetBloqueId) {
        of(null)
            .pipe(
                switchMap(() => this.bloqueService.insBloque(data)),
                tap((res: any) => {
                    const result = res.data[0]
                    const isSuccess = result.Message === 'true'

                    this.messageService.add({
                        severity: isSuccess ? 'success' : 'warn',
                        summary: 'Fechas importantes',
                        detail: result.resultado,
                        life: 3000,
                    })

                    this.dialogs.bloque.visible = !isSuccess
                }),
                switchMap(() =>
                    this.bloqueService.getBloques(
                        this.forms.configuracionBloque.value.iConfBloqueId
                    )
                )
            )
            .subscribe({
                next: (res: any) => {
                    this.bloques.table.data = res.data.map((item) => ({
                        ...item,
                        tBloqueInicio: this.datePipe.transform(
                            (() => {
                                const [hours, minutes] =
                                    item.tBloqueInicio.split(':')
                                const date = new Date()
                                date.setHours(
                                    Number(hours),
                                    Number(minutes),
                                    0,
                                    0
                                ) // h, m, s, ms
                                return date
                            })(),
                            'HH:mm'
                        ),
                        tBloqueFin: this.datePipe.transform(
                            (() => {
                                const [hours, minutes] =
                                    item.tBloqueFin.split(':')
                                const date = new Date()
                                date.setHours(
                                    Number(hours),
                                    Number(minutes),
                                    0,
                                    0
                                ) // h, m, s, ms
                                return date
                            })(),
                            'HH:mm'
                        ),
                    }))
                },
            })
    } else {
        of(null)
            .pipe(
                switchMap(() => this.bloqueService.updBloque(data)),
                tap((res: any) => {
                    const result = res.data[0]
                    const isSuccess = result.Message === 'true'

                    this.messageService.add({
                        severity: isSuccess ? 'success' : 'warn',
                        summary: 'Fechas importantes',
                        detail: result.resultado,
                        life: 3000,
                    })
                }),
                switchMap(() =>
                    this.bloqueService.getBloques(
                        this.forms.configuracionBloque.value.iConfBloqueId
                    )
                )
            )
            .subscribe({
                next: (res: any) => {
                    this.bloques.table.data = res.data.map((item) => ({
                        ...item,
                        tBloqueInicio: this.datePipe.transform(
                            new Date(
                                (() => {
                                    const [hours, minutes] =
                                        item.tBloqueInicio.split(':')
                                    const date = new Date()
                                    date.setHours(
                                        Number(hours),
                                        Number(minutes),
                                        0,
                                        0
                                    ) // h, m, s, ms
                                    return date
                                })()
                            ),
                            'HH:mm'
                        ),
                        tBloqueFin: this.datePipe.transform(
                            new Date(
                                (() => {
                                    const [hours, minutes] =
                                        item.tBloqueFin.split(':')
                                    const date = new Date()
                                    date.setHours(
                                        Number(hours),
                                        Number(minutes),
                                        0,
                                        0
                                    ) // h, m, s, ms
                                    return date
                                })()
                            ),
                            'HH:mm'
                        ),
                    }))
                },
            })
    }
}

export const bloques = {
    accionBtnItem,
    table: {
        columns,
        columnsWithoutActions: columns,
        data: [],
        actions,
    },
    saveData,
}
