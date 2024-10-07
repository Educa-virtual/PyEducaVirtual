import {
    IActionTable,
    IColumn,
} from '@/app/shared/table-primeng/table-primeng.component'

export const columnasListaPreguntaForm: IColumn[] = [
    {
        type: 'p-editor',
        width: '8rem',
        field: 'cPregunta',
        header: 'Pregunta Título',
        text_header: 'Pregunta Título',
        text: 'left',
    },
    {
        type: 'text',
        width: '2rem',
        field: 'iTotalAlternativas',
        header: 'Total Alternativas',
        text_header: 'left',
        text: 'left',
    },
    {
        type: 'text',
        width: '2rem',
        field: 'cTipoPregDescripcion',
        header: 'Tipo Pregunta',
        text_header: 'left',
        text: 'left',
    },
    {
        field: '',
        header: 'Acciones',
        type: 'actions',
        width: '3rem',
        text: 'left',
        text_header: '',
    },
]

// Acciones de la tabla
export const accionesTablaListaPreguntaForm: IActionTable[] = [
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
    {
        labelTooltip: 'Agregar Alternativas',
        icon: {
            name: 'matListAlt',
            size: 'xs',
        },
        accion: 'alternativas',
        type: 'item',
        class: 'p-button-rounded p-button-primary p-button-text',
        isVisible(row) {
            return row.iTipoPregId !== 3
        },
    },
]
