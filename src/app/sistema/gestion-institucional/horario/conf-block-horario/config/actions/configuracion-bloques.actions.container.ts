import { agregar } from '@/app/shared/actions/action.container'
import { IActionContainer } from '@/app/shared/container-page/container-page.component'

const actions: IActionContainer[] = [
    {
        ...agregar,
        labelTooltip: 'Crear una configuración de bloques horarios',
        text: 'Crear una configuración de bloques horarios',
    },
]

export const container = {
    actions,
}
