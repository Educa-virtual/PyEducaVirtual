const TABS = {
    inicio: 'INICIO',
    contenido: 'CONTENIDO',
    evaluaciones: 'EVALUACIONES',
    estudiantes: 'ESTUDIANTES',
    rubrica: 'RUBRICAS',
    ['banco-preguntas']: 'BANCO-PREGUNTAS',
}

export type TabsKeys = keyof typeof TABS

export function isValidTabKey(tab: string): tab is TabsKeys {
    return Object.keys(TABS).includes(tab)
}
export interface ITabs {
    tab: TabsKeys
    title: string
    subtitle?: string
    icon: string
}
