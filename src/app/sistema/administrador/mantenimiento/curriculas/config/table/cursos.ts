import { TableColumn } from '@/app/shared/table-primeng/table-primeng.component'

export const cursosColumns: TableColumn = {
    inTableColumnsGroup: [
        [
            {
                type: 'text',
                width: '5rem',
                text_header: 'center',
                field: '',
                header: 'ITEM',
                text: 'center',
                colspan: 1,
                rowspan: 2,
            },
        ],
        [
            {
                type: 'text',
                width: '5rem',
                text_header: 'center',
                field: 'B11',
                header: 'ITEM',
                text: 'center',
                colspan: 1,
                rowspan: 2,
            },
        ],
    ],
    inTableColumns: [
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
            field: 'cCursoNombre',
            header: 'Nombre',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'nCursoCredTeoria',
            header: 'Créditos teoría',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'nCursoCredPractica',
            header: 'Créditos prácticos',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'nCursoTotalCreditos',
            header: 'Créditos totales',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cCursoPerfilDocente',
            header: 'Docente',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'iCursoTotalHoras',
            header: 'Horas totales',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'iCursoEstado',
            header: 'Estado',
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
    ],
}

export function cursosSave() {}
