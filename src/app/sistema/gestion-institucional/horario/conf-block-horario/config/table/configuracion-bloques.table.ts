import { IColumn } from '@/app/shared/table-primeng/table-primeng.component'
import { actions } from '../actions/configuracion-bloques.actions.table'
import { ConfBlockHorarioComponent } from '../../conf-block-horario.component'
import { container } from '../actions/configuracion-bloques.actions.container'
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
        field: 'cDescripcion',
        header: 'Descripción',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'text',
        width: '5rem',
        field: 'dInicio',
        header: 'Hora de inicio',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'text',
        width: '5rem',
        field: 'dFin',
        header: 'Hora de fin',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'text',
        width: '5rem',
        field: 'iNumBloque',
        header: 'N° de bloques',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'text',
        width: '5rem',
        field: 'iBloqueInter',
        header: 'Hora académica',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'estado-activo',
        width: '5rem',
        field: 'iEstado',
        header: 'Estado',
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
    this.forms.configuracionBloque.enable()
    this.forms.configuracionBloque.reset()

    switch (accion) {
        case 'agregar':
            this.dialogs.configuracionBloque = {
                title: 'Agregar configuración de bloque horario',
                visible: true,
            }
            break

        case 'editar':
            this.dialogs.configuracionBloque = {
                title: 'Editar configuración de bloque horario',
                visible: true,
            }

            this.forms.configuracionBloque.patchValue({
                iConfBloqueId: item.iConfBloqueId,
                cDescripcion: item.cDescripcion,
                iNumBloque: item.iNumBloque,
                iBloqueInter: item.iBloqueInter,
                dInicio: (() => {
                    const [hours, minutes] = item.dInicio.split(':')
                    const date = new Date()
                    date.setHours(Number(hours), Number(minutes), 0, 0) // h, m, s, ms
                    return date
                })(),
                dFin: (() => {
                    const [hours, minutes] = item.dFin.split(':')
                    const date = new Date()
                    date.setHours(Number(hours), Number(minutes), 0, 0) // h, m, s, ms
                    return date
                })(),
            })

            break

        case 'eliminar':
            this.dialogConfirm.openConfirm({
                header: `¿Esta seguro de eliminar la configuración de bloque horario: ${item.cDescripcion}?`,
                accept: () => {
                    of(null)
                        .pipe(
                            switchMap(() =>
                                this.configuracionBloquesService.deleteConfiguracionBloque(
                                    item.iConfBloqueId
                                )
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
                            }),
                            switchMap(() =>
                                this.configuracionBloquesService.getConfiguracionBloques()
                            )
                        )
                        .subscribe({
                            next: (res: any) => {
                                this.configuracionBloques.table.data =
                                    res.data.map((item) => ({
                                        ...item,
                                        dInicio: this.datePipe.transform(
                                            item.dInicio,
                                            'HH:mm'
                                        ),
                                        dFin: this.datePipe.transform(
                                            item.dFin,
                                            'HH:mm'
                                        ),
                                    }))
                            },
                        })
                },
            })
            break
        case 'gestionarDistribucionBloques':
            this.dialogs.distribucionBloques = {
                title: 'Gestionar distribución de bloques',
                visible: true,
            }

            this.forms.configuracionBloque.disable()

            this.forms.configuracionBloque.patchValue({
                iConfBloqueId: item.iConfBloqueId,
                cDescripcion: item.cDescripcion,
                iNumBloque: item.iNumBloque,
                iBloqueInter: item.iBloqueInter,
                dInicio: new Date(
                    (() => {
                        const [hours, minutes] = item.dInicio.split(':')
                        const date = new Date()
                        date.setHours(Number(hours), Number(minutes), 0, 0) // h, m, s, ms
                        return date
                    })()
                ),
                dFin: new Date(
                    (() => {
                        const [hours, minutes] = item.dFin.split(':')
                        const date = new Date()
                        date.setHours(Number(hours), Number(minutes), 0, 0) // h, m, s, ms
                        return date
                    })()
                ),
            })

            this.bloqueService.getBloques(item.iConfBloqueId).subscribe({
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

            break

        case 'asignarDistribucionBloques':
            this.dialogs.asignacionConfiguracionBloque = {
                title: 'Asignación de configuración de bloques',
                visible: true,
            }

            this.forms.configuracionBloque.patchValue({
                iConfBloqueId: item.iConfBloqueId,
                cDescripcion: item.cDescripcion,
                iNumBloque: item.iNumBloque,
                iBloqueInter: item.iBloqueInter,
                dInicio: new Date(
                    (() => {
                        const [hours, minutes] = item.dInicio.split(':')
                        const date = new Date()
                        date.setHours(Number(hours), Number(minutes), 0, 0) // h, m, s, ms
                        return date
                    })()
                ),
                dFin: new Date(
                    (() => {
                        const [hours, minutes] = item.dFin.split(':')
                        const date = new Date()
                        date.setHours(Number(hours), Number(minutes), 0, 0) // h, m, s, ms
                        return date
                    })()
                ),
            })

            this.bloqueService.getBloques(item.iConfBloqueId).subscribe({
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

            break
    }
}

function saveData(this: ConfBlockHorarioComponent) {
    const data: any = {
        cDescripcion: this.forms.configuracionBloque.value.cDescripcion,
        iNumBloque: this.forms.configuracionBloque.value.iNumBloque,
        iBloqueInter: this.forms.configuracionBloque.value.iBloqueInter,
        dInicio: this.datePipe.transform(
            this.forms.configuracionBloque.value.dInicio,
            'yyyy-MM-ddTHH:mm:ss'
        ),
        dFin: this.datePipe.transform(
            this.forms.configuracionBloque.value.dFin,
            'yyyy-MM-ddTHH:mm:ss'
        ),
    }

    if (!this.forms.configuracionBloque.value.iConfBloqueId) {
        of(null)
            .pipe(
                switchMap(() =>
                    this.configuracionBloquesService.insConfiguracionBloque(
                        data
                    )
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

                    this.dialogs.configuracionBloque.visible = !isSuccess
                }),
                switchMap(() =>
                    this.configuracionBloquesService.getConfiguracionBloques()
                )
            )
            .subscribe({
                next: (res: any) => {
                    this.configuracionBloques.table.data = res.data.map(
                        (item) => ({
                            ...item,
                            dInicio: this.datePipe.transform(
                                (() => {
                                    const [hours, minutes] =
                                        item.dInicio.split(':')
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
                            dFin: this.datePipe.transform(
                                (() => {
                                    const [hours, minutes] =
                                        item.dFin.split(':')
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
    } else {
        data.iConfBloqueId = this.forms.configuracionBloque.value.iConfBloqueId

        of(null)
            .pipe(
                switchMap(() =>
                    this.configuracionBloquesService.updConfiguracionBloque(
                        data
                    )
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

                    this.dialogs.configuracionBloque.visible = !isSuccess
                }),
                switchMap(() =>
                    this.configuracionBloquesService.getConfiguracionBloques()
                )
            )
            .subscribe({
                next: (res: any) => {
                    this.configuracionBloques.table.data = res.data.map(
                        (item) => ({
                            ...item,
                            dInicio: this.datePipe.transform(
                                (() => {
                                    const [hours, minutes] =
                                        item.dInicio.split(':')
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
                            dFin: this.datePipe.transform(
                                (() => {
                                    const [hours, minutes] =
                                        item.dFin.split(':')
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
    }
}

export const configuracionBloques = {
    accionBtnItem,
    table: {
        columns,
        data: [],
        actions: actions,
    },
    container,
    saveData,
}
