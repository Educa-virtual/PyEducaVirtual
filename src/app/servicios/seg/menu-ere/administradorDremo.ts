const inicio = {
    label: 'Inicio',
    icon: 'pi pi-fw pi-home',
    routerLink: [''],
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
            {
                label: 'Evaluaciones',
                icon: 'pi pi-fw pi-check-square',
                routerLink: ['/ere/evaluaciones'],
            },
            {
                label: 'Administrar',
                icon: 'pi pi-fw pi-cog',
                routerLink: ['/ere/administrar'],
            },
            {
                label: 'Reportes',
                icon: 'pi pi-fw pi-file-pdf',
                routerLink: ['/ere/reportes'],
            },

            {
                label: 'Enlaces de ayuda',
                icon: 'pi pi-fw pi-share-alt',
                routerLink: ['ayuda'],
            },
        ],
    },
]
