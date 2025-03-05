import { IColumn } from '@/app/shared/table-primeng/table-primeng.component'

// export const columns = docenteTemplateColumns.
export const docenteTemplateColumns = [
    {
        type: 'text',
        width: '5rem',
        field: 'cPersDocumento',
        header: 'DNI',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'cell-editor',
        inputType: 'text',
        width: '5rem',
        field: 'cPersPaterno',
        header: 'Apellido paterno',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'cell-editor',
        inputType: 'text',
        width: '5rem',
        field: 'cPersMaterno',
        header: 'Apellido materno',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'cell-editor',
        inputType: 'text',
        width: '5rem',
        field: 'cPersNombre',
        header: 'Nombres',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'cell-editor',
        width: '5rem',
        field: 'cPersSexo',
        header: 'Sexo',
        text_header: 'center',
        text: 'center',

        inputType: 'dropdown',
        outputType: 'tag',
        options: [
            { label: 'M', value: 'M' },
            { label: 'F', value: 'F' },
        ],
        severity: (option) => {
            switch (option) {
                case 'M':
                    return 'info'
                case 'F':
                    return 'warning'
                default:
                    return 'info'
            }
        },
    },
    {
        type: 'cell-editor',
        inputType: 'email',
        width: '5rem',
        field: 'cDocenteCorreoInstitucional',
        header: 'Correo Institucional',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'cell-editor',
        inputType: 'email',
        width: '5rem',
        field: 'cDocenteCorreo',
        header: 'Correo personal',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'cell-editor',
        inputType: 'number',
        width: '5rem',
        field: 'cDocenteUbigeo',
        header: 'Ubigeo',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'cell-editor',
        inputType: 'date',
        width: '5rem',
        field: 'dDocenteFechaNacimiento',
        header: 'Fecha de nacimiento',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'text',
        width: '5rem',
        field: 'cDocenteDireccion',
        header: 'Direccion',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'cell-editor',
        inputType: 'number',
        width: '5rem',
        field: 'cDocenteTelefono',
        header: 'Celular',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'cell-editor',
        inputType: 'number',
        width: '5rem',
        field: 'iHorasLabora',
        header: 'Horas laborales',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'cell-editor',
        inputType: 'dropdown',
        options: [{ label: 'Docente', value: '3' }],
        width: '5rem',
        field: 'iPersCargoId',
        header: 'Cargo',
        text_header: 'center',
        text: 'center',
    },
]

export const estudianteTemplateColumns = [
    {
        type: 'cell-editor',
        width: '5rem',
        field: 'cTipoIdentSigla',
        header: 'Tipo  de documento',
        text_header: 'center',
        text: 'center',

        inputType: 'dropdown',
        options: [
            { label: 'DNI', value: 'M' },
            { label: 'RUC', value: 'M' },
            { label: 'CDE', value: 'M' },
            { label: 'OTD', value: 'M' },
        ],
    },
]

export const mapColumns = (template: IColumn[]) => {
    return template.map(({ width, field, header, text, text_header }) => ({
        type: 'text',
        width,
        field,
        header,
        text,
        text_header,
    }))
}
