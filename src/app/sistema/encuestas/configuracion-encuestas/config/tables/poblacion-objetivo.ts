import { IColumn } from '@/app/shared/table-primeng/table-primeng.component'

export const poblacionObjetivoColumns: IColumn[] = [
    {
        type: 'text',
        width: '5rem',
        field: 'AA12/ESTADO DE MATRICULA',
        header: 'DNI/CE',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'text',
        width: '5rem',
        field: 'AA12/ESTADO DE MATRICULA',
        header: 'Apellidos y Nombre',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'text',
        width: '5rem',
        field: 'AA12/ESTADO DE MATRICULA',
        header: 'UGEL',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'checkbox',
        width: '5rem',
        field: 'AA12/ESTADO DE MATRICULA',
        header: '',
        text_header: 'center',
        text: 'center',
    },
]
