const TABS = {
    inicio: 'INICIO',
    contenido: 'CONTENIDO',
    evaluaciones: 'EVALUACIONES',
    estudiantes: 'ESTUDIANTES',
    rubricas: 'RUBRICAS',
    ['banco-preguntas']: 'BANCO-PREGUNTAS',
}

export type TabsKeys = keyof typeof TABS

export interface ITabs {
    tab: TabsKeys
    title: string
    subtitle?: string
    icon: string
}
