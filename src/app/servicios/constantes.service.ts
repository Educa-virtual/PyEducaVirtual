import { Injectable } from '@angular/core'
import { LocalStoreService } from './local-store.service'
import {
    ADMINISTRADOR,
    DIRECTOR_IE,
    DOCENTE,
    ESPECIALISTA_DREMO,
    ESPECIALISTA_UGEL,
    ESTUDIANTE,
    JEFE_DE_PROGRAMA,
    SUBDIRECTOR_IE,
} from './perfilesConstantes'

const store = new LocalStoreService()
// const modulo = store.getItem('dremoModulo')
const perfil = store.getItem('dremoPerfil')
const verificado = store.getItem('dremoPerfilVerificado')
const user = store.getItem('dremoUser')
const iYAcadId = store.getItem('dremoiYAcadId')
const inicio = {
    label: 'Inicio',
    icon: 'pi pi-fw pi-home',
    routerLink: [''],
}
const docente = [
    {
        items: [
            inicio,
            {
                label: 'Portafolio',
                icon: 'pi pi-fw pi-folder',
                routerLink: ['/docente/portafolio'],
            },
            {
                label: 'Mis Áreas Curriculares',
                icon: 'pi pi-fw pi-book',
                routerLink: ['/aula-virtual/areas-curriculares'],
            },
            {
                label: 'Mi Perfil',
                icon: 'pi pi-fw pi-id-card',
                routerLink: ['/docente/perfil'],
            },
            {
                label: 'Actividades No Lectivas',
                icon: 'pi pi-fw pi-list-check',
                routerLink: ['/docente/actividades-no-lectivas'],
            },
            {
                label: 'Informes',
                icon: 'pi pi-fw pi-objects-column',
                routerLink: ['/docente/informes'],
                routerLinkActiveOptions: { exact: false }, // Permite que subrutas coincidan
                items: [
                    {
                        label: 'Logros Alcanzados',
                        icon: 'pi pi-fw pi-share-alt',
                        routerLink: ['/docente/informes'],
                    },
                    // {
                    //     label: 'Reporte Asitencias',
                    //     icon: 'pi pi-fw pi-share-alt',
                    //     routerLink: [''],
                    // },
                ],
            },
            {
                label: 'Mis Capacitaciones',
                icon: 'pi pi-fw pi-sitemap',
                routerLink: ['/docente/capacitaciones'],
            },
            {
                label: 'Enlaces de ayuda',
                icon: 'pi pi-fw pi-share-alt',
                routerLink: ['ayuda'],
            },
            {
                label: 'Calendario',
                icon: 'pi pi-fw pi-calendar-clock',
                routerLink: ['/docente/calendario'],
            },
            {
                label: 'Banco de Preguntas',
                icon: 'pi pi-fw pi-folder',
                routerLink: ['/aula-virtual/banco-preguntas'],
            },
            // {
            //     label: 'Comunicados',
            //     icon: 'pi pi-fw pi-folder',
            //     routerLink: ['/comunicados/principal'],
            // },
            // {
            //     label: 'bienestar',
            //     icon: 'pi pi-fw pi-folder',
            //     routerLink: ['/bienestar/principal'],
            // },
        ],
    },
]

