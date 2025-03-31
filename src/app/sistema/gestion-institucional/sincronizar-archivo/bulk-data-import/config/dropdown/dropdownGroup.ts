import {
    estudianteTemplateSiagieColumns,
    // padresFamiliasTemplateColumns,
    resultEstudianteTemplateSiagieColumns,
} from '@/app/sistema/gestion-institucional/sincronizar-archivo/bulk-data-import/config/table/bulk-table-columns-siagie'
import {
    ambientesPlatformTemplateColumns,
    docentePlatformTemplateColumns,
    resultAmbientesPlatformTemplateColumns,
    resultDocentePlatformTemplateColumns,
} from '../table/bulk-table-columns-platform'

export const dropdownGroupConfig = [
    {
        id: 1,
        label: 'Origen de la plantilla:',
        placeholder: 'Seleccione un origen',
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
        label: 'Tipo de plantilla:',
        placeholder: 'Seleccione una plantilla',
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
                    typeSend: 'file',
                    response: (response: any) => {
                        return response.data
                    },
                },
            },
            // {
            //     label: 'Padres de familia',
            //     value: {
            //         id: 2,
            //         cellData: 'B13',
            //         columns: padresFamiliasTemplateColumns,
            //         columnsResultImport: resultEstudianteTemplateSiagieColumns,
            //         importEndPoint:
            //             'acad/estudiante/importarEstudiantesPadresExcel',
            //         params: {
            //             iSedeId: JSON.parse(
            //                 localStorage.getItem('dremoPerfil') || '{}'
            //             ).iSedeId,
            //             iYAcadId: JSON.parse(
            //                 localStorage.getItem('dremoiYAcadId') || 'null'
            //             ),
            //             iCredId: JSON.parse(
            //                 localStorage.getItem('dremoPerfil') || '{}'
            //             ).iCredId,
            //         },
            //         typeSend: 'file',
            //         response: (response: any) => {
            //             return response.data
            //         },
            //     },
            // },
        ],
        dependency: 1,
        optionValue: 1,
    },
    {
        // Plataforma educativa
        id: 3,
        label: 'Tipo de plantilla:',
        placeholder: 'Seleccione una plantilla',
        options: [
            {
                label: 'Docentes',
                value: {
                    id: 1,
                    cellData: 'A2',
                    columns: docentePlatformTemplateColumns,
                    columnsResultImport: resultDocentePlatformTemplateColumns,
                    importEndPoint:
                        'acad/gestionInstitucional/importarDocente_IE',
                    template: 'plantilla-docentes',
                    typeSend: 'json',
                    params: {
                        iSedeId: JSON.parse(
                            localStorage.getItem('dremoPerfil') || '{}'
                        ).iSedeId,
                        iYAcadId: JSON.parse(
                            localStorage.getItem('dremoiYAcadId') || 'null'
                        ),
                    },
                    response: (response: any) => {
                        return response.procesados.map((data) => ({
                            ...data.item,
                            nombreCompleto: `${data.item.cPersPaterno} ${data.item.cPersMaterno} ${data.item.cPersNombre}`,
                            ...data.data[0],
                        }))
                    },
                },
            },
            // {
            //     label: 'Estudiantes',
            //     value: {
            //         id: 2,
            //         cellData: 'A3',
            //         columns: estudiantePlatformTemplateColumns,
            //         template: 'plantilla-estudiantes',
            //         importEndPoint: '',
            //         typeSend: 'json',
            //     },
            // },
            {
                label: 'Ambientes',
                value: {
                    id: 3,
                    cellData: 'A3',
                    columns: ambientesPlatformTemplateColumns,
                    columnsResultImport: resultAmbientesPlatformTemplateColumns,
                    template: 'plantilla-ambientes',
                    importEndPoint:
                        'acad/gestionInstitucional/importarAmbiente_IE',
                    typeSend: 'json',
                    params: {
                        iSedeId: JSON.parse(
                            localStorage.getItem('dremoPerfil') || '{}'
                        ).iSedeId,
                        iYAcadId: JSON.parse(
                            localStorage.getItem('dremoiYAcadId') || 'null'
                        ),
                        iNivelTipoId: JSON.parse(
                            localStorage.getItem('dremoPerfil') || 'null'
                        ).iNivelTipoId,
                    },
                    response: (response) => {
                        return response.procesados.map((data) => ({
                            ...data.data[0],
                            ...data.item,
                        }))
                    },
                },
            },
        ],
        dependency: 1,
        optionValue: 2,
    },
]
