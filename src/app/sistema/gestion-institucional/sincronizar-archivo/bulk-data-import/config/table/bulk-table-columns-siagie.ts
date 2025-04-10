import { IColumn } from '@/app/shared/table-primeng/table-primeng.component'

interface TableColumn {
    inTableColumnsGroup?: IColumn[][]
    inTableColumns: IColumn[]
}

export const headerTemplateSiagie: TableColumn = {
    inTableColumns: [
        {
            type: 'text',
            width: '5rem',
            field: 'M7/Item',
            header: 'CÓDIGO MODULAR',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'O7/Item',
            header: 'INSTITUCIÓN EDUCATIVA',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'S7/Item',
            header: 'MODALIDAD',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'U7/Item',
            header: 'NIVEL',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'V7/Item',
            header: 'TURNO',
            text_header: 'center',
            text: 'center',
        },
    ],
}

export const padresFamiliasTemplateColumns2: TableColumn = {
    inTableColumnsGroup: [
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
            {
                type: 'text',
                width: '5rem',
                text_header: 'center',
                field: 'C11',
                header: 'Estudiante',
                text: 'center',
                colspan: 7,
                rowspan: 1,
            },
            {
                type: 'text',
                width: '5rem',
                text_header: 'center',
                field: 'AS11',
                header: 'Apoderado',
                text: 'center',
                colspan: 8,
                rowspan: 1,
            },
        ],
        [
            {
                type: 'text',
                width: '5rem',
                text_header: 'center',
                field: 'C12',
                header: 'GRADO',
                text: 'center',
                colspan: 1,
                rowspan: 2,
            },
            {
                type: 'text',
                width: '5rem',
                text_header: 'center',
                field: 'D12',
                header: 'SECCIÓN',
                text: 'center',
                colspan: 1,
                rowspan: 2,
            },
            {
                type: 'text',
                width: '5rem',
                text_header: 'center',
                field: 'E12',
                header: 'TIPO DE DOCUMENTO',
                text: 'center',
                colspan: 1,
                rowspan: 2,
            },
            {
                type: 'text',
                width: '5rem',
                text_header: 'center',
                field: 'F12',
                header: 'NÙMERO DE DOCUMENTO',
                text: 'center',
                colspan: 1,
                rowspan: 2,
            },
            {
                type: 'text',
                width: '5rem',
                text_header: 'center',
                field: 'I12',
                header: 'APELLIDO PATERNO',
                text: 'center',
                colspan: 1,
                rowspan: 2,
            },
            {
                type: 'text',
                width: '5rem',
                text_header: 'center',
                field: 'J12',
                header: 'APELLIDO MATERNO',
                text: 'center',
                colspan: 1,
                rowspan: 2,
            },
            {
                type: 'text',
                width: '5rem',
                text_header: 'center',
                field: 'K12',
                header: 'NOMBRES',
                text: 'center',
                colspan: 1,
                rowspan: 2,
            },
            {
                type: 'text',
                width: '5rem',
                text_header: 'center',
                field: 'AS12',
                header: 'APELLIDOS Y NOMBRES',
                text: 'center',
                colspan: 1,
                rowspan: 2,
            },
            {
                type: 'text',
                width: '5rem',
                text_header: 'center',
                field: 'AT12',
                header: 'SEXO',
                text: 'center',
                colspan: 1,
                rowspan: 2,
            },
            {
                type: 'text',
                width: '5rem',
                text_header: 'center',
                field: 'AU12',
                header: 'PARENTESCO',
                text: 'center',
                colspan: 1,
                rowspan: 2,
            },
            {
                type: 'text',
                width: '5rem',
                text_header: 'center',
                field: 'AV12',
                header: 'TIPO DE DOCUMENTO',
                text: 'center',
                colspan: 1,
                rowspan: 2,
            },
            {
                type: 'text',
                width: '5rem',
                text_header: 'center',
                field: 'AW12',
                header: 'NÚMERO DE DOCUMENTO',
                text: 'center',
                colspan: 1,
                rowspan: 2,
            },
            {
                type: 'text',
                width: '5rem',
                text_header: 'center',
                field: 'AY12',
                header: 'CORREO ELECTRÓNICO',
                text: 'center',
                colspan: 1,
                rowspan: 2,
            },
            {
                type: 'text',
                width: '5rem',
                text_header: 'center',
                field: 'AZ12',
                header: 'NÚMERO CELULAR',
                text: 'center',
                colspan: 1,
                rowspan: 2,
            },
        ],
    ],
    inTableColumns: [
        {
            colspan: 1,
            type: 'text',
            width: '5rem',
            text_header: 'center',
            field: 'B11/item',
            header: 'Item',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            text_header: 'center',
            field: 'C12',
            header: 'GRADO',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            text_header: 'center',
            field: 'D12',
            header: 'SECCIÓN',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            text_header: 'center',
            field: 'E12',
            header: 'TIPO DE DOCUMENTO',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            text_header: 'center',
            field: 'F12',
            header: 'NÙMERO DE DOCUMENTO',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            text_header: 'center',
            field: 'I12/apeppa',
            header: 'APELLIDO PATERNO',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            text_header: 'center',
            field: 'J12/apmat',
            header: 'APELLIDO MATERNO',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            text_header: 'center',
            field: 'K12/Nombres10',
            header: 'NOMBRES',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            text_header: 'center',
            field: 'AS12/APELLIDOS Y NOMBRES/Apellidos y nombres15',
            header: 'APELLIDOS Y NOMBRES',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            text_header: 'center',
            field: 'AT12/SEXO/Padre Sexo16',
            header: 'SEXO',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            text_header: 'center',
            field: 'AU12/PARENTESCO/Parentesco17',
            header: 'PARENTESCO',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            text_header: 'center',
            field: 'AV12/TIPO DE DOCUMENTO/Parentesco18',
            header: 'TIPO DE DOCUMENTO',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            text_header: 'center',
            field: 'AW12/NÚMERO DE DOCUMENTO/Parentesco19',
            header: 'NÚMERO DE DOCUMENTO',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            text_header: 'center',
            field: 'AY12/CORREO ELECTRÓNICO/Parentesco21',
            header: 'CORREO ELECTRÓNICO',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            text_header: 'center',
            field: 'AZ12/NÚMERO CELULAR/Parentesco22',
            header: 'NÚMERO CELULAR',
            text: 'center',
        },
    ],
}
export const resultPadresFamiliasTemplateColumns: IColumn[] = []

