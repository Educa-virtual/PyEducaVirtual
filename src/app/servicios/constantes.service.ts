import { Injectable } from '@angular/core'
import { LocalStoreService } from './local-store.service'
const store = new LocalStoreService()
const perfil_actual = store.getItem('dremoPerfil')
const verificado = store.getItem('dremoPerfilVerificado')
const user = store.getItem('dremoToken')

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
        ],
    },
]

const estudiante = [inicio]

const aula_virtual = [
    {
        items: [
            {
                label: 'Mis Áreas Curriculares',
                icon: 'pi pi-fw pi-book',
                routerLink: ['/aula-virtual/areas-curriculares'],
            },
            {
                label: 'Calendario',
                icon: 'pi pi-fw pi-calendar',
                routerLink: ['/aula-virtual/calendario'],
            },
            {
                label: 'Recursos',
                icon: 'pi pi-fw pi-folder',
                routerLink: ['/aula-virtual/recursos'],
            },
            {
                label: 'DashBoard',
                icon: 'pi pi-fw pi-chart-bar',
                routerLink: ['/aula-virtual'],
            },
        ],
    },
]
const administrador = [
    {
        label: 'Configuración',
        items: [
            {
                label: 'Personas',
                icon: 'pi pi-fw pi-desktop',
                routerLink: ['/configuracion/personas'],
            },
            {
                label: 'Calendario Académico',
                icon: 'pi pi-fw pi-desktop',
                routerLink: ['/'],
            },
            {
                label: 'Cursos',
                icon: 'pi pi-fw pi-desktop',
                routerLink: ['/'],
            },
            {
                label: 'Horarios',
                icon: 'pi pi-fw pi-desktop',
                routerLink: ['/'],
            },
            {
                label: 'Grados',
                icon: 'pi pi-fw pi-desktop',
                routerLink: ['/'],
            },
            {
                label: 'Sección',
                icon: 'pi pi-fw pi-desktop',
                routerLink: ['/'],
            },
            {
                label: 'Roles',
                icon: 'pi pi-users',
                routerLink: ['/roles'],
            },
        ],
    },
]

const evaluaciones = [
    {
        label: 'ERE',
        items: [
            {
                label: 'Dashboard',
                icon: 'pi pi-fw pi-book',
                routerLink: ['/evaluaciones'],
            },
            {
                label: 'Evaluaciones',
                icon: 'pi pi-fw pi-calendar',
                routerLink: ['/evaluaciones/evaluaciones'],
            },
            {
                label: 'Mis Áreas Curriculares',
                icon: 'pi pi-fw pi-folder',
                routerLink: ['/evaluaciones/areas'],
            },
            {
                label: 'Preguntas',
                icon: 'pi pi-fw pi-user',
                items: [
                    {
                        label: 'Banco de preguntas',
                        icon: 'pi pi-fw pi-sign-in',
                        routerLink: ['/evaluaciones/banco-preguntas'],
                    },
                    {
                        label: 'Preguntas activas',
                        icon: 'pi pi-fw pi-times-circle',
                        routerLink: ['/evaluaciones/preguntas-activas'],
                    },
                ],
            },

            {
                label: 'Configuración',
                icon: 'pi pi-fw pi-user',
                items: [
                    {
                        label: 'Competencias',
                        icon: 'pi pi-fw pi-sign-in',
                        routerLink: ['/evaluaciones/competencias'],
                    },
                    {
                        label: 'Capacidades',
                        icon: 'pi pi-fw pi-times-circle',
                        routerLink: ['/evaluaciones/preguntas-activas'],
                    },
                    {
                        label: 'Desempeños',
                        icon: 'pi pi-fw pi-times-circle',
                        routerLink: ['/evaluaciones/preguntas-activas'],
                    },
                ],
            },
        ],
    },
]

