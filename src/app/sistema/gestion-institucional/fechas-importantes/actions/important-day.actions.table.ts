import { editar, eliminar } from '@/app/shared/actions/actions.table';

const actions = [
  {
    labelTooltip: 'Agregar fecha recuperable',
    icon: 'pi pi-calendar-plus',
    accion: 'mostrarFechaRecuperable',
    type: 'item',
    class: 'p-button-rounded p-button-info p-button-text',
    isVisible: rowData => {
      return rowData?.bFechaImpSeraLaborable == '1';
    },
  },
  editar,
  eliminar,
];

export const table = {
  actions,
};
