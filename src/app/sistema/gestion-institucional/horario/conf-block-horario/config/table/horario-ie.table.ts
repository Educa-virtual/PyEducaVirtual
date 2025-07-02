import { IColumn } from '@/app/shared/table-primeng/table-primeng.component'

const columns: IColumn[] = [
    {
        type: 'item',
        width: '5rem',
        field: 'item',
        header: 'Item',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'text',
        width: '5rem',
        field: 'cDescripcion',
        header: 'Sección',
        text_header: 'center',
        text: 'center',
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

export const horarioIE = {
    table: {
        columns,
        data: [],
        actions: [],
    },
}
