const TIPO_ACTIVIDADES = {
    tarea: 'TAREA',
    foro: 'FORO',
    evaluacion: 'EVALUACION',
    'video-conferencia': 'VIDEO_CONFERENCIA',
    material: 'MATERIAL',
}

export type tipoActividadesKeys = keyof typeof TIPO_ACTIVIDADES

export function isValidTabKey(tab: string): tab is tipoActividadesKeys {
    return Object.keys(TIPO_ACTIVIDADES).includes(tab)
}

export interface IActividad {
    id: string
    nombreActividad: string
    tipoActividadNombre: string
    tipoActividad: tipoActividadesKeys
}

interface IActividadConfig extends Omit<IActividad, 'nombreActividad'> {
    'bg-color': string
    icon: string
}

export const actividadesConfig: Record<tipoActividadesKeys, IActividadConfig> =
    {
        tarea: {
            'bg-color': 'bg-blue-500 text-white',
            icon: 'matAssignment',
            id: '0',
            tipoActividadNombre: 'Actividad',
            tipoActividad: 'tarea',
        },
        foro: {
            'bg-color': 'bg-green-500 text-white',
            icon: 'matForum',
            id: '1',
            tipoActividadNombre: 'Foro',
            tipoActividad: 'foro',
        },
        evaluacion: {
            'bg-color': 'bg-yellow-500 text-white',
            icon: 'matQuiz',
            id: '2',
            tipoActividadNombre: 'Evaluación',
            tipoActividad: 'evaluacion',
        },
        'video-conferencia': {
            'bg-color': 'bg-pink-500 text-white',
            icon: 'matVideocam',
            tipoActividad: 'video-conferencia',
            id: '3',
            tipoActividadNombre: 'Video Conferencia',
        },
        material: {
            'bg-color': 'bg-indigo-500 text-white',
            icon: 'matDescription',
            id: '4',
            tipoActividadNombre: 'Material',
            tipoActividad: 'material',
        },
    }

export const actividadesConfigList: IActividad[] = [
    {
        id: '1',
        nombreActividad: 'Sesiones de Aprendizaje',
        tipoActividadNombre: 'Tareas',
        tipoActividad: 'tarea',
    },
    {
        id: '2',
        nombreActividad: 'Debate sobre tema de actualidad',
        tipoActividadNombre: 'Foro',
        tipoActividad: 'foro',
    },
    {
        id: '3',
        nombreActividad: 'Examen parcial',
        tipoActividadNombre: 'Evaluación',
        tipoActividad: 'evaluacion',
    },
    {
        id: '4',
        nombreActividad: 'Clase virtual de Matemáticas',
        tipoActividadNombre: 'Video Conferencia',
        tipoActividad: 'video-conferencia',
    },
    {
        id: '5',
        nombreActividad: 'Lectura de material adicional',
        tipoActividadNombre: 'Material',
        tipoActividad: 'material',
    },
]
