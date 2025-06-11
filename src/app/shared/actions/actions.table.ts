import { IActionTable } from '../table-primeng/table-primeng.component'

export const editar: IActionTable = {
    labelTooltip: 'Editar',
    icon: 'pi pi-pencil',
    accion: 'editar',
    type: 'item',
    class: 'p-button-rounded p-button-warning p-button-text',
}

export const eliminar: IActionTable = {
    labelTooltip: 'Eliminar',
    icon: 'pi pi-trash',
    accion: 'eliminar',
    type: 'item',
    class: 'p-button-rounded p-button-danger p-button-text',
}