const other = [
    {
        label: 'Home',
        items: [
            { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
        ],
    },
    {
        label: 'UI Components',
        items: [
            {
                label: 'Form Layout',
                icon: 'pi pi-fw pi-id-card',
                routerLink: ['/uikit/formlayout'],
            },
            {
                label: 'Input',
                icon: 'pi pi-fw pi-check-square',
                routerLink: ['/uikit/input'],
            },
            {
                label: 'Float Label',
                icon: 'pi pi-fw pi-bookmark',
                routerLink: ['/uikit/floatlabel'],
            },
            {
                label: 'Invalid State',
                icon: 'pi pi-fw pi-exclamation-circle',
                routerLink: ['/uikit/invalidstate'],
            },
            {
                label: 'Button',
                icon: 'pi pi-fw pi-box',
                routerLink: ['/uikit/button'],
            },
            {
                label: 'Table',
                icon: 'pi pi-fw pi-table',
                routerLink: ['/uikit/table'],
            },
            {
                label: 'List',
                icon: 'pi pi-fw pi-list',
                routerLink: ['/uikit/list'],
            },
            {
                label: 'Tree',
                icon: 'pi pi-fw pi-share-alt',
                routerLink: ['/uikit/tree'],
            },
            {
                label: 'Panel',
                icon: 'pi pi-fw pi-tablet',
                routerLink: ['/uikit/panel'],
            },
            {
                label: 'Overlay',
                icon: 'pi pi-fw pi-clone',
                routerLink: ['/uikit/overlay'],
            },
            {
                label: 'Media',
                icon: 'pi pi-fw pi-image',
                routerLink: ['/uikit/media'],
            },
            {
                label: 'Menu',
                icon: 'pi pi-fw pi-bars',
                routerLink: ['/uikit/menu'],
                routerLinkActiveOptions: {
                    paths: 'subset',
                    queryParams: 'ignored',
                    matrixParams: 'ignored',
                    fragment: 'ignored',
                },
            },
            {
                label: 'Message',
                icon: 'pi pi-fw pi-comment',
                routerLink: ['/uikit/message'],
            },
            {
                label: 'File',
                icon: 'pi pi-fw pi-file',
                routerLink: ['/uikit/file'],
            },
            {
                label: 'Chart',
                icon: 'pi pi-fw pi-chart-bar',
                routerLink: ['/uikit/charts'],
            },
            {
                label: 'Misc',
                icon: 'pi pi-fw pi-circle',
                routerLink: ['/uikit/misc'],
            },
        ],
    },
    {
        label: 'Prime Blocks',
        items: [
            {
                label: 'Free Blocks',
                icon: 'pi pi-fw pi-eye',
                routerLink: ['/blocks'],
                badge: 'NEW',
            },
            {
                label: 'All Blocks',
                icon: 'pi pi-fw pi-globe',
                url: ['https://www.primefaces.org/primeblocks-ng'],
                target: '_blank',
            },
        ],
    },
    {
        label: 'Utilities',
        items: [
            {
                label: 'PrimeIcons',
                icon: 'pi pi-fw pi-prime',
                routerLink: ['/utilities/icons'],
            },
            {
                label: 'PrimeFlex',
                icon: 'pi pi-fw pi-desktop',
                url: ['https://www.primefaces.org/primeflex/'],
                target: '_blank',
            },
        ],
    },
    {
        label: 'Pages',
        icon: 'pi pi-fw pi-briefcase',
        items: [
            {
                label: 'Landing',
                icon: 'pi pi-fw pi-globe',
                routerLink: ['/landing'],
            },
            {
                label: 'Auth',
                icon: 'pi pi-fw pi-user',
                items: [
                    {
                        label: 'Login',
                        icon: 'pi pi-fw pi-sign-in',
                        routerLink: ['/auth/login'],
                    },
                    {
                        label: 'Error',
                        icon: 'pi pi-fw pi-times-circle',
                        routerLink: ['/auth/error'],
                    },
                    {
                        label: 'Access Denied',
                        icon: 'pi pi-fw pi-lock',
                        routerLink: ['/auth/access'],
                    },
                ],
            },
            {
                label: 'Crud',
                icon: 'pi pi-fw pi-pencil',
                routerLink: ['/pages/crud'],
            },
            {
                label: 'Timeline',
                icon: 'pi pi-fw pi-calendar',
                routerLink: ['/pages/timeline'],
            },
            {
                label: 'Not Found',
                icon: 'pi pi-fw pi-exclamation-circle',
                routerLink: ['/notfound'],
            },
            {
                label: 'Empty',
                icon: 'pi pi-fw pi-circle-off',
                routerLink: ['/pages/empty'],
            },
        ],
    },
    {
        label: 'Hierarchy',
        items: [
            {
                label: 'Submenu 1',
                icon: 'pi pi-fw pi-bookmark',
                items: [
                    {
                        label: 'Submenu 1.1',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {
                                label: 'Submenu 1.1.1',
                                icon: 'pi pi-fw pi-bookmark',
                            },
                            {
                                label: 'Submenu 1.1.2',
                                icon: 'pi pi-fw pi-bookmark',
                            },
                            {
                                label: 'Submenu 1.1.3',
                                icon: 'pi pi-fw pi-bookmark',
                            },
                        ],
                    },
                    {
                        label: 'Submenu 1.2',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {
                                label: 'Submenu 1.2.1',
                                icon: 'pi pi-fw pi-bookmark',
                            },
                        ],
                    },
                ],
            },
            {
                label: 'Submenu 2',
                icon: 'pi pi-fw pi-bookmark',
                items: [
                    {
                        label: 'Submenu 2.1',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {
                                label: 'Submenu 2.1.1',
                                icon: 'pi pi-fw pi-bookmark',
                            },
                            {
                                label: 'Submenu 2.1.2',
                                icon: 'pi pi-fw pi-bookmark',
                            },
                        ],
                    },
                    {
                        label: 'Submenu 2.2',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {
                                label: 'Submenu 2.2.1',
                                icon: 'pi pi-fw pi-bookmark',
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        label: 'Get Started',
        items: [
            {
                label: 'Documentation',
                icon: 'pi pi-fw pi-question',
                routerLink: ['/documentation'],
            },
            {
                label: 'View Source',
                icon: 'pi pi-fw pi-search',
                url: ['https://github.com/primefaces/sakai-ng'],
                target: '_blank',
            },
        ],
    },
]

@Injectable({
    providedIn: 'root',
})
export class ConstantesService {
    iPersId = user ? user.iPersId : null
    iCredId = user ? user.iCredId : null

    nav = this.getMenu()
    getMenu() {
        //console.log(perfil_actual.iPerfilId)
        if (!perfil_actual) return other
        console.log(perfil_actual)
        switch (Number(perfil_actual.iPerfilId)) {
            case 1001:
                return docente
            case 1002:
                return estudiante
            case 1003:
                return aula_virtual
            case 1005:
                return administrador
            case 1006:
                return evaluaciones
            case 1:
                return administrador
            case 7:
                return docente
            case 8:
                return docente
            default:
                return other
        }
    }
    verificado = verificado

    nombres = user
        ? user.cPersNombre + ' ' + user.cPersPaterno + ' ' + user.cPersMaterno
        : null
    nombre = user ? user.cPersNombre : null
}
