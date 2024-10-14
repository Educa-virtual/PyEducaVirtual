import { IActionTable } from '../../../../../../../shared/table-primeng/table-primeng.component'
export const accionesPreguntasEvaluacion: IActionTable[] = [
    {
        labelTooltip: 'Editar',
        icon: 'pi pi-pencil',
        accion: 'editar',
        type: 'item',
        class: 'p-button-rounded p-button-warning p-button-text',
    },
    {
        labelTooltip: 'Quitar Pregunta',
        icon: 'pi pi-trash',
        accion: 'eliminar',
        type: 'item',
        class: 'p-button-rounded p-button-danger p-button-text',
    },
]
