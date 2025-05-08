import { IColumn } from '@/app/shared/table-primeng/table-primeng.component'

export const listaEncuestaColumns: IColumn[] = [
    {
        type: 'item',
        width: '5rem',
        field: '',
        header: '#',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'text',
        width: '5rem',
        field: '',
        header: 'Título de encuesta',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'text',
        width: '5rem',
        field: '',
        header: 'Tiempo',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'text',
        width: '5rem',
        field: '',
        header: 'Fecha inicio',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'text',
        width: '5rem',
        field: '',
        header: 'Fecha fin',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'actions',
        width: '5rem',
        field: '',
        header: 'Acciones',
        text_header: 'center',
        text: 'center',
    },
]

export const listaEncuestaContainerActions = [
    {
        labelTooltip: 'Nueva',
        text: 'Nueva',
        icon: 'pi pi-plus',
        accion: 'agregar',
        class: 'p-button-primary',
    },
]
