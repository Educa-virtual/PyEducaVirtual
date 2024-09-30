import { IActionContainer } from '@/app/shared/container-page/container-page.component'
import {
    IActionTable,
    IColumn,
} from '@/app/shared/table-primeng/table-primeng.component'

export const columns: IColumn[] = [
    {
        type: 'text',
        width: '5rem',
        field: 'cBancoPregunta',
        header: 'Pregunta',
        text_header: 'left',
        text: 'left',
    },
    {
        type: 'text',
        width: '3rem',
        field: 'nBancoPuntaje',
        header: 'Puntaje',
        text_header: 'left',
        text: 'left',
    },
    {
        type: 'actions',
        width: '3rem',
        field: 'actions',
        header: 'Acciones',
        text_header: 'center',
        text: 'center',
    },
]

export const actionsContainer: IActionContainer[] = []

export const actionsTable: IActionTable[] = [
    {
        labelTooltip: 'Editar',
        icon: 'pi pi-pencil',
        accion: 'agregar',
        type: 'item',
        class: 'p-button-rounded p-button-warning p-button-text',
    },
    {
        labelTooltip: 'Eliminar',
        icon: 'pi pi-pencil',
        accion: 'editar',
        type: 'item',
        class: 'p-button-rounded p-button-danger p-button-text',
    },
]