export const estudianteTemplateSiagieColumns: TableColumn = {
    inTableColumnsGroup: [
        [
            {
                type: 'text',
                width: '5rem',
                field: 'B11/ITEM',
                header: 'Estudiante',
                text_header: 'center',
                text: 'center',
                colspan: 13,
                rowspan: 1,
            },
        ],
        [
            {
                type: 'text',
                width: '5rem',
                field: 'B11/ITEM',
                header: 'ITEM',
                text_header: 'center',
                text: 'center',
                colspan: 1,
                rowspan: 1,
            },
            {
                type: 'text',
                width: '5rem',
                field: 'C11/GRADO',
                header: 'Grado',
                text_header: 'center',
                text: 'center',
                colspan: 1,
                rowspan: 1,
            },
            {
                type: 'text',
                width: '5rem',
                field: 'D11/SECCIÓN',
                header: 'SECCIÓN',
                text_header: 'center',
                text: 'center',
                colspan: 1,
                rowspan: 1,
            },
            {
                type: 'text',
                width: '5rem',
                field: 'E12/dTipoDocumento',
                header: 'TIPO DE DOCUMENTO',
                text_header: 'center',
                text: 'center',
                colspan: 1,
                rowspan: 1,
            },
            {
                type: 'text',
                width: '5rem',
                field: 'I12/iDocumento',
                header: 'NÚMERO DE DOCUMENTO',
                text_header: 'center',
                text: 'center',
                colspan: 1,
                rowspan: 1,
            },
            {
                type: 'text',
                width: '5rem',
                field: 'J12/iEstudianteCode',
                header: 'CÓDIGO DEL ESTUDIANTE',
                text_header: 'center',
                text: 'center',
                colspan: 1,
                rowspan: 1,
            },
            {
                type: 'text',
                width: '5rem',
                field: 'N12/APELLIDO PATERNO',
                header: 'APELLIDO PATERNO',
                text_header: 'center',
                text: 'center',
                colspan: 1,
                rowspan: 1,
            },
            {
                type: 'text',
                width: '5rem',
                field: 'R12/APELLIDO MATERNO',
                header: 'APELLIDO MATERNO',
                text_header: 'center',
                text: 'center',
                colspan: 1,
                rowspan: 1,
            },
            {
                type: 'text',
                width: '5rem',
                field: 'U12/NOMBRES',
                header: 'NOMBRES',
                text_header: 'center',
                text: 'center',
                colspan: 1,
                rowspan: 1,
            },
            {
                type: 'text',
                width: '5rem',
                field: 'SEXO',
                header: 'SEXO',
                text_header: 'center',
                text: 'center',
                colspan: 1,
                rowspan: 1,
            },
            {
                type: 'text',
                width: '5rem',
                field: 'FECHA DE NACIMIENTO',
                header: 'FECHA DE NACIMIENTO',
                text_header: 'center',
                text: 'center',
                colspan: 1,
                rowspan: 1,
            },
            {
                type: 'text',
                width: '5rem',
                field: 'EDAD (AL 31 DE MARZO)',
                header: 'EDAD (AL 31 DE MARZO)',
                text_header: 'center',
                text: 'center',
                colspan: 1,
                rowspan: 1,
            },
            {
                type: 'text',
                width: '5rem',
                field: 'ESTADO DE MATRICULA',
                header: 'ESTADO DE MATRICULA',
                text_header: 'center',
                text: 'center',
                colspan: 1,
                rowspan: 1,
            },
        ],
    ],
    inTableColumns: [
        {
            type: 'text',
            width: '5rem',
            field: 'B11/GRADO',
            header: 'Item',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'C11/GRADO',
            header: 'Grado',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'D11/SECCIÓN',
            header: 'SECCIÓN',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'E12/dTipoDocumento',
            header: 'TIPO DE DOCUMENTO',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'I12/iDocumento',
            header: 'NÚMERO DE DOCUMENTO',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'L12/iEstudianteCode',
            header: 'CÓDIGO DEL ESTUDIANTE',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'N12/APELLIDO PATERNO',
            header: 'APELLIDO PATERNO',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'R12/APELLIDO MATERNO',
            header: 'APELLIDO MATERNO',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'U12/NOMBRES',
            header: 'NOMBRES',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'X12/SEXO',
            header: 'SEXO',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'Y12/FECHA DE NACIMIENTO',
            header: 'FECHA DE NACIMIENTO',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'Z12/EDAD (AL 31 DE MARZO)',
            header: 'EDAD (AL 31 DE MARZO)',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'AA12/ESTADO DE MATRICULA',
            header: 'ESTADO DE MATRICULA',
            text_header: 'center',
            text: 'center',
        },
    ],
}

export const resultEstudianteTemplateSiagieColumns: IColumn[] = [
    {
        type: 'item',
        width: '1rem',
        field: 'item',
        header: '',
        text_header: 'left',
        text: 'left',
    },
    {
        type: 'text',
        width: '10rem',
        field: 'persona_nomape',
        header: 'Estudiante',
        text_header: 'left',
        text: 'left',
    },
    {
        type: 'text',
        width: '5rem',
        field: 'documento',
        header: 'Documento',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'text',
        width: '6rem',
        field: 'codigo_estudiante',
        header: 'Codigo',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'text',
        width: '6rem',
        field: 'grado_seccion',
        header: 'Grado y sección',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'text',
        width: '3rem',
        field: 'persona_importado',
        header: 'Persona',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'text',
        width: '3rem',
        field: 'estudiante_importado',
        header: 'Estudiante',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'text',
        width: '3rem',
        field: 'matricula_importado',
        header: 'Matricula',
        text_header: 'center',
        text: 'center',
    },
]
