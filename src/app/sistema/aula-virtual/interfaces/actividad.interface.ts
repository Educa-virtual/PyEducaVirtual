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

interface IActividadConfig extends IActividad {
    'bg-color': string
    icon: string
}

export const actividadesConfig: Record<tipoActividadesKeys, IActividadConfig> =
    {
        tarea: {
            nombreActividad: 'Actividades',
            'bg-color': 'bg-blue-500 text-white',
            icon: 'matAssignment',
            id: '0',
            tipoActividadNombre: '',
            tipoActividad: 'tarea',
        },
        foro: {
            nombreActividad: 'Foro',
            'bg-color': 'bg-green-500 text-white',
            icon: 'matForum',
            id: '1',
            tipoActividadNombre: '',
            tipoActividad: 'foro',
        },
        evaluacion: {
            'bg-color': 'bg-yellow-500 text-white',
            icon: 'matQuiz',
            nombreActividad: 'Evaluación',
            id: '2',
            tipoActividadNombre: '',
            tipoActividad: 'evaluacion',
        },
        'video-conferencia': {
            'bg-color': 'bg-pink-500 text-white',
            icon: 'matVideocam',
            nombreActividad: 'VideoConferencia',
            tipoActividad: 'video-conferencia',
            id: '3',
            tipoActividadNombre: '',
        },
        material: {
            'bg-color': 'bg-indigo-500 text-white',
            icon: 'matDescription',
            nombreActividad: 'Material',
            id: '4',
            tipoActividadNombre: '',
            tipoActividad: 'material',
        },
    }
