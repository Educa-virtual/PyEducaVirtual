import {
    estudianteTemplateSiagieColumns,
    resultEstudianteTemplateSiagieColumns,
} from '@/app/sistema/gestion-institucional/sincronizar-archivo/bulk-data-import/config/table/bulk-table-columns-siagie'
import {
    ambientesPlatformTemplateColumns,
    docentePlatformTemplateColumns,
    estudiantePlatformTemplateColumns,
} from '../table/bulk-table-columns-platform'

export const dropdownGroupConfig = [
    {
        id: 1,
        label: 'Origen de la colección:',
        placeholder: 'Seleccione una entidad',
        options: [
            {
                value: {
                    id: 1,
                },
                label: 'SIAGIE',
            },
            {
                value: {
                    id: 2,
                },
                label: 'Plataforma educativa',
            },
        ],
    },
    {
        // SIAGIE
        id: 2,
        label: 'Tipo de la colección:',
        placeholder: 'Seleccione una colección',
        options: [
            {
                label: 'Estudiante',
                value: {
                    id: 1,
                    cellData: 'B13',
                    columns: estudianteTemplateSiagieColumns,
                    columnsResultImport: resultEstudianteTemplateSiagieColumns,
                    importEndPoint:
                        'acad/estudiante/importarEstudiantesMatriculasExcel',
                    params: {
                        tipo: 'matriculas',
                        iSedeId: JSON.parse(
                            localStorage.getItem('dremoPerfil') || '{}'
                        ).iSedeId,
                        iYAcadId: JSON.parse(
                            localStorage.getItem('dremoiYAcadId') || 'null'
                        ),
                        iCredId: JSON.parse(
                            localStorage.getItem('dremoPerfil') || '{}'
                        ).iCredId,
                    },
                },
            },
        ],
        dependency: 1,
        optionValue: 1,
    },
    {
        // Plataforma educativa
        id: 3,
        label: 'Tipo de la colección:',
        placeholder: 'Seleccione una colección',
        options: [
            {
                label: 'Docente',
                value: {
                    id: 1,
                    cellData: 'A2',
                    columns: docentePlatformTemplateColumns,
                    endPoint: '',
                },
            },
            {
                label: 'Estudiante',
                value: {
                    id: 2,
                    cellData: 'A2',
                    columns: estudiantePlatformTemplateColumns,
                },
            },
            {
                label: 'Ambientes',
                value: {
                    id: 3,
                    cellData: 'A2',
                    columns: ambientesPlatformTemplateColumns,
                },
            },
        ],
        dependency: 1,
        optionValue: 2,
    },
]
