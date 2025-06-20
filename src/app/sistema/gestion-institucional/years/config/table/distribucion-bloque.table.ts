import { IColumn } from '@/app/shared/table-primeng/table-primeng.component'
import { actions } from '../actions/distribucion-bloques.actions.table'
import { YearsComponent } from '../../years.component'
import { of, switchMap, takeWhile, tap } from 'rxjs'
import { tiposDistribucion } from '../service/distribucion-bloques.service'

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
        field: 'cBloqueNombre',
        header: 'Bloque',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'text',
        width: '5rem',
        field: 'dtInicioBloque',
        header: 'Fecha inicio',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'text',
        width: '5rem',
        field: 'dtFinBloque',
        header: 'Fecha fin',
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

function accionBtnItem(this: YearsComponent, { accion, item }) {
    this.forms.distribucionBloque.reset()
    this.forms.distribucionBloque.enable()

    switch (accion) {
        case 'agregar':
            this.dialogs.distribucionBloque = {
                title: 'Agregar semana lectiva',
                visible: true,
            }

            this.forms.distribucionBloque.patchValue({
                iEstado: true,
            })

            break

        case 'ver':
            this.dialogs.distribucionBloque = {
                title: 'Información del bloque',
                visible: true,
            }

            this.forms.distribucionBloque.disable()

            this.forms.distribucionBloque.patchValue({
                iDistribucionBloqueId: item.iDistribucionBloqueId,
                iYAcadId: item.iYAcadId,
                iTipoDistribucionId: Number(item.iTipoDistribucionId),
                iSesionId: item.iSesionId,
                dtInicioBloque: new Date(
                    (() => {
                        const [day, month, year] =
                            item.dtInicioBloque.split('/')
                        return `${month}/${day}/${year}`
                    })()
                ),
                dtFinBloque: new Date(
                    (() => {
                        const [day, month, year] = item.dtFinBloque.split('/')
                        return `${month}/${day}/${year}`
                    })()
                ),
                iEstado: item.iEstado,
            })

            break
        case 'editar':
            this.dialogs.distribucionBloque = {
                title: 'Editar bloque',
                visible: true,
            }

            this.forms.distribucionBloque.patchValue({
                iDistribucionBloqueId: item.iDistribucionBloqueId,
                iYAcadId: item.iYAcadId,
                iTipoDistribucionId: Number(item.iTipoDistribucionId),
                iSesionId: item.iSesionId,
                dtInicioBloque: new Date(
                    (() => {
                        const [day, month, year] =
                            item.dtInicioBloque.split('/')
                        return `${month}/${day}/${year}`
                    })()
                ),
                dtFinBloque: new Date(
                    (() => {
                        const [day, month, year] = item.dtFinBloque.split('/')
                        return `${month}/${day}/${year}`
                    })()
                ),
                iEstado: item.iEstado,
            })

            break
        case 'eliminar':
            console.log('eliminar')
            console.log(item)

            this.dialogConfirm.openConfirm({
                header: `¿Esta seguro de eliminar el bloque: ${item.cBloqueNombre} (${item.dtInicioBloque} - ${item.dtFinBloque})?`,
                accept: () => {
                    of(null)
                        .pipe(
                            switchMap(() =>
                                this.distribucionBloquesService.deleteDistribucionBloque(
                                    item.iDistribucionBloqueId
                                )
                            ),
                            tap((res: any) => {
                                const result = res.data[0]
                                const isSuccess = result.Message === 'true'

                                this.messageService.add({
                                    severity: isSuccess ? 'success' : 'warn',
                                    summary: 'Año académico',
                                    detail: result.resultado,
                                    life: 3000,
                                })
                            }),
                            takeWhile(
                                (res: any) => res?.data?.[0]?.Message == 'true'
                            ),
                            switchMap(() =>
                                this.distribucionBloquesService.getDistribucionBloques(
                                    this.forms.distribucionBloque.value
                                        .iDistribucionBloqueId
                                )
                            )
                        )
                        .subscribe({
                            next: (res: any) => {
                                this.distribucionBloques.table.data =
                                    res.data.map((item) => {
                                        const tipoDistribucion =
                                            tiposDistribucion.find(
                                                (tipo) =>
                                                    tipo.iTipoDistribucionId ==
                                                    item.iTipoDistribucionId
                                            )

                                        return {
                                            ...item,
                                            cBloqueNombre:
                                                tipoDistribucion.cBloqueNombre,
                                            dtInicioBloque:
                                                this.datePipe.transform(
                                                    item.dtInicioBloque,
                                                    'dd/MM/yyyy'
                                                ),
                                            dtFinBloque:
                                                this.datePipe.transform(
                                                    item.dtFinBloque,
                                                    'dd/MM/yyyy'
                                                ),
                                        }
                                    })
                            },
                        })
                },
            })
            break
    }
}

