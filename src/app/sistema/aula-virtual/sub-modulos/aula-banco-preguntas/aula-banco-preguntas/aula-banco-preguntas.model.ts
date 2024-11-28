import { IActionContainer } from '@/app/shared/container-page/container-page.component'
import {
    IActionTable,
    IColumn,
} from '@/app/shared/table-primeng/table-primeng.component'

export const columns: IColumn[] = [
    {
        field: '',
        header: '',
        type: 'expansion',
        width: '1rem',
        text: 'left',
        text_header: 'left',
    },
    {
        field: 'cPreguntaNoHTML',
        header: 'Pregunta Título',
        type: 'trim',
        width: '7rem',
        text: 'left',
        text_header: 'left',
    },
    {
        field: 'cEncabPregTitulo',
        header: 'Encabezado',
        type: 'text',
        width: '5rem',
        text: 'left',
        text_header: 'Encabezado',
    },
    {
        type: 'text',
        width: '3rem',
        field: 'iPreguntaPeso',
        header: 'Puntaje',
        text_header: 'left',
        text: 'left',
    },
    {
        type: 'text',
        width: '3rem',
        field: 'cTipoPregDescripcion',
        header: 'Tipo de Pregunta',
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

export const actionsContainer: IActionContainer[] = [
    {
        labelTooltip: 'Word',
        text: 'Word',
        icon: 'pi pi-file-word',
        accion: 'generar-word',
        class: 'p-button-info',
    },

    {
        labelTooltip: 'Agregar Pregunta',
        text: 'Agregar Pregunta',
        icon: 'pi pi-plus',
        accion: 'agregar',
        class: 'p-button-secondary',
    },
]

export const actionsTable: IActionTable[] = [
    {
        labelTooltip: 'Editar',
        icon: 'pi pi-pencil',
        accion: 'editar',
        type: 'item',
        class: 'p-button-rounded p-button-warning p-button-text',
    },
    {
        labelTooltip: 'Eliminar',
        icon: 'pi pi-trash',
        accion: 'eliminar',
        type: 'item',
        class: 'p-button-rounded p-button-danger p-button-text',
    },
]
