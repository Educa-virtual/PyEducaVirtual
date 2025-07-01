import { Injectable } from '@angular/core'
import { LocalStoreService } from './local-store.service'
import {
    ADMINISTRADOR,
    DIRECTOR_IE,
    DOCENTE,
    ESTUDIANTE,
    JEFE_DE_PROGRAMA,
    SUBDIRECTOR_IE,
    APODERADO,
    AUXILIAR,
} from './perfilesConstantes'
import {
    ADMINISTRADOR_DREMO,
    ESPECIALISTA_DREMO,
    ESPECIALISTA_UGEL,
} from './seg/perfiles'
import {
    administradorDremo,
    especialistaDremo,
    especialistaUgel,
} from './seg/menu-ere'

const store = new LocalStoreService()
// const modulo = store.getItem('dremoModulo')
const perfil = store.getItem('dremoPerfil')
const verificado = store.getItem('dremoPerfilVerificado')
const user = store.getItem('dremoUser')
const iYAcadId = store.getItem('dremoiYAcadId')
const years = store.getItem('dremoYear')
const inicio = {
    label: 'Inicio',
    icon: 'pi pi-fw pi-home',
    routerLink: ['/inicio'],
}
const docente = [
    {
        items: [
            inicio,
            {
                label: 'Comunicados',
                icon: 'pi pi-fw pi-bell',
                routerLink: ['/docente/comunicados'],
            },
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
                label: 'Aula virtual',
                icon: 'pi pi-id-card',
                // routerLink: ['/aula-virtual/capacitate-docente'],
                items: [
                    {
                        label: 'Capacitate',
                        icon: 'pi pi-book',
                        routerLink: ['/aula-virtual/capacitate-docente'],
                    },
                    {
                        label: 'Mis Áreas Curriculares',
                        icon: 'pi pi-book',
                        routerLink: ['/aula-virtual/'],
                    },
                ],
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
            {
                label: 'Bienestar Social',
                icon: 'pi pi-fw pi-check-square',
                items: [
                    {
                        label: 'Recordatorios de cumpleaños',
                        icon: 'pi pi-fw pi-bell',
                    },
                ],
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
                label: 'Evaluación ERE',
                icon: 'pi pi-pen-to-square',
                routerLink: ['/ere/evaluacion/areas'],
            },
            {
                label: 'Practicar evaluación ERE',
                icon: 'pi pi-pen-to-square',
                routerLink: ['/ere/evaluacion-practica'],
            },
            /*, TEMPORALMENTE DESACTIVADO POR PRIORIDAD DE ERE
            {
                label: 'Buzón de sugerencias',
                icon: 'pi pi-fw pi-envelope',
                routerLink: ['/estudiante/buzon-sugerencias'],
            },*/
            {
                label: 'Bienestar Social',
                icon: 'pi pi-fw pi-check-square',
                items: [
                    {
                        label: 'Ficha Socioeconomica',
                        icon: 'pi pi-fw pi-file-edit',
                        routerLink: ['/bienestar/ficha-declaracion'],
                    },
                    {
                        label: 'Gestionar encuestas',
                        icon: 'pi pi-fw pi-list-check',
                        routerLink: ['/bienestar/gestionar-encuestas'],
                    },
                    {
                        label: 'Recordatorios de cumpleaños',
                        icon: 'pi pi-fw pi-bell',
                        routerLink: ['/bienestar/recordario-fechas'],
                    },
                ],
            },
            {
                label: 'Bienestar Social',
                icon: 'pi pi-fw pi-check-square',
                items: [
                    {
                        label: 'Ficha Socioeconomica',
                        icon: 'pi pi-fw pi-file-edit',
                        routerLink: ['/bienestar/ficha'],
                    },
                    {
                        label: 'Gestionar encuestas',
                        icon: 'pi pi-fw pi-list-check',
                        routerLink: ['/bienestar/gestionar-encuestas'],
                    },
                    {
                        label: 'Recordatorios de cumpleaños',
                        icon: 'pi pi-fw pi-bell',
                    },
                ],
            },
        ],
    },
]

