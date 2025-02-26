const inicio = {
    label: 'Inicio',
    icon: 'pi pi-fw pi-home',
    routerLink: [''],
}

export const evaluacionesEre = {
    label: 'Evaluaciones',
    icon: 'pi pi-fw pi-check-square',
    routerLink: ['/ere/evaluaciones'],
}

export const reportesEre = {
    label: 'Reportes ERE',
    icon: 'pi pi-fw pi-file-pdf',
    routerLink: ['/ere/reportes'],
}

export const administradorDremo = [
    {
        items: [
            inicio,
            {
                label: 'Sincronizar SIAGIE',
                icon: 'pi pi-fw pi-sync',
                routerLink: ['/evaluaciones'],
            },
            evaluacionesEre,
            {
                label: 'Administrar',
                icon: 'pi pi-fw pi-cog',
                routerLink: ['/ere/administrar'],
                items: [
                    {
                        label: 'Especialista DREMO',
                        icon: 'pi pi-fw pi-circle',
                        routerLink: ['./ere/administrar/especialista-dremo'],
                    },
                    {
                        label: 'Especialista UGEL',
                        icon: 'pi pi-fw pi-circle',
                        routerLink: ['./ere/administrar/especialista-ugel'],
                    },
                ],
            },
            reportesEre,
            {
                label: 'Enlaces de ayuda',
                icon: 'pi pi-fw pi-share-alt',
                routerLink: ['ayuda'],
            },
        ],
    },
]

export const especialistaDremo = [
    {
        items: [
            inicio,
            evaluacionesEre,
            {
                label: 'Banco de Preguntas',
                icon: 'pi pi-fw pi-question-circle',
                routerLink: ['/ere/banco-preguntas'],
            },
            reportesEre,
            {
                label: 'Enlaces de ayuda',
                icon: 'pi pi-fw pi-share-alt',
                routerLink: ['ayuda'],
            },
        ],
    },
]

export const especialistaUgel = [
    {
        items: [
            inicio,
            evaluacionesEre,
            reportesEre,
            {
                label: 'Enlaces de ayuda',
                icon: 'pi pi-fw pi-share-alt',
                routerLink: ['ayuda'],
            },
        ],
    },
]
