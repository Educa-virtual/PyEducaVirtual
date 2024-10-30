import { IIcon } from '@/app/shared/icon/icon.interface'
import { MenuItem } from 'primeng/api'

export const TAREA = 1
export const FORO = 2
export const EVALUACION = 3
export const VIDEO_CONFERENCIA = 4
export const MATERIAL = 5

export const TIPO_ACTIVIDADES = {
    [TAREA]: 'TAREA',
    [FORO]: 'FORO',
    [EVALUACION]: 'EVALUACION',
    [VIDEO_CONFERENCIA]: 'VIDEO_CONFERENCIA',
    [MATERIAL]: 'MATERIAL',
}

export interface IActionContenido extends Omit<MenuItem, 'icon'> {
    icon: string | IIcon
    accion: string
    class: string
    isVisible?: (row) => boolean
}

export type tipoActividadesKeys = keyof typeof TIPO_ACTIVIDADES

// export function isValidTabKey(tab: string): tab is tipoActividadesKeys {
//     return Object.keys(TIPO_ACTIVIDADES).includes(tab)
// }

export interface IActivadadTipo {
    iActTipoId: number
    cActTipoNombre: string
    acciones: IActionContenido[]
}

export interface IActividad {
    iProgActId: string
    cProgActTituloLeccion: string
    cActTipoNombre: string
    cProgActDescripcion?: string
    iActTipoId?: number
    ixActivadadId: number
    [key: string]: any
}

export interface IActividadConfig extends Partial<IActivadadTipo> {
    'icon-color': string
    'bg-color': string
    icon: string
}
