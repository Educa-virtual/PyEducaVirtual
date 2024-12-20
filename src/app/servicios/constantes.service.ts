import { Injectable } from '@angular/core'
import { LocalStoreService } from './local-store.service'

const store = new LocalStoreService()
// const modulo = store.getItem('dremoModulo')
const perfil = store.getItem('dremoPerfil')
const verificado = store.getItem('dremoPerfilVerificado')
const user = store.getItem('dremoUser')
const iYAcadId = store.getItem('dremoYear')
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
                label: 'Mis Áreas Curriculares',
                icon: 'pi pi-fw pi-folder',
                routerLink: ['/evaluaciones/areas'],
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
                                label: 'Banco de Preguntas',
                                icon: 'pi pi-fw pi-folder',
                                routerLink: ['/evaluaciones/areas'],
                            },
                            {
                                label: 'Evaluaciones',
                                icon: 'pi pi-fw pi-calendar',
                                routerLink: ['/evaluaciones/evaluaciones'],
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
                    {
                        label: 'Registro de fechas especiales',
                        icon: 'pi pi-fw pi-cog',
                        routerLink: ['/gestion-institucional/fechas'],
                    },
                ],
                //ConfigGradoSeccion
            },

            {
                label: 'Administración de la IE',
                icon: 'pi pi-fw pi-cog',
                items: [
                    {
                        label: 'Apertura de año escolar',
                        icon: 'pi pi-fw pi-circle',
                        routerLink: ['/configuracion/configuracion'],
                    },
                    {
                        label: 'Fechas especiales',
                        icon: 'pi pi-fw pi-circle',
                        routerLink: ['/configuracion/configuracion'],
                    },

                    {
                        label: 'Personal de IE',
                        icon: 'pi pi-fw pi-circle',
                        routerLink: ['/gestion-institucional/IesPersonal'],
                    },
                    {
                        label: 'Cargos',
                        icon: 'pi pi-fw pi-circle',
                        routerLink: ['/configuracion/configuracion'],
                    },
                    {
                        label: 'Diseño curricular',
                        icon: 'pi pi-fw pi-circle',
                        routerLink: ['/configuracion/configuracion'],
                    },
                    {
                        label: 'Configuracion de grados y secciones',
                        icon: 'pi pi-fw pi-circle',
                        badge: 'NEW',
                        routerLink: [
                            '/gestion-institucional/configGradoSeccion',
                        ],
                    },
                    {
                        label: 'Programa de estudio',
                        icon: 'pi pi-fw pi-circle',
                        badge: 'NEW',
                        routerLink: ['/'],
                    },
                    {
                        label: 'Actualizar Datos de la I.E.',
                        icon: 'pi pi-fw pi-circle',
                        routerLink: ['/configuracion/configuracion'],
                    },
                    {
                        label: 'Aprendizaje',
                        icon: 'pi pi-fw pi-circle',
                        routerLink: ['/configuracion/configuracion'],
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
            case 1:
                return administrador
            case 2:
                return notas_evaluaciones
            case 3:
                return notas_evaluaciones
            case 8:
                return estudiante
            case 5:
                return registro_asistencia
            case 6:
                return jefe_programa
            case 7:
                return docente
            case 4:
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