const administrador = [
    //MODULO DE SEGURIDAD
    {
        items: [
            inicio,
            {
                label: 'Auditoria',
                icon: 'pi pi-fw pi-book',
                routerLink: ['/administrador/auditoria'],
            },
            /*{
                label: 'Componentes',
                icon: 'pi pi-fw pi-folder',
                routerLink: ['/administrador/componentes'],
            },
            {
                label: 'Registro de fechas especiales',
                icon: 'pi pi-calendar',
                routerLink: ['/gestion-institucional/fechas'],
            },*/
            {
                label: 'Backup de BD',
                icon: 'pi pi-fw pi-database',
                routerLink: ['/administrador/backup-bd'],
            },

            {
                label: 'Gestión de usuarios',
                icon: 'pi pi-fw pi-user',
                routerLink: ['/administrador/gestion-usuarios'],
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
                        routerLink: ['/gestion-institucional/apertura'],
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

const administracion = [
    {
        label: 'Administración',
        items: [
            {
                label: 'Comunicados',
                icon: 'pi pi-fw pi-bell',
                routerLink: ['/docente/comunicados'],
            },
            {
                label: 'Administracion de tablas maestras',
                icon: 'pi pi-fw pi-cog',
                items: [
                    // {
                    //     label: 'Registro de año escolar',
                    //     icon: 'pi pi-wrench',
                    //     routerLink: [
                    //         '/gestion-institucional/calendarioAcademico',
                    //     ],
                    // },
                    {
                        label: 'Información de la Institución',
                        icon: 'pi pi-wrench',
                        routerLink: ['/gestion-institucional/Informacion-ie'],
                    },
                    {
                        label: 'Sincronizar archivos',
                        icon: 'pi pi-wrench',
                        routerLink: [
                            '/gestion-institucional/sincronizar-archivo',
                        ],
                    },
                    {
                        label: 'Mantenimiento de usuarios',
                        icon: 'pi pi-wrench',
                        routerLink: [
                            '/gestion-institucional/mantenimiento-usuario',
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
                        routerLink: ['/gestion-institucional/apertura'],
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
                            // {
                            //     label: 'Cargos',
                            //     icon: 'pi pi-wrench',
                            //     routerLink: ['/gestion-institucional/apertura'],
                            // },
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
                label: 'Gestión de estudiantes',
                icon: 'pi pi-fw pi-cog',
                items: [
                    {
                        label: 'Ingresar estudiante',
                        icon: 'pi pi-fw pi-circle',
                        badge: 'NEW',
                        routerLink: [
                            '/gestion-institucional/estudiante/registro',
                        ],
                    },
                    {
                        label: 'Buzon de Sugerencias',
                        icon: 'pi pi-fw pi-envelope',
                        routerLink: [
                            '/gestion-institucional/gestionar-sugerencias',
                        ],
                    },
                ],
            },
            {
                label: 'Gestión de Matrículas',
                icon: 'pi pi-folder',
                items: [
                    {
                        label: 'Gestionar matriculas',
                        icon: 'pi pi-fw pi-file-edit',
                        badge: '',
                        routerLink: [
                            '/gestion-institucional/gestion-matriculas',
                        ],
                    },
                    {
                        label: 'Matrícula Individual',
                        icon: 'pi pi-fw pi-file-plus',
                        badge: '',
                        routerLink: [
                            '/gestion-institucional/matricula-individual',
                        ],
                    },
                    {
                        label: 'Matrícula Masiva',
                        icon: 'pi pi-fw pi-file-import',
                        badge: '',
                        routerLink: ['/gestion-institucional/matricula-masiva'],
                    },
                    {
                        label: 'Gestión de traslado',
                        icon: 'pi pi-folder-open',
                        routerLink: [
                            '/gestion-institucional/gestion-traslados',
                        ],
                    },

                    {
                        label: 'Registro de vacantes',
                        icon: 'pi pi-file-import',
                        routerLink: ['/gestion-institucional/gestion-vacantes'],
                    },
                ],
            },

            {
                label: 'Bienestar Social',
                icon: 'pi pi-fw pi-check-square',
                items: [
                    {
                        label: 'Consultar Fichas Socioeconómicas',
                        icon: 'pi pi-fw pi-user-edit',
                        routerLink: ['/bienestar/gestion-fichas'],
                    },
                    {
                        label: 'Gestionar encuestas',
                        icon: 'pi pi-fw pi-list-check',
                        routerLink: ['/bienestar/gestionar-encuestas'],
                    },
                    {
                        label: 'Recordatorios de cumpleaños',
                        icon: 'pi pi-fw pi-bell',
                        routerLink: ['/bienestar/recordario-fechas'],
                    },
                    {
                        label: 'Reportes e informes',
                        icon: 'pi pi-fw pi-chart-bar',
                    },
                ],
            },

            // {
            //     label: 'Generación de Reportes y estadísticas',
            //     icon: 'pi pi-chart-bar',
            //     items: [
            //         {
            //             label: 'Reportes',
            //             icon: 'pi pi-book',
            //             routerLink: ['/gestion-institucional/apertura'],
            //         },
            //         {
            //             label: 'Estadisticas',
            //             icon: 'pi pi-chart-scatter',
            //             routerLink: ['/gestion-institucional/apertura'],
            //         },
            //         {
            //             label: 'Indicadores',
            //             icon: 'pi pi-chart-line',
            //             routerLink: ['/gestion-institucional/apertura'],
            //         },
            //         {
            //             label: 'Plantillas',
            //             icon: 'pi pi-download',
            //             routerLink: ['/gestion-institucional/apertura'],
            //         },
            //     ],
            //     //ConfigGradoSeccion
            // },

            {
                label: 'ERE',
                icon: 'pi pi-pen-to-square',
                items: [
                    // {
                    //     label: 'Configuración de ERE',
                    //     icon: 'pi pi-wrench',
                    //     routerLink: ['/gestion-institucional/apertura'],
                    // },
                    {
                        label: 'Resultados',
                        icon: 'pi pi-chart-bar',
                        routerLink: ['/ere/informes-ere'],
                    },
                    {
                        label: 'Evaluaciones',
                        icon: 'pi pi-list-check',
                        routerLink: ['/ere/evaluaciones'],
                    },
                ],
                //ConfigGradoSeccion
            },

            {
                label: 'Enlaces de ayuda',
                icon: 'pi pi-fw pi-share-alt',
                routerLink: ['ayuda'],
            },
            // {
            //     label: 'Generar Reportes y Estadisticas',
            //     icon: 'pi pi-chart-scatter',
            //     items: [
            //         {
            //             label: 'Reportes Academicos',
            //             icon: 'pi pi-fw pi-circle',
            //             routerLink: ['/gestion-institucional/reporte'],
            //         },
            //         {
            //             label: 'Reportes Orden de Mérito',
            //             icon: 'pi pi-fw pi-circle',
            //             routerLink: ['/gestion-institucional/estadistica'],
            //         },
            //     ],
            // },

            //director buzon

            {
                label: 'Buzón de sugerencias',
                icon: 'pi pi-fw pi-envelope',
                routerLink: ['/buzon-director'],
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

const apoderado = [
    {
        label: 'Apoderado',
        items: [
            {
                label: 'Visualizar datos',
                icon: 'pi pi-fw pi-eye',
                routerLink: ['apoderado/seguimiento-apoderado'],
            },
            {
                label: 'Registro de apoderados',
                icon: 'pi pi-user-edit',
                routerLink: ['apoderado/registro-apoderado'],
            },
            {
                label: 'Bienestar Social',
                icon: 'pi pi-fw pi-check-square',
                items: [
                    {
                        label: 'Gestionar Fichas Socioeconómicas',
                        icon: 'pi pi-fw pi-user-edit',
                        routerLink: ['/bienestar/gestion-fichas-apoderado'],
                    },
                ],
            },
            {
                label: 'Notificaciones y anuncios',
                icon: 'pi pi-megaphone',
                routerLink: ['apoderado/notificacion-apoderado'],
            },
            {
                label: 'Enlaces de ayuda',
                icon: 'pi pi-fw pi-share-alt',
                routerLink: ['ayuda'],
            },
        ],
    },
]

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
        switch (Number(perfil.iPerfilId)) {
            case ADMINISTRADOR:
                return administrador
            case ADMINISTRADOR_DREMO:
                return administradorDremo
            case ESPECIALISTA_DREMO:
                return especialistaDremo
            case ESPECIALISTA_UGEL:
                return especialistaUgel
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
            case APODERADO:
                return apoderado
            case AUXILIAR:
                return first

            default:
                return first
        }
    }
    verificado = verificado

    nombres = user
        ? user.cPersNombre + ' ' + user.cPersPaterno + ' ' + user.cPersMaterno
        : null
    nombre = user ? user.cPersNombre : null
    codModular = perfil ? perfil.cIieeCodigoModular : null
    iIieeId = perfil ? perfil.iIieeId : null
    iSedeId = perfil ? perfil.iSedeId : null
    grados = perfil ? perfil.grados : null
    iSemAcadId = perfil ? perfil.semestres_acad : null
    years = user ? user.years : null
    cIieeNombre = perfil ? perfil.cIieeNombre : null
    nivelTipo = perfil ? perfil.iNivelTipoId : null
    cNivelTipoNombre = perfil ? perfil.cNivelTipoNombre : null
    cNivelNombre = perfil ? perfil.cNivelNombre : null
    year = years ? years : null
    fotografia = user ? user.cPersFotografia : null
}
