import { editar, eliminar } from '@/app/shared/actions/actions.table'
import { IActionTable } from '@/app/shared/table-primeng/table-primeng.component'

export const actions: IActionTable[] = [
    {
        labelTooltip: 'Gestionar distribución de bloques',
        icon: 'pi pi-th-large',
        accion: 'gestionarDistribucionBloques',
        type: 'item',
        class: 'p-button-rounded p-button-info p-button-text',
    },
    {
        labelTooltip: 'Asignar distribución de bloques',
        icon: 'pi pi-table',
        accion: 'asignarDistribucionBloques',
        type: 'item',
        class: 'p-button-rounded p-button-info p-button-text',
    },
    editar,
    eliminar,
]
