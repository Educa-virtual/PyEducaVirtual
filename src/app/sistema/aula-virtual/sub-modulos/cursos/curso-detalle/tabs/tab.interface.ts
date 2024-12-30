export const TABS = {
    inicio: 'INICIO',
    contenido: 'CONTENIDO',
    evaluaciones: 'EVALUACIONES',
    // estudiantes: 'ESTUDIANTES',
    resultados: 'Resultados',
    asistencia: 'Asistencia',
    'banco-preguntas': 'Banco de Preguntas',
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

export interface ItabsMenu {
    label: string
    tab: TabsKeys
    icon: string
    command?: () => void
}
