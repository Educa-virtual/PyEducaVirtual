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
} from './seg/menu-ere/menuEre'

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
            {
                label: 'Bienestar Social',
                icon: 'pi pi-fw pi-check-square',
                items: [
                    {
                        label: 'Consultar Fichas Socioeconómicas',
                        icon: 'pi pi-fw pi-user-edit',
                        routerLink: ['/bienestar/ficha-socioeconomica'],
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
            {
                label: 'Bienestar Social',
                icon: 'pi pi-fw pi-check-square',
                items: [
                    {
                        label: 'Consultar Fichas Socioeconómicas',
                        icon: 'pi pi-fw pi-user-edit',
                        routerLink: ['/bienestar/ficha-socioeconomica'],
                    },
                ],
            },
        ],
    },
]

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
                        label: 'Consulta Asistenta Social',
                        icon: 'pi pi-fw pi-user-edit',
                        routerLink: ['/bienestar/gestion-fichas'],
                    },
                    {
                        label: 'Consulta Apoderado',
                        icon: 'pi pi-fw pi-users',
                        routerLink: ['/bienestar/gestion-fichas-apoderado'],
                    },
                    {
                        label: 'Ficha Socioeconomica',
                        icon: 'pi pi-fw pi-file-edit',
                        routerLink: ['/bienestar/ficha'],
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
                    // {
                    //     label: 'Configuración de ERE',
                    //     icon: 'pi pi-wrench',
                    //     routerLink: ['/configuracion/configuracion'],
                    // },
                    {
                        label: 'Resultados de ERE',
                        icon: 'pi pi-chart-bar',
                        routerLink: ['/ere/informes-ere'],
                    },
                    // {
                    //     label: 'Evaluaciones',
                    //     icon: 'pi pi-fw pi-calendar',
                    //     routerLink: ['/ere/evaluaciones'],
                    // },
                ],
                //ConfigGradoSeccion
            },

            {
                label: 'Enlaces de ayuda',
                icon: 'pi pi-fw pi-share-alt',
                routerLink: ['ayuda'],
            },
            {
                label: 'Generar Reportes y Estadisticas',
                icon: 'pi pi-chart-scatter',
                items: [
                    {
                        label: 'Reportes Academicos',
                        icon: 'pi pi-fw pi-circle',
                        routerLink: ['/gestion-institucional/reporte'],
                    },
                    {
                        label: 'Reportes Orden de Mérito',
                        icon: 'pi pi-fw pi-circle',
                        routerLink: ['/gestion-institucional/estadistica'],
                    },
                ],
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
                label: 'Consulta Apoderado',
                icon: 'pi pi-fw pi-users',
                routerLink: ['/bienestar/gestion-fichas-apoderado'],
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
export class EstudiantesService {
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
    years = user ? user.years : null
    cIieeNombre = perfil ? perfil.cIieeNombre : null
    nivelTipo = perfil ? perfil.iNivelTipoId : null
}
