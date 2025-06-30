import { IActionContainer } from '@/app/shared/container-page/container-page.component'
import {
    IActionTable,
    IColumn,
} from '@/app/shared/table-primeng/table-primeng.component'

export const columns: IColumn[] = [
    {
        field: 'item',
        header: '#',
        type: 'item',
        width: '1rem',
        text: 'center',
        text_header: 'center',
    },
    {
        field: 'cTipo',
        header: 'Tipo',
        type: 'text',
        width: '5rem',
        text: 'center',
        text_header: 'center',
    },
    {
        field: 'cNombre',
        header: 'Nombre',
        type: 'item-innerHtml',
        width: '15rem',
        text: 'left',
        text_header: 'left',
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

export const columnasModalAgregarBancoPreguntas: IColumn[] = [
    {
        field: 'checked',
        header: '',
        type: 'checkbox',
        width: '1rem',
        text: 'left',
        text_header: '',
    },
    {
        field: 'iEncabezado',
        header: 'Encabezado',
        type: 'text',
        width: '1rem',
        text: 'center',
        text_header: 'center',
    },
    {
        field: 'cPreguntaNoHTML',
        header: 'Pregunta',
        type: 'trim',
        width: '15rem',
        text: 'left',
        text_header: 'left',
    },
    // {
    //     type: 'text',
    //     width: '1rem',
    //     field: 'iPreguntaPeso',
    //     header: 'Peso',
    //     text_header: 'center',
    //     text: 'center',
    // },
    {
        type: 'text',
        width: '2rem',
        field: 'cTipoPregDescripcion',
        header: 'Tipo de Pregunta',
        text_header: 'center',
        text: 'center',
    },
    // {
    //     type: 'text',
    //     width: '2rem',
    //     field: 'iTotalPreguntas',
    //     header: '# Preguntas',
    //     text_header: 'center',
    //     text: 'center',
    // },
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
        accion: 'generarWordEvaluacion',
        class: 'p-button-info',
    },

    {
        labelTooltip: 'Agregar Pregunta',
        text: 'Agregar Preguntas',
        icon: 'pi pi-plus',
        accion: 'agregar',
        class: 'p-button-secondary',
    },
]

export const actionsTable: IActionTable[] = [
    {
        labelTooltip: 'Ver',
        icon: 'pi pi-eye',
        accion: 'ver',
        type: 'item',
        class: 'p-button-rounded p-button-info p-button-text',
    },
    {
        labelTooltip: 'Editar Pregunta Múltiple',
        icon: 'pi pi-pencil',
        accion: 'editar-multiple',
        type: 'item',
        class: 'p-button-rounded p-button-warning p-button-text',
        isVisible(row) {
            return row.idEncabPregId
        },
    },
    {
        labelTooltip: 'Editar',
        icon: 'pi pi-pencil',
        accion: 'editar',
        type: 'item',
        class: 'p-button-rounded p-button-warning p-button-text',
        isVisible(row) {
            return !row.idEncabPregId
        },
    },
    {
        labelTooltip: 'Eliminar',
        icon: 'pi pi-trash',
        accion: 'eliminar',
        type: 'item',
        class: 'p-button-rounded p-button-danger p-button-text',
        isVisible(row) {
            return !row.idEncabPregId
        },
    },
    {
        labelTooltip: 'Eliminar Pregunta Múltiple',
        icon: 'pi pi-trash',
        accion: 'eliminar-multiple',
        type: 'item',
        class: 'p-button-rounded p-button-danger p-button-text',
        isVisible(row) {
            return row.idEncabPregId
        },
    },
    {
        labelTooltip: 'Agregar Pregunta',
        icon: 'pi pi-plus',
        accion: 'agregar-pregunta-multiple',
        type: 'item',
        class: 'p-button-rounded p-button-success p-button-text',
        isVisible(row) {
            return row.idEncabPregId
        },
    },
]

export const actionsTableModalAgregarBancoPreguntas: IActionTable[] = [
    {
        labelTooltip: 'Ver',
        icon: 'pi pi-eye',
        accion: 'ver',
        type: 'item',
        class: 'p-button-rounded p-button-info p-button-text',
    },
]
