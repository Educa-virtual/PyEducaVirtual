import { IColumn } from '@/app/shared/table-primeng/table-primeng.component'
// export const columns = docenteTemplateColumns.
export const docentePlatformTemplateColumns: IColumn[] = [
    {
        type: 'text',
        width: '5rem',
        field: 'cTipoIdentId',
        header: 'Tipos de documento',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'text',
        width: '5rem',
        field: 'cPersDocumento',
        header: 'Numero de documento',
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
        placeholder: 'Seleccione un género',
        // outputType: 'tag',
        options: [
            { label: 'Masculino', value: 'M' },
            { label: 'Femenino', value: 'F' },
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
        field: 'dPersNacimiento',
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
        placeholder: 'Seleccione un cargo',
        options: [{ label: 'Docente', value: 'Docente' }],
        width: '5rem',
        field: 'iPersCargoId',
        header: 'Cargo',
        text_header: 'center',
        text: 'center',
    },
]

export const estudiantePlatformTemplateColumns: IColumn[] = [
    {
        type: 'text',
        width: '5rem',
        field: 'iNivelGradoId',
        header: 'Grado',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'text',
        width: '5rem',
        field: 'iSeccionId',
        header: 'Sección',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'text',
        width: '5rem',
        field: 'cTipoIdentSigla',
        header: 'Tipo  de documento',
        text_header: 'center',
        text: 'center',

        inputType: 'dropdown',
        placeholder: 'Seleccione un tipo de documento',
        options: [
            { label: 'DNI', value: 'M' },
            { label: 'RUC', value: 'M' },
            { label: 'CDE', value: 'M' },
            { label: 'OTD', value: 'M' },
        ],
    },
    {
        type: 'text',
        width: '5rem',
        field: 'cPersDocumento',
        header: 'Numero de documento',
        text_header: 'center',
        text: 'center',
    },

    {
        type: 'text',
        width: '5rem',
        field: 'cEstCodigo',
        header: 'Codigo de estudiante',
        text_header: 'center',
        text: 'center',
    },

    {
        type: 'text',
        width: '5rem',
        field: 'cPersPaterno',
        header: 'Apellido paterno',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'text',
        width: '5rem',
        field: 'cPersMaterno',
        header: 'Apellido materno',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'text',
        width: '5rem',
        field: 'cPersNombre',
        header: 'Nombres',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'text',
        width: '5rem',
        field: 'cPersSexo',
        header: 'Sexo',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'text',
        width: '5rem',
        field: 'dPersNacimiento',
        header: 'Fecha de nacimiento',
        text_header: 'center',
        text: 'center',
    },
]

export const ambientesPlatformTemplateColumns: IColumn[] = [
    {
        type: 'text',
        width: '5rem',
        field: 'Turno',
        header: 'Turno',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'text',
        width: '5rem',
        field: 'Modalidad',
        header: 'Modalidad',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'text',
        width: '5rem',
        field: 'dni_tutor',
        header: 'DNI',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'text',
        width: '5rem',
        field: 'Grado',
        header: 'Grado',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'text',
        width: '5rem',
        field: 'Seccion',
        header: 'Sección',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'text',
        width: '5rem',
        field: 'AmbienteArea',
        header: 'Área',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'text',
        width: '5rem',
        field: 'PisoAmbid',
        header: 'Piso',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'text',
        width: '5rem',
        field: 'AmbienteNombre',
        header: 'Nombre',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'text',
        width: '5rem',
        field: 'TipoAmbienteId',
        header: 'Tipo',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'text',
        width: '5rem',
        field: 'EstadoAmbId',
        header: 'Estado',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'text',
        width: '5rem',
        field: 'UbicaAmbId',
        header: 'Ubicación',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'text',
        width: '5rem',
        field: 'iUsoAmbId',
        header: 'Uso',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'text',
        width: '5rem',
        field: 'AmbienteAforo',
        header: 'Aforo',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'text',
        width: '5rem',
        field: 'AmbienteObs',
        header: 'Observación',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'text',
        width: '5rem',
        field: 'AmbienteEstado',
        header: 'Estado',
        text_header: 'center',
        text: 'center',
    },
]

export const resultAmbientesPlatformTemplateColumns: IColumn[] = [
    {
        type: 'text',
        width: '5rem',
        field: 'cTipoIdentId',
        header: 'Tipo de documento',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'text',
        width: '5rem',
        field: 'cPersDocumento',
        header: 'Numero de documento',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'text',
        width: '5rem',
        field: 'nombreCompleto',
        header: 'Nombres',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'text',
        width: '5rem',
        field: 'tbl_persona',
        header: 'Persona',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'text',
        width: '5rem',
        field: 'tbl_docente',
        header: 'Docente',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'text',
        width: '5rem',
        field: 'tbl_docente_ie',
        header: 'Institución educativa',
        text_header: 'center',
        text: 'center',
    },
]
