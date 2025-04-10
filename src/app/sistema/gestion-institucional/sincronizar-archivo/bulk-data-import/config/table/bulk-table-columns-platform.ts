import { IColumn } from '@/app/shared/table-primeng/table-primeng.component'

interface TableColumn {
    inTableColumnsGroup?: IColumn[][]
    inTableColumns: IColumn[]
}
// export const columns = docenteTemplateColumns.
export const docentePlatformTemplateColumns: TableColumn = {
    inTableColumnsGroup: [
        [
            {
                type: 'text',
                width: '5rem',
                field: 'A1/cTipoIdentId',
                header: 'Tipo de documento',
                text_header: 'center',
                text: 'center',
                colspan: 7,
                rowspan: 1,
            },
        ],
        [
            {
                type: 'text',
                width: '5rem',
                field: 'A2/cTipoIdentId',
                header: 'Tipo de documento',
                text_header: 'center',
                text: 'center',
                colspan: 1,
                rowspan: 1,
            },
            {
                type: 'text',
                width: '5rem',
                field: 'B2/cPersDocumento',
                header: 'Número de documento',
                text_header: 'center',
                text: 'center',
                colspan: 1,
                rowspan: 1,
            },
            {
                type: 'text',
                width: '5rem',
                field: 'C2/cPersPaterno',
                header: 'Apellido paterno',
                text_header: 'center',
                text: 'center',
                colspan: 1,
                rowspan: 1,
            },
            {
                type: 'text',
                width: '5rem',
                field: 'D2/cPersMaterno',
                header: 'Apellido materno',
                text_header: 'center',
                text: 'center',
                colspan: 1,
                rowspan: 1,
            },
            {
                type: 'text',
                width: '5rem',
                field: 'E2/cPersNombre',
                header: 'Nombres',
                text_header: 'center',
                text: 'center',
                colspan: 1,
                rowspan: 1,
            },
            {
                type: 'text',
                width: '5rem',
                field: 'F2/cPersSexo',
                header: 'Sexo',
                text_header: 'center',
                text: 'center',
                colspan: 1,
                rowspan: 1,
            },
            {
                type: 'text',
                width: '5rem',
                field: 'G2/iHorasLabora',
                header: 'Horas laborales',
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
            field: 'A2/cTipoIdentId',
            header: 'Tipo de documento',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'B2/cPersDocumento',
            header: 'Número de documento',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'C2/cPersPaterno',
            header: 'Apellido paterno',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'D2/cPersMaterno',
            header: 'Apellido materno',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'E2/cPersNombre',
            header: 'Nombres',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'F2/cPersSexo',
            header: 'Sexo',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'G2/iHorasLabora',
            header: 'Horas laborales',
            text_header: 'center',
            text: 'center',
        },
    ],
}

export const resultDocentePlatformTemplateColumns: IColumn[] = [
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
        header: 'Número de documento',
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
    {
        type: 'text',
        width: '5rem',
        field: 'tbl_persona',
        header: 'Persona',
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

export const ambientesPlatformTemplateColumns: TableColumn = {
    inTableColumnsGroup: [
        [
            {
                type: 'text',
                width: '5rem',
                field: 'A1/Tutor',
                header: 'TUTOR',
                text_header: 'center',
                text: 'center',
                colspan: 5,
                rowspan: 1,
            },
            {
                type: 'text',
                width: '5rem',
                field: 'F1/Ambiente',
                header: 'Ambiente',
                text_header: 'center',
                text: 'center',
                colspan: 10,
                rowspan: 1,
            },
        ],
        [
            {
                type: 'text',
                width: '5rem',
                field: 'A2/Turno',
                header: 'TURNO',
                text_header: 'center',
                text: 'center',
                colspan: 1,
                rowspan: 1,
            },
            {
                type: 'text',
                width: '5rem',
                field: 'B2/Modalidad',
                header: 'MODALIDAD',
                text_header: 'center',
                text: 'center',
                colspan: 1,
                rowspan: 1,
            },
            {
                type: 'text',
                width: '5rem',
                field: 'C2/dni_tutor',
                header: 'DNI',
                text_header: 'center',
                text: 'center',
                colspan: 1,
                rowspan: 1,
            },
            {
                type: 'text',
                width: '5rem',
                field: 'D2/Grado',
                header: 'GRADO',
                text_header: 'center',
                text: 'center',
                colspan: 1,
                rowspan: 1,
            },
            {
                type: 'text',
                width: '5rem',
                field: 'E2/Seccion',
                header: 'SECCIÓN',
                text_header: 'center',
                text: 'center',
                colspan: 1,
                rowspan: 1,
            },
            {
                type: 'text',
                width: '5rem',
                field: 'F2/AmbienteArea',
                header: 'ÁREA',
                text_header: 'center',
                text: 'center',
                colspan: 1,
                rowspan: 1,
            },
            {
                type: 'text',
                width: '5rem',
                field: 'G2/PisoAmbid',
                header: 'PISO',
                text_header: 'center',
                text: 'center',
                colspan: 1,
                rowspan: 1,
            },
            {
                type: 'text',
                width: '5rem',
                field: 'H2/AmbienteNombre',
                header: 'NOMBRE',
                text_header: 'center',
                text: 'center',
                colspan: 1,
                rowspan: 1,
            },
            {
                type: 'text',
                width: '5rem',
                field: 'I2/TipoAmbienteId',
                header: 'TIPO',
                text_header: 'center',
                text: 'center',
                colspan: 1,
                rowspan: 1,
            },
            {
                type: 'text',
                width: '5rem',
                field: 'J2/EstadoAmbId',
                header: 'ESTADO',
                text_header: 'center',
                text: 'center',
                colspan: 1,
                rowspan: 1,
            },
            {
                type: 'text',
                width: '5rem',
                field: 'K2/UbicaAmbId',
                header: 'UBICACIÓN',
                text_header: 'center',
                text: 'center',
                colspan: 1,
                rowspan: 1,
            },
            {
                type: 'text',
                width: '5rem',
                field: 'L2/iUsoAmbId',
                header: 'USO',
                text_header: 'center',
                text: 'center',
                colspan: 1,
                rowspan: 1,
            },
            {
                type: 'text',
                width: '5rem',
                field: 'M2/AmbienteAforo',
                header: 'AFORO',
                text_header: 'center',
                text: 'center',
                colspan: 1,
                rowspan: 1,
            },
            {
                type: 'text',
                width: '5rem',
                field: 'N2/AmbienteObs',
                header: 'OBSERVACIÓN',
                text_header: 'center',
                text: 'center',
                colspan: 1,
                rowspan: 1,
            },
            {
                type: 'text',
                width: '5rem',
                field: 'O2/AmbienteEstado',
                header: 'ESTADO',
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
            field: 'A2/Turno',
            header: 'TURNO',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'B2/Modalidad',
            header: 'MODALIDAD',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'C2/dni_tutor',
            header: 'DNI',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'D2/Grado',
            header: 'GRADO',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'E2/Seccion',
            header: 'SECCIÓN',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'F2/AmbienteArea',
            header: 'ÁREA',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'G2/PisoAmbid',
            header: 'PISO',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'H2/AmbienteNombre',
            header: 'NOMBRE',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'I2/TipoAmbienteId',
            header: 'TIPO',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'J2/EstadoAmbId',
            header: 'ESTADO',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'K2/UbicaAmbId',
            header: 'UBICACIÓN',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'L2/iUsoAmbId',
            header: 'USO',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'M2/AmbienteAforo',
            header: 'AFORO',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'N2/AmbienteObs',
            header: 'OBSERVACIÓN',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'O2/AmbienteEstado',
            header: 'ESTADO',
            text_header: 'center',
            text: 'center',
        },
    ],
}

export const resultAmbientesPlatformTemplateColumns: IColumn[] = [
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
        field: 'ambiente',
        header: 'Ambiente',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'text',
        width: '5rem',
        field: 'Grado_seccion',
        header: 'Grado y sección',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'text',
        width: '5rem',
        field: 'configuracion',
        header: 'Configuración',
        text_header: 'center',
        text: 'center',
    },
]
