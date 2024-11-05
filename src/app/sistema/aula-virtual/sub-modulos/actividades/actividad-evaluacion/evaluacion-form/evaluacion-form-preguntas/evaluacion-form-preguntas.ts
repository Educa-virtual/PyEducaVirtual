import {
    IActionTable,
    IColumn,
} from '../../../../../../../shared/table-primeng/table-primeng.component'
export const accionesPreguntasEvaluacion: IActionTable[] = [
    {
        labelTooltip: 'Agregar Logros',
        accion: 'agregar-logros',
        type: 'item',
        icon: {
            size: 'xs',
            color: 'text-yellow-600',
            name: 'matWorkspacePremium',
        },
        class: 'p-button-rounded p-button-warning p-button-text',
        isVisible: (row) => {
            if (row.preguntas && row.preguntas.length > 0) {
                return row.preguntas.some(
                    (pregunta) => pregunta.iTipoPregId === 3
                )
            }
            return row.iTipoPregId === 3
        },
    },
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
