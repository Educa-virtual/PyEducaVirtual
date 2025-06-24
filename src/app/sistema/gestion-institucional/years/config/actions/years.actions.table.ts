import { editar, eliminar, ver } from '@/app/shared/actions/actions.table'

export const actions = [
    {
        labelTooltip: 'Gestionar semanas lectivas',
        icon: 'pi pi-calendar',
        accion: 'semanasLectivas',
        type: 'item',
        class: 'p-button-rounded p-button-info p-button-text',
        isVisible: (rowData) => rowData.iYearEstado == '1',
    },
    {
        labelTooltip: 'Procesar periodos',
        icon: 'pi pi-sync',
        accion: 'procesarPeriodos',
        type: 'item',
        class: 'p-button-rounded p-button-info p-button-text',
        isVisible: (rowData) => rowData.iYearEstado == '1',
    },
    {
        ...ver,
        isVisible: (rowData) => rowData.iYearEstado == '0',
    },
    {
        labelTooltip: 'Ver semanas lectivas',
        icon: 'pi pi-calendar',
        accion: 'verSemanasLectivas',
        type: 'item',
        class: 'p-button-rounded p-button-secondary p-button-text',
        isVisible: (rowData) => rowData.iYearEstado == '0',
    },
    {
        ...editar,
        isVisible: (rowData) => rowData.iYearEstado == '1',
    },
    {
        ...eliminar,
        isVisible: (rowData) => rowData.iYearEstado == '1',
    },
]
