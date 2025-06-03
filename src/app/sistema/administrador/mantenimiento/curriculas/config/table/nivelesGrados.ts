import { IColumn } from '@/app/shared/table-primeng/table-primeng.component'

export const nivelesGradosColumns: IColumn[] = [
    {
        type: 'item',
        width: '5rem',
        field: '',
        header: 'Item',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'text',
        width: '5rem',
        field: 'cNivelTipoNombre',
        header: 'Nivel',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'text',
        width: '5rem',
        field: 'cGradoNombre',
        header: 'Grado',
        text_header: 'center',
        text: 'center',
    },
]
