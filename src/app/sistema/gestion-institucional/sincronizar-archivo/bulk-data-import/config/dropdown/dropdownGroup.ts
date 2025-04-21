import {
    estudianteTemplateSiagieColumns,
    headerTemplateSiagie,
    padresFamiliasTemplateColumns2,
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
                    structures: [
                        {
                            header: 'B11:AB12',
                            data: 'B13',
                            columns: estudianteTemplateSiagieColumns,
                            inTableColumn: true,
                        },
                        {
                            header: 'F7:R7',
                            data: 'F8:R8',
                            columns: headerTemplateSiagie,
                        },
                    ],
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

                    // requests: ([estudiante,apoderado, ]) => {

                    // }
                },
            },
            {
                label: 'Padres de familia',
                value: {
                    id: 2,
                    structures: [
                        {
                            header: 'B11:AZ12',
                            data: 'B13',
                            columns: padresFamiliasTemplateColumns2,
                            inTableColumn: true,
                        },
                        // {
                        //     header: 'AS11:AZ12',
                        //     data: 'AS13',
                        //     columns: apoderadoPadresFamiliasTemplateColumns,
                        //     inTableColumn: true,
                        // },
                        {
                            header: 'M7:V7',
                            data: 'M8:V8',
                            columns: headerTemplateSiagie,
                        },
                    ],
                    cellData: 'B15',
                    columnsResultImport: resultEstudianteTemplateSiagieColumns,
                    importEndPoint:
                        'acad/estudiante/importarEstudiantesPadresExcel',
                    params: {
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
            //     label: 'Resultados de evaluación',
            //     value: {
            //         id: 3,
            //         sheetName: 'Consolidado',
            //         structures: [
            //             {
            //                 header: 'A1:AQ1',
            //                 data: 'A2',
            //                 columns: resultadosEvaluacionTemplateColumns,
            //                 inTableColumn: true,
            //             },
            //             {
            //                 header: 'F7:R7',
            //                 data: 'F8:R8',
            //                 columns: headerTemplateSiagie,
            //             },
            //         ],
            //         columns: estudianteTemplateSiagieColumns,
            //         columnsResultImport: resultEstudianteTemplateSiagieColumns,
            //         importEndPoint:
            //             'acad/estudiante/importarEstudiantesMatriculasExcel',
            //         params: {
            //             tipo: 'matriculas',
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

            //         // requests: ([estudiante,apoderado, ]) => {

            //         // }
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
                    structures: [
                        {
                            header: 'A1:G2',
                            data: 'A3',
                            columns: docentePlatformTemplateColumns,
                            inTableColumn: true,
                        },
                    ],
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
                            nombreCompleto: [
                                data.item.cPersPaterno,
                                data.item.cPersMaterno,
                                data.item.cPersNombre,
                            ]
                                .filter(Boolean)
                                .join(' '),
                            ...data.data[0],
                        }))
                    },
                },
            },
            {
                label: 'Ambientes',
                value: {
                    id: 3,
                    structures: [
                        {
                            header: 'A1:O2',
                            data: 'A3',
                            columns: ambientesPlatformTemplateColumns,
                            inTableColumn: true,
                        },
                    ],
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
                    // payload: (data) => {
                    //     return data.map(row => {

                    //         return {

                    //         }
                    //     })
                    // },
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
