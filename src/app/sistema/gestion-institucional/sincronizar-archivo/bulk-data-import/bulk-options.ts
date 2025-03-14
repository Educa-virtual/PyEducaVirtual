interface IDropDown {
    label: string
    value: originCollections
    [key: string]: any
}

// Valores del origen
enum originCollections {
    SIAGIE,
    PLATAFORMA_EDUCATIVA,
}

// Opciones del dropdown para el origen

export const originCollectionsDropdown: IDropDown[] = [
    {
        label: 'SIAGIE',
        value: originCollections.SIAGIE,
        options: [
            { label: 'Docentes', value: '' },
            { label: 'Docentes', value: '' },
        ],
    },
    {
        label: 'Plataforma educativa',
        value: originCollections.PLATAFORMA_EDUCATIVA,
    },
]

// Opciones del dropdown para el tipo de colección
export const typeCollectionsDropdown = {
    [originCollections.SIAGIE]: [
        {
            label: 'Docentes',
            name: 'plantilla-docente.xlsx',
            api: 'validatedDocentes',
        },
        {
            label: 'Estudiantes',
            name: 'plantilla-estudiante.xlsx',
            api: 'validatedEstudiantes',
        },
    ],
    [originCollections.PLATAFORMA_EDUCATIVA]: [
        {
            label: 'Docentes',
            name: 'plantilla-docente-plataforma.xlsx',
            api: 'validatedDocentesPlataforma',
        },
        {
            label: 'Estudiantes',
            name: 'plantilla-estudiante-plataforma.xlsx',
            api: 'validatedEstudiantesPlataforma',
        },
        {
            label: 'Cursos',
            name: 'plantilla-estudiante-plataforma.xlsx',
            api: 'validatedEstudiantesPlataforma',
        },
        {
            label: 'Horarios',
            name: 'plantilla-estudiante-plataforma.xlsx',
            api: 'validatedEstudiantesPlataforma',
        },
    ],
}
