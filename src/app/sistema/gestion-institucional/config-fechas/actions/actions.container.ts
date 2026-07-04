const actions = [
  {
    labelTooltip: 'Aplicar feriados a todas las IEs',
    text: 'Aplicar',
    icon: 'pi pi-sync',
    accion: 'sincronizar',
    class: 'p-button-warning',
  },
  {
    labelTooltip: 'Importar desde plantilla',
    text: 'Importar',
    icon: 'pi pi-file-import',
    accion: 'importar',
    class: 'p-button-success',
  },
  {
    labelTooltip: 'Agregar nuevo feriado',
    text: 'Agregar',
    icon: 'pi pi-plus',
    accion: 'agregar',
    class: 'p-button-primary',
  },
];

export const container = { actions };
