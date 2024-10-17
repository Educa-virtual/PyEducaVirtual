import {
    IActionTable,
    IColumn,
} from '../../../../../../../shared/table-primeng/table-primeng.component'
export const accionesPreguntasEvaluacion: IActionTable[] = [
    // {
    //     labelTooltip: 'Editar',
    //     icon: 'pi pi-pencil',
    //     accion: 'editar',
    //     type: 'item',
    //     class: 'p-button-rounded p-button-warning p-button-text',
    // },
    {
        labelTooltip: 'Quitar Pregunta',
        icon: 'pi pi-trash',
        accion: 'eliminar',
        type: 'item',
        class: 'p-button-rounded p-button-danger p-button-text',
    },
]

export const columnasPreguntasEvaluacion: IColumn[] = [
    {
        field: '',
        header: '',
        type: 'expansion',
        width: '2rem',
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
