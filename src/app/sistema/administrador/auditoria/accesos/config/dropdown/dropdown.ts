import {
    accesosAutorizadosColumns,
    accesosFallidosColumns,
    auditoriaColumns,
    auditoriaMiddlewareColumns,
} from '../table/config'
import { DatePipe } from '@angular/common'
export const optionsDropdownConfig = [
    {
        label: 'Accesos autorizados',
        value: {
            expand: false,
            columns: accesosAutorizadosColumns,
            params: '',
            endPoint: 'seg/auditoria/accesos-autorizados',
            response: (response: any) => {
                const datePipe = new DatePipe('es-PE')
                return response.data.map((item: any, index: number) => ({
                    index: index + 1,
                    cCredUsuario: item.cCredUsuario,
                    cNombre: item.cNombre,
                    cDispositivo: item.cDispositivo,
                    cIpCliente: item.cIpCliente,
                    cNavegador: item.cNavegador,
                    cSistmaOperativo: item.cSistmaOperativo,
                    dtFecha: datePipe.transform(
                        item.dtFecha,
                        'dd/MM/yyyy HH:mm'
                    ),
                }))
            },
        },
    },
    {
        label: 'Accesos fallidos',
        value: {
            expand: false,
            columns: accesosFallidosColumns,
            endPoint: 'seg/auditoria/accesos-fallidos',
            params: '',
            response: (response: any) => {
                const datePipe = new DatePipe('es-PE')
                return response.data.map((item: any, index: number) => ({
                    index: index + 1,
                    cLogin: item.cLogin,
                    cPassword: item.cPassword,
                    cMotivo: JSON.parse(item.cMotivo),
                    cDispositivo: item.cDispositivo,
                    cIpCliente: item.cIpCliente,
                    cNavegador: item.cNavegador,
                    cSistmaOperativo: item.cSistmaOperativo,
                    dtFecha: datePipe.transform(
                        item.dtFecha,
                        'dd/MM/yyyy HH:mm'
                    ),
                }))
            },
        },
    },
    {
        label: 'Consultas database',
        value: {
            expand: true,
            selectedFirst: true,
            columns: auditoriaColumns,
            params: '',
            endPoint: 'seg/auditoria/consultas-database',
            response: (response: any) => {
                const datePipe = new DatePipe('es-PE')
                return response.data.map((item, index) => {
                    const datosAntiguos = Array.isArray(
                        JSON.parse(item.cAudDatosAntiguos)
                    )
                        ? JSON.parse(item.cAudDatosAntiguos)[0]
                        : {}
                    const datosNuevos = Array.isArray(
                        JSON.parse(item.cAudDatosNuevos)
                    )
                        ? JSON.parse(item.cAudDatosNuevos)[0]
                        : {}

                    const transformData: Record<
                        string,
                        {
                            property: any
                            oldValue: any
                            newValue: any
                            class: any
                        }
                    > = {}

                    const keys = new Set([
                        ...Object.keys(datosAntiguos ?? {}),
                        ...Object.keys(datosNuevos ?? {}),
                    ])

                    const matchingKeys: string[] = []
                    const differingKeys: string[] = []

                    keys.forEach((key) => {
                        const oldValue = datosAntiguos[key] ?? ''
                        const newValue = datosNuevos[key] ?? ''

                        const isMatching = oldValue == newValue

                        const formatDataAntiguo = datosAntiguos[key]
                        const formatDataNuevo = datosNuevos[key]

                        const entry = {
                            class: isMatching
                                ? undefined
                                : item.cAudTipoOperaion,
                            property: key,
                            oldValue: formatDataAntiguo ?? null,
                            newValue: formatDataNuevo ?? null,
                        }

                        if (isMatching) {
                            matchingKeys.push(key)
                        } else {
                            differingKeys.push(key)
                        }

                        transformData[key] = entry
                    })

                    const reorderedTransformData: Record<
                        string,
                        {
                            property: any
                            oldValue: any
                            newValue: any
                            class: any
                        }
                    > = {}

                    differingKeys.forEach((key) => {
                        reorderedTransformData[key] = transformData[key]
                    })

                    matchingKeys.forEach((key) => {
                        reorderedTransformData[key] = transformData[key]
                    })
                    return {
                        index: index + 1,
                        class: item.cAudTipoOperaion,
                        cAudUsuario: item.cAudUsuario,
                        cAudTabla: item.cAudTabla,
                        cAudTipoOperaion: item.cAudTipoOperaion,
                        dtFecha: datePipe.transform(
                            item.dtFecha,
                            'dd/MM/yyyy HH:mm'
                        ),
                        cAudOperacion: JSON.parse(item.cAudOperacion)?.[0][
                            'event_info'
                        ].replace(/,/g, ', '),
                        cAudEsquema: item.cAudEsquema,
                        cAudDatos: Object.values(reorderedTransformData),
                    }
                })
            },
        },
    },
    {
        label: 'Consultas backend',
        value: {
            selectedFirst: true,
            expand: true,
            columns: auditoriaMiddlewareColumns,
            params: '',
            endPoint: 'seg/auditoria/consultas-backend',
            response: (response: any) => {
                const datePipe = new DatePipe('es-PE')
                return response.data.map((item, index) => {
                    const datosAntiguos = Array.isArray(
                        JSON.parse(item.cAudDatosAntiguos)
                    )
                        ? JSON.parse(item.cAudDatosAntiguos)[0]
                        : {}
                    const datosNuevos = Array.isArray(
                        JSON.parse(item.cAudDatosNuevos)
                    )
                        ? JSON.parse(item.cAudDatosNuevos)[0]
                        : {}

                    const transformData: Record<
                        string,
                        {
                            property: any
                            oldValue: any
                            newValue: any
                            class: any
                        }
                    > = {}

                    const keys = new Set([
                        ...Object.keys(datosAntiguos ?? {}),
                        ...Object.keys(datosNuevos ?? {}),
                    ])

                    const matchingKeys: string[] = []
                    const differingKeys: string[] = []

                    keys.forEach((key) => {
                        const oldValue = datosAntiguos[key] ?? ''
                        const newValue = datosNuevos[key] ?? ''

                        const isMatching = oldValue == newValue

                        const formatDataAntiguo = datosAntiguos[key]
                        const formatDataNuevo = datosNuevos[key]

                        const entry = {
                            class: isMatching
                                ? undefined
                                : item.cAudTipoOperacion,
                            property: key,
                            oldValue: formatDataAntiguo ?? null,
                            newValue: formatDataNuevo ?? null,
                        }

                        if (isMatching) {
                            matchingKeys.push(key)
                        } else {
                            differingKeys.push(key)
                        }

                        transformData[key] = entry
                    })

                    const reorderedTransformData: Record<
                        string,
                        {
                            property: any
                            oldValue: any
                            newValue: any
                            class: any
                        }
                    > = {}

                    differingKeys.forEach((key) => {
                        reorderedTransformData[key] = transformData[key]
                    })

                    matchingKeys.forEach((key) => {
                        reorderedTransformData[key] = transformData[key]
                    })

                    return {
                        index: index + 1,
                        class: item.cAudTipoOperacion,
                        cCredUsuario: item.cCredUsuario,
                        cAudTabla: item.cAudTabla,
                        cAudTipoOperacion: item.cAudTipoOperacion,
                        dtFecha: datePipe.transform(
                            item.dtFecha,
                            'dd/MM/yyyy HH:mm'
                        ),
                        cAudOperacion: JSON.parse(item.cAudOperacion)?.[0][
                            'event_info'
                        ].replace(/,/g, ', '),
                        cAudEsquema: item.cAudEsquema,
                        cAudDatos: Object.values(reorderedTransformData),
                    }
                })
            },
        },
    },
]