const estudiante = [
    {
        items: [
            inicio,
            {
                label: 'Mis Áreas Curriculares',
                icon: 'pi pi-fw pi-book',
                routerLink: ['/aula-virtual/areas-curriculares'],
            },
            {
                label: 'Calendario',
                icon: 'pi pi-fw pi-book',
                routerLink: ['/aula-virtual/03'],
            },
            {
                label: 'Solicitudes y Tramites',
                icon: 'pi pi-fw pi-book',
                routerLink: ['/aula-virtual/02'],
            },
            {
                label: 'Buzon de Sugerencias',
                icon: 'pi pi-fw pi-book',
                routerLink: ['/aula-virtual/01'],
            },
            {
                label: 'Enlaces de ayuda',
                icon: 'pi pi-fw pi-share-alt',
                routerLink: ['ayuda'],
            },

            {
                label: 'Dremo ERE',
                icon: 'pi pi-fw pi-user',
                items: [
                    {
                        label: 'Evaluacion',
                        icon: 'pi pi-fw pi-share-alt',
                        routerLink: [
                            '/evaluaciones/sub-evaluaciones/evaluacion-examen-ere',
                        ],
                    },
                    // {
                    //     label: 'Examen',
                    //     icon: 'pi pi-fw pi-share-alt',
                    //     routerLink: [
                    //         '/evaluaciones/sub-evaluaciones/evaluacion-examen-ere/examen-ere',
                    //     ],
                    // },
                ],
            },
        ],
    },
]
// const especialista_ugel = [
//     {
//         items: [
//             inicio,
//             {
//                 label: 'Perfiel',
//                 icon: 'pi pi-user',
//                 routerLink: ['/especialista-ugel'],
//             },
//             {
//                 label: 'Evaluaciones',
//                 icon: 'pi pi-fw pi-calendar',
//                 routerLink: ['/evaluaciones/evaluaciones'],
//             },
//             {
//                 label: 'Mis Áreas Curriculares',
//                 icon: 'pi pi-fw pi-folder',
//                 routerLink: ['/evaluaciones/areas'],
//             },
//         ],
//     },
// ]
const administrador = [
    {
        items: [
            inicio,
            {
                label: 'Auditoria',
                icon: 'pi pi-fw pi-folder',
                routerLink: ['/administrador/auditoria'],
            },
            {
                label: 'Componentes',
                icon: 'pi pi-fw pi-folder',
                routerLink: ['/administrador/componentes'],
            },
            {
                label: 'Enlaces de ayuda',
                icon: 'pi pi-fw pi-share-alt',
                routerLink: ['ayuda'],
            },
        ],
    },
]
const jefe_programa = [
    {
        items: [
            inicio,
            {
                label: 'Administracion del Sistema',
                icon: 'pi pi-fw pi-cog',
                items: [
                    {
                        label: 'Registro Calendario Escolar',
                        icon: 'pi pi-fw pi-cog',
                        routerLink: [
                            '/gestion-institucional/calendarioAcademico',
                        ],
                    },
                ],
            },

            {
                label: 'Personas',
                icon: 'pi pi-fw pi-desktop',
                routerLink: ['/configuracion/personas'],
            },
            {
                label: 'Administracion de la I.E',
                icon: 'pi pi-fw pi-cog',
                items: [
                    {
                        label: 'Registro de año escolar',
                        icon: 'pi pi-fw pi-cog',
                        routerLink: ['/configuracion/configuracion'],
                    },
                    {
                        label: 'Personal',
                        icon: 'pi pi-fw pi-cog',
                        routerLink: ['/configuracion/personal'],
                    },
                ],
            },
            {
                label: 'Enlaces de ayuda',
                icon: 'pi pi-fw pi-share-alt',
                routerLink: ['ayuda'],
            },
        ],
    },
]

