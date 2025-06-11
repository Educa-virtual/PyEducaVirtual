const actions = [
    {
        labelTooltip: 'Sincronizar fechas',
        text: 'Sincronizar fechas',
        icon: 'pi pi-sync',
        accion: 'sincronizar',
        class: 'p-button-warning',
    },
    {
        labelTooltip: 'Importar fechas nacionales',
        text: 'Importar fechas nacionales',
        icon: 'pi pi-file-import',
        accion: 'importar',
        class: 'p-button-success',
    },
    {
        labelTooltip: 'Crear fechas nacionales',
        text: 'Crear fechas nacionales',
        icon: 'pi pi-plus',
        accion: 'agregar',
        class: 'p-button-primary',
    },
]

export const container = { actions }
