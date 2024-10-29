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
    isDisabled?: (row) => boolean
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

interface IActividadConfig extends Partial<IActivadadTipo> {
    'icon-color': string
    'bg-color': string
    icon: string
}

export const actividadesConfig: Record<
    number,
    Omit<IActividadConfig, 'cProgActTituloLeccion'>
> = {
    [TAREA]: {
        'icon-color': 'text-blue-500',
        'bg-color': 'bg-blue-500 text-white',
        icon: 'matAssignment',
        cActTipoNombre: 'Tarea',
        iActTipoId: TAREA,
        acciones: [
            {
                icon: 'pi pi-pencil',
                accion: 'EDITAR',
                class: '',
                label: 'Editar',
            },
            {
                icon: 'pi pi-trash',
                accion: 'ELIMINAR',
                class: '',
                label: 'Eliminar',
            },
            {
                icon: 'pi pi-eye',
                accion: 'VER',
                class: '',
                label: 'Ver',
            },
        ],
    },
    [FORO]: {
        'icon-color': 'text-green-500',
        'bg-color': 'bg-green-500 text-white',
        icon: 'matForum',
        cActTipoNombre: 'Foro',
        iActTipoId: FORO,
        acciones: [
            {
                icon: 'pi pi-pencil',
                accion: 'EDITAR',
                class: '',
                label: 'Editar',
            },
            {
                icon: 'pi pi-trash',
                accion: 'ELIMINAR',
                class: '',
                label: 'Eliminar',
            },
            {
                icon: 'pi pi-eye',
                accion: 'VER',
                class: '',
                label: 'Ver',
            },
        ],
    },
    [EVALUACION]: {
        'icon-color': 'text-yellow-500',
        'bg-color': 'bg-yellow-500 text-white',
        icon: 'matQuiz',
        cActTipoNombre: 'Evaluación Formativa',
        iActTipoId: EVALUACION,
        acciones: [
            {
                icon: 'pi pi-pencil',
                accion: 'EDITAR',
                class: '',
                label: 'Editar',
            },
            {
                icon: 'pi pi-trash',
                accion: 'ELIMINAR',
                class: '',
                label: 'Eliminar',
            },
            {
                icon: 'pi pi-eye',
                accion: 'VER',
                class: '',
                label: 'Ver',
            },
        ],
    },
    [VIDEO_CONFERENCIA]: {
        'icon-color': 'text-pink-500',
        'bg-color': 'bg-pink-500 text-white',
        icon: 'matVideocam',
        cActTipoNombre: 'Video Conferencia',
        iActTipoId: VIDEO_CONFERENCIA,
    },
    [MATERIAL]: {
        'icon-color': 'text-indigo-500',
        'bg-color': 'bg-indigo-500 text-white',
        icon: 'matDescription',
        cActTipoNombre: 'Material',
        iActTipoId: MATERIAL,
    },
}

export const actividadesConfigList: Partial<IActividad>[] = [
    {
        iProgActId: '1',
        cProgActTituloLeccion: 'Sesiones de Aprendizaje',
        cActTipoNombre: 'Tareas',
    },
    {
        iProgActId: '2',
        cProgActTituloLeccion: 'Debate sobre tema de actualidad',
        cActTipoNombre: 'Foro',
    },
    {
        iProgActId: '3',
        cProgActTituloLeccion: 'Examen parcial',
        cActTipoNombre: 'Evaluación',
    },
    {
        iProgActId: '4',
        cProgActTituloLeccion: 'Clase virtual de Matemáticas',
        cActTipoNombre: 'Video Conferencia',
    },
    {
        iProgActId: '5',
        cProgActTituloLeccion: 'Lectura de material adicional',
        cActTipoNombre: 'Material',
    },
]