const notas_evaluaciones = [
    {
        items: [
            inicio,
            {
                label: 'Sincronizar SIAGIE',
                icon: 'pi pi-fw pi-book',
                routerLink: ['/evaluaciones'],
            },
            {
                label: 'Configurar Modulo',
                icon: 'pi pi-fw pi-book',
                routerLink: ['/evaluaciones'],
            },

            {
                label: 'Pruebas Escolares',
                icon: 'pi pi-fw pi-user',
                items: [
                    {
                        label: 'ERE',
                        icon: 'pi pi-fw pi-sign-in',
                        //routerLink: ['/especialista-ugel/ver-evaluacion'],
                        items: [
                            {
                                label: 'Evaluaciones',
                                icon: 'pi pi-fw pi-calendar',
                                routerLink: ['/evaluaciones/evaluaciones'],
                            },
                            {
                                label: 'Preguntas',
                                icon: 'pi pi-fw pi-question',
                                routerLink: ['/evaluaciones/preguntas'],
                            },
                            {
                                label: 'Banco de Preguntas',
                                icon: 'pi pi-fw pi-folder',
                                routerLink: ['/evaluaciones/areas'],
                            },
                            {
                                label: 'Dashboard',
                                icon: 'pi pi-fw pi-user',
                                routerLink: [
                                    '/especialista-ugel/ver-evaluacion',
                                ],
                            },
                            {
                                label: 'Informes',
                                icon: 'pi pi-fw pi-sign-in',
                                //routerLink: ['/especialista-ugel/ver-evaluacion'],
                                items: [
                                    {
                                        label: 'I.E',
                                        icon: 'pi pi-fw pi-user',
                                        routerLink: [
                                            '/especialista-ugel/institucion-educativa',
                                        ],
                                    },
                                    {
                                        label: 'Distritos',
                                        icon: 'pi pi-fw pi-user',
                                        routerLink: [
                                            '/especialista-ugel/distritos-informe',
                                        ],
                                    },
                                    {
                                        label: 'Respuesta',
                                        icon: 'pi pi-fw pi-user',
                                        routerLink: [
                                            '/especialista-ugel/respuesta-evaluacion',
                                        ],
                                    },

                                    {
                                        label: 'Est. Archivos',
                                        icon: 'pi pi-fw pi-user',
                                        routerLink: [
                                            '/especialista-ugel/estado-archivos',
                                        ],
                                    },
                                    {
                                        label: 'Proc. Archivo. DRE',
                                        icon: 'pi pi-fw pi-user',
                                        routerLink: [
                                            '/especialista-ugel/procesar-archivos',
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        label: 'Prueba ECE',
                        icon: 'pi pi-fw pi-times-circle',
                        routerLink: ['/evaluaciones/preguntas-activas'],
                    },
                ],
            },
            {
                label: 'Enlaces de ayuda',
                icon: 'pi pi-fw pi-share-alt',
                routerLink: ['ayuda'],
            },
            //Borrar
            // {
            //     label: 'Mis Áreas Curriculares',
            //     icon: 'pi pi-fw pi-folder',
            //     routerLink: ['/evaluaciones/areas'],
            // },
            // {
            //     label: 'Configuración',
            //     icon: 'pi pi-fw pi-user',
            //     items: [
            //         {
            //             label: 'Competencias',
            //             icon: 'pi pi-fw pi-sign-in',
            //             routerLink: ['/evaluaciones/competencias'],
            //         },
            //         {
            //             label: 'Capacidades',
            //             icon: 'pi pi-fw pi-times-circle',
            //             routerLink: ['/evaluaciones/preguntas-activas'],
            //         },
            //         {
            //             label: 'Desempeños',
            //             icon: 'pi pi-fw pi-times-circle',
            //             routerLink: ['/evaluaciones/preguntas-activas'],
            //         },
            //     ],
            // },
        ],
    },
]

// const director = [
//     {
//         items: [
//             inicio,
//             {
//                 label: 'Mis Áreas Curriculares',
//                 icon: 'pi pi-fw pi-book',
//                 routerLink: ['/aula-virtual/areas-curriculares'],
//             },
//             {
//                 label: 'Calendario',
//                 icon: 'pi pi-fw pi-calendar',
//                 routerLink: ['/aula-virtual/calendario'],
//             },
//             {
//                 label: 'Recursos',
//                 icon: 'pi pi-fw pi-folder',
//                 routerLink: ['/aula-virtual/recursos'],
//             },
//             {
//                 label: 'DashBoard',
//                 icon: 'pi pi-fw pi-chart-bar',
//                 routerLink: ['/aula-virtual'],
//             },
//         ],
//     },
// ]

// const other = [
//     {
//         label: 'Home',
//         items: [
//             { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
//         ],
//     },
//     {
//         label: 'UI Components',
//         items: [
//             {
//                 label: 'Form Layout',
//                 icon: 'pi pi-fw pi-id-card',
//                 routerLink: ['/uikit/formlayout'],
//             },
//             {
//                 label: 'Input',
//                 icon: 'pi pi-fw pi-check-square',
//                 routerLink: ['/uikit/input'],
//             },
//             {
//                 label: 'Float Label',
//                 icon: 'pi pi-fw pi-bookmark',
//                 routerLink: ['/uikit/floatlabel'],
//             },
//             {
//                 label: 'Invalid State',
//                 icon: 'pi pi-fw pi-exclamation-circle',
//                 routerLink: ['/uikit/invalidstate'],
//             },
//             {
//                 label: 'Button',
//                 icon: 'pi pi-fw pi-box',
//                 routerLink: ['/uikit/button'],
//             },
//             {
//                 label: 'Table',
//                 icon: 'pi pi-fw pi-table',
//                 routerLink: ['/uikit/table'],
//             },
//             {
//                 label: 'List',
//                 icon: 'pi pi-fw pi-list',
//                 routerLink: ['/uikit/list'],
//             },
//             {
//                 label: 'Tree',
//                 icon: 'pi pi-fw pi-share-alt',
//                 routerLink: ['/uikit/tree'],
//             },
//             {
//                 label: 'Panel',
//                 icon: 'pi pi-fw pi-tablet',
//                 routerLink: ['/uikit/panel'],
//             },
//             {
//                 label: 'Overlay',
//                 icon: 'pi pi-fw pi-clone',
//                 routerLink: ['/uikit/overlay'],
//             },
//             {
//                 label: 'Media',
//                 icon: 'pi pi-fw pi-image',
//                 routerLink: ['/uikit/media'],
//             },
//             {
//                 label: 'Menu',
//                 icon: 'pi pi-fw pi-bars',
//                 routerLink: ['/uikit/menu'],
//                 routerLinkActiveOptions: {
//                     paths: 'subset',
//                     queryParams: 'ignored',
//                     matrixParams: 'ignored',
//                     fragment: 'ignored',
//                 },
//             },
//             {
//                 label: 'Message',
//                 icon: 'pi pi-fw pi-comment',
//                 routerLink: ['/uikit/message'],
//             },
//             {
//                 label: 'File',
//                 icon: 'pi pi-fw pi-file',
//                 routerLink: ['/uikit/file'],
//             },
//             {
//                 label: 'Chart',
//                 icon: 'pi pi-fw pi-chart-bar',
//                 routerLink: ['/uikit/charts'],
//             },
//             {
//                 label: 'Misc',
//                 icon: 'pi pi-fw pi-circle',
//                 routerLink: ['/uikit/misc'],
//             },
//         ],
//     },
//     {
//         label: 'Prime Blocks',
//         items: [
//             {
//                 label: 'Free Blocks',
//                 icon: 'pi pi-fw pi-eye',
//                 routerLink: ['/blocks'],
//                 badge: 'NEW',
//             },
//             {
//                 label: 'All Blocks',
//                 icon: 'pi pi-fw pi-globe',
//                 url: ['https://www.primefaces.org/primeblocks-ng'],
//                 target: '_blank',
//             },
//         ],
//     },
//     {
//         label: 'Utilities',
//         items: [
//             {
//                 label: 'PrimeIcons',
//                 icon: 'pi pi-fw pi-prime',
//                 routerLink: ['/utilities/icons'],
//             },
//             {
//                 label: 'PrimeFlex',
//                 icon: 'pi pi-fw pi-desktop',
//                 url: ['https://www.primefaces.org/primeflex/'],
//                 target: '_blank',
//             },
//         ],
//     },
//     {
//         label: 'Pages',
//         icon: 'pi pi-fw pi-briefcase',
//         items: [
//             {
//                 label: 'Landing',
//                 icon: 'pi pi-fw pi-globe',
//                 routerLink: ['/landing'],
//             },
//             {
//                 label: 'Auth',
//                 icon: 'pi pi-fw pi-user',
//                 items: [
//                     {
//                         label: 'Login',
//                         icon: 'pi pi-fw pi-sign-in',
//                         routerLink: ['/auth/login'],
//                     },
//                     {
//                         label: 'Error',
//                         icon: 'pi pi-fw pi-times-circle',
//                         routerLink: ['/auth/error'],
//                     },
//                     {
//                         label: 'Access Denied',
//                         icon: 'pi pi-fw pi-lock',
//                         routerLink: ['/auth/access'],
//                     },
//                 ],
//             },
//             {
//                 label: 'Crud',
//                 icon: 'pi pi-fw pi-pencil',
//                 routerLink: ['/pages/crud'],
//             },
//             {
//                 label: 'Timeline',
//                 icon: 'pi pi-fw pi-calendar',
//                 routerLink: ['/pages/timeline'],
//             },
//             {
//                 label: 'Not Found',
//                 icon: 'pi pi-fw pi-exclamation-circle',
//                 routerLink: ['/notfound'],
//             },
//             {
//                 label: 'Empty',
//                 icon: 'pi pi-fw pi-circle-off',
//                 routerLink: ['/pages/empty'],
//             },
//         ],
//     },
//     {
//         label: 'Hierarchy',
//         items: [
//             {
//                 label: 'Submenu 1',
//                 icon: 'pi pi-fw pi-bookmark',
//                 items: [
//                     {
//                         label: 'Submenu 1.1',
//                         icon: 'pi pi-fw pi-bookmark',
//                         items: [
//                             {
//                                 label: 'Submenu 1.1.1',
//                                 icon: 'pi pi-fw pi-bookmark',
//                             },
//                             {
//                                 label: 'Submenu 1.1.2',
//                                 icon: 'pi pi-fw pi-bookmark',
//                             },
//                             {
//                                 label: 'Submenu 1.1.3',
//                                 icon: 'pi pi-fw pi-bookmark',
//                             },
//                         ],
//                     },
//                     {
//                         label: 'Submenu 1.2',
//                         icon: 'pi pi-fw pi-bookmark',
//                         items: [
//                             {
//                                 label: 'Submenu 1.2.1',
//                                 icon: 'pi pi-fw pi-bookmark',
//                             },
//                         ],
//                     },
//                 ],
//             },
//             {
//                 label: 'Submenu 2',
//                 icon: 'pi pi-fw pi-bookmark',
//                 items: [
//                     {
//                         label: 'Submenu 2.1',
//                         icon: 'pi pi-fw pi-bookmark',
//                         items: [
//                             {
//                                 label: 'Submenu 2.1.1',
//                                 icon: 'pi pi-fw pi-bookmark',
//                             },
//                             {
//                                 label: 'Submenu 2.1.2',
//                                 icon: 'pi pi-fw pi-bookmark',
//                             },
//                         ],
//                     },
//                     {
//                         label: 'Submenu 2.2',
//                         icon: 'pi pi-fw pi-bookmark',
//                         items: [
//                             {
//                                 label: 'Submenu 2.2.1',
//                                 icon: 'pi pi-fw pi-bookmark',
//                             },
//                         ],
//                     },
//                 ],
//             },
//         ],
//     },
//     {
//         label: 'Get Started',
//         items: [
//             {
//                 label: 'Documentation',
//                 icon: 'pi pi-fw pi-question',
//                 routerLink: ['/documentation'],
//             },
//             {
//                 label: 'View Source',
//                 icon: 'pi pi-fw pi-search',
//                 url: ['https://github.com/primefaces/sakai-ng'],
//                 target: '_blank',
//             },
//         ],
//     },
// ]

const registro_asistencia = [
    {
        items: [inicio],
    },
    {
        label: 'Enlaces de ayuda',
        icon: 'pi pi-fw pi-share-alt',
        routerLink: ['ayuda'],
    },
]

// const seguridad = [
//     {
//         items: [inicio],
//     },
// ]

const administracion = [
    {
        label: 'Administración',
        items: [
            {
                label: 'Administracion de tablas maestras',
                icon: 'pi pi-fw pi-cog',
                items: [
                    {
                        label: 'Registro de año escolar',
                        icon: 'pi pi-wrench',
                        routerLink: [
                            '/gestion-institucional/calendarioAcademico',
                        ],
                    },
                ],
            },

            {
                label: 'Configurar Calendario escolar',
                icon: 'pi pi-calendar',
                items: [
                    {
                        label: 'Apertura de año escolar',
                        icon: 'pi pi-lock-open',
                        routerLink: ['/configuracion/configuracion'],
                    },
                    {
                        label: 'Registro de fechas especiales',
                        icon: 'pi pi-calendar',
                        routerLink: ['/gestion-institucional/fechas'],
                    },

                    {
                        label: 'Cierre de año escolar',
                        icon: 'pi pi-lock',
                        routerLink: ['/configuracion/configuracion'],
                    },
                ],
            },

            {
                label: 'Registro de condiciones operativas',
                icon: 'pi pi-briefcase',
                items: [
                    {
                        label: 'Gestion de Ambientes y Grados',
                        icon: 'pi pi-building-columns',
                        routerLink: [
                            '/gestion-institucional/configGradoSeccion',
                        ],
                    },

                    {
                        label: 'Gestión de Personal',
                        icon: 'pi pi-users',
                        items: [
                            {
                                label: 'Personal de IE',
                                icon: 'pi pi-user-plus',
                                routerLink: [
                                    '/gestion-institucional/IesPersonal',
                                ],
                            },
                            {
                                label: 'Cargos',
                                icon: 'pi pi-wrench',
                                routerLink: ['/configuracion/configuracion'],
                            },
                        ],
                        //ConfigGradoSeccion
                    },
                    {
                        label: 'Gestión de horarios y asignaciones',
                        icon: 'pi pi-calendar',
                        items: [
                            {
                                label: 'Configuracion de horarios',
                                icon: 'pi pi-calendar-clock',
                                routerLink: ['/horario/configurar-horario'],
                            },
                            {
                                label: 'horarios',
                                icon: 'pi pi-calendar-times',
                                routerLink: ['/horario/horario'],
                            },
                        ],
                    },
                ],
            },
            {
                label: 'Gestión de Matrículas',
                icon: 'pi pi-folder',
                items: [
                    {
                        label: 'Matrícula de estudiantes',
                        icon: 'pi pi-user-edit',
                        // routerLink: ['/gestion-institucional/gestion-traslados'],
                    },
                    {
                        label: 'Gestión de traslado',
                        icon: 'pi pi-folder-open',
                        routerLink: [
                            '/gestion-institucional/gestion-traslados',
                        ],
                    },
                    {
                        label: 'Informe de vacantes',
                        icon: 'pi pi-file-import',
                        routerLink: ['/gestion-institucional/gestion-vacantes'],
                    },
                ],
            },

            {
                label: 'Generación de Reportes y estadísticas',
                icon: 'pi pi-chart-bar',
                items: [
                    {
                        label: 'Reportes',
                        icon: 'pi pi-book',
                        routerLink: ['/configuracion/configuracion'],
                    },
                    {
                        label: 'Estadisticas',
                        icon: 'pi pi-chart-scatter',
                        routerLink: ['/configuracion/configuracion'],
                    },
                    {
                        label: 'Indicadores',
                        icon: 'pi pi-chart-line',
                        routerLink: ['/configuracion/configuracion'],
                    },
                    {
                        label: 'Plantillas',
                        icon: 'pi pi-download',
                        routerLink: ['/configuracion/configuracion'],
                    },
                ],
                //ConfigGradoSeccion
            },

            {
                label: 'Evaluación - ERE',
                icon: 'pi pi-address-book',
                items: [
                    {
                        label: 'Configuración de ERE',
                        icon: 'pi pi-wrench',
                        routerLink: ['/configuracion/configuracion'],
                    },
                    {
                        label: 'Resultados de ERE',
                        icon: 'pi pi-chart-bar',
                        routerLink: ['/configuracion/configuracion'],
                    },
                ],
                //ConfigGradoSeccion
            },

            {
                label: 'Enlaces de ayuda',
                icon: 'pi pi-fw pi-share-alt',
                routerLink: ['ayuda'],
            },
        ],
    },
]

// const comunicado = [
//     {
//         items: [inicio],
//     },
// ]

// const concurso_docente = [
//     {
//         items: [inicio],
//     },
// ]

// const apoderados = [
//     {
//         items: [inicio],
//     },
// ]

const first = [
    {
        items: [inicio],
    },
]

@Injectable({
    providedIn: 'root',
})
export class ConstantesService {
    iPersId = user ? user.iPersId : null
    iCredId = user ? user.iCredId : null
    iDocenteId = user ? user?.iDocenteId : null
    iNivelCicloId = user?.iNivelCicloId ?? 1
    iEspecialistaId = user?.iEspecialistaId ?? 1
    iEstudianteId = user ? user?.iEstudianteId : null
    iPerfilId = perfil ? Number(perfil.iPerfilId) : null
    // verificar si viene del usuario/perfil
    iCurrContId = user?.iCurrContId ?? 1
    iYAcadId = iYAcadId

    nav = this.getMenu()
    getMenu() {
        if (!perfil) return first
        //console.log('perfiles', perfil)
        switch (Number(perfil.iPerfilId)) {
            case ADMINISTRADOR:
                return administrador
            case ESPECIALISTA_DREMO:
                return notas_evaluaciones
            case ESPECIALISTA_UGEL:
                return notas_evaluaciones
            case ESTUDIANTE:
                return estudiante
            case SUBDIRECTOR_IE:
                return registro_asistencia
            case JEFE_DE_PROGRAMA:
                return jefe_programa
            case DOCENTE:
                return docente
            case DIRECTOR_IE:
                return administracion
            default:
                return first
        }
    }
    // getMenu() {
    //     if (!modulo) return first
    //     switch (Number(modulo.iModuloId)) {
    //         case 1:
    //             return aula_virtual
    //         case 2:
    //             return docente
    //         case 3:
    //             return estudiante
    //         case 4:
    //             return notas_evaluaciones
    //         case 5:
    //             return registro_asistencia
    //         case 6:
    //             return administrador
    //         case 7:
    //             return seguridad
    //         case 8:
    //             return bienestar
    //         case 9:
    //             return comunicado
    //         case 10:
    //             return concurso_docente
    //         case 11:
    //             return apoderados
    //         case 12:
    //             return especialista_ugel
    //         default:
    //             return first
    //     }
    // }
    verificado = verificado

    nombres = user
        ? user.cPersNombre + ' ' + user.cPersPaterno + ' ' + user.cPersMaterno
        : null
    nombre = user ? user.cPersNombre : null
}
