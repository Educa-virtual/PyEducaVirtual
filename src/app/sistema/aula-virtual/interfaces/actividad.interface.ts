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

export type tipoActividadesKeys = keyof typeof TIPO_ACTIVIDADES

// export function isValidTabKey(tab: string): tab is tipoActividadesKeys {
//     return Object.keys(TIPO_ACTIVIDADES).includes(tab)
// }

export interface IActividad {
    iProgActId: string
    cProgActTituloLeccion: string
    cActTipoNombre: string
    cProgActDescripcion?: string
    iActTipoId?: number
    ixActivadadId: number
    [key: string]: any
}

interface IActividadConfig extends Partial<IActividad> {
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
        iProgActId: '0',
        cActTipoNombre: 'Tarea',
        iActTipoId: TAREA,
    },
    [FORO]: {
        'icon-color': 'text-green-500',
        'bg-color': 'bg-green-500 text-white',
        icon: 'matForum',
        iProgActId: '1',
        cActTipoNombre: 'Foro',
        iActTipoId: FORO,
    },
    [EVALUACION]: {
        'icon-color': 'text-yellow-500',
        'bg-color': 'bg-yellow-500 text-white',
        icon: 'matQuiz',
        iProgActId: '2',
        cActTipoNombre: 'Evaluación Formativa',
        iActTipoId: EVALUACION,
    },
    [VIDEO_CONFERENCIA]: {
        'icon-color': 'text-pink-500',
        'bg-color': 'bg-pink-500 text-white',
        icon: 'matVideocam',
        iProgActId: '3',
        cActTipoNombre: 'Video Conferencia',
        iActTipoId: VIDEO_CONFERENCIA,
    },
    [MATERIAL]: {
        'icon-color': 'text-indigo-500',
        'bg-color': 'bg-indigo-500 text-white',
        icon: 'matDescription',
        iProgActId: '4',
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
