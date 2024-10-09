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