function saveData(this: YearsComponent) {
    const data: any = {
        iTipoDistribucionId:
            this.forms.distribucionBloque.value.iTipoDistribucionId,
        iYearId: this.forms.year.value.iYearId,
        iSesionId: JSON.parse(localStorage.getItem('dremoPerfil')).iCredId,
        dtInicioBloque: this.datePipe.transform(
            this.forms.distribucionBloque.value.dtInicioBloque,
            'yyyy-MM-dd'
        ),
        dtFinBloque: this.datePipe.transform(
            this.forms.distribucionBloque.value.dtFinBloque,
            'yyyy-MM-dd'
        ),
        iEstado: Number(this.forms.distribucionBloque.value.iEstado),
    }

    if (!this.forms.distribucionBloque.value.iDistribucionBloqueId) {
        of(null)
            .pipe(
                switchMap(() =>
                    this.distribucionBloquesService.insDistribucionBloques(data)
                ),
                tap((res: any) => {
                    const result = res.data[0]

                    const isSuccess = result.Message == 'true'

                    this.messageService.add({
                        severity: isSuccess ? 'success' : 'warn',
                        summary: 'Distribución de bloque',
                        detail: result.resultado,
                        life: 3000,
                    })

                    this.dialogs.distribucionBloque.visible = !isSuccess
                }),
                switchMap(() =>
                    this.distribucionBloquesService.getDistribucionBloques(
                        this.forms.year.value.iYearId
                    )
                )
            )
            .subscribe({
                next: (res: any) => {
                    this.distribucionBloques.table.data = res.data.map(
                        (item) => {
                            const tipoDistribucion = tiposDistribucion.find(
                                (tipo) =>
                                    tipo.iTipoDistribucionId ==
                                    item.iTipoDistribucionId
                            )

                            return {
                                ...item,
                                cBloqueNombre: tipoDistribucion.cBloqueNombre,
                                dtInicioBloque: this.datePipe.transform(
                                    item.dtInicioBloque,
                                    'dd/MM/yyyy'
                                ),
                                dtFinBloque: this.datePipe.transform(
                                    item.dtFinBloque,
                                    'dd/MM/yyyy'
                                ),
                            }
                        }
                    )
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Distribución de bloque',
                        detail:
                            error ??
                            'Ha ocurrido un error al guardar los feriados nacionales',
                        life: 3000,
                    })
                },
            })
    } else {
        data.iDistribucionBloqueId =
            this.forms.distribucionBloque.value.iDistribucionBloqueId

        of(null)
            .pipe(
                switchMap(() =>
                    this.distribucionBloquesService.updDistribucionBloque(data)
                ),
                tap((res: any) => {
                    const result = res.data[0]
                    const isSuccess = result.Message === 'true'

                    this.messageService.add({
                        severity: isSuccess ? 'success' : 'warn',
                        summary: 'Distribución de bloque',
                        detail: result.resultado,
                        life: 3000,
                    })

                    this.dialogs.distribucionBloque.visible = !isSuccess
                }),
                switchMap(() =>
                    this.distribucionBloquesService.getDistribucionBloques(
                        this.forms.year.value.iYearId
                    )
                )
            )
            .subscribe({
                next: (res: any) => {
                    this.distribucionBloques.table.data = res.data.map(
                        (item) => {
                            const tipoDistribucion = tiposDistribucion.find(
                                (tipo) =>
                                    tipo.iTipoDistribucionId ==
                                    item.iTipoDistribucionId
                            )

                            return {
                                ...item,
                                cBloqueNombre: tipoDistribucion.cBloqueNombre,
                                dtInicioBloque: this.datePipe.transform(
                                    item.dtInicioBloque,
                                    'dd/MM/yyyy'
                                ),
                                dtFinBloque: this.datePipe.transform(
                                    item.dtFinBloque,
                                    'dd/MM/yyyy'
                                ),
                            }
                        }
                    )
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Distribución de bloque',
                        detail:
                            error ??
                            'Ha ocurrido un error al guardar los feriados nacionales',
                        life: 3000,
                    })
                },
            })
    }
}

export const distribucionBloques = {
    accionBtnItem,
    table: {
        columns,
        actions,
    },
    saveData,
}
