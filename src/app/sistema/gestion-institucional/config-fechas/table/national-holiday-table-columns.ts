import { IColumn } from '@/app/shared/table-primeng/table-primeng.component';

const columns: IColumn[] = [
  {
    type: 'item',
    width: '5rem',
    field: 'item',
    header: 'Item',
    text_header: 'center',
    text: 'center',
  },
  {
    type: 'text',
    width: '5rem',
    field: 'B2/cFeriadoNombre',
    header: 'Nombre',
    text_header: 'center',
    text: 'center',
  },
  {
    type: 'text',
    width: '5rem',
    field: 'C2/dtFeriado',
    header: 'Fecha',
    text_header: 'center',
    text: 'center',
  },
  {
    type: 'estado-activo',
    width: '5rem',
    field: 'D2/bFeriadoEsRecuperable',
    header: 'Es recuperable',
    text_header: 'center',
    text: 'center',
  },
  {
    type: 'actions',
    width: '3rem',
    field: 'actions',
    header: 'Acciones',
    text_header: 'center',
    text: 'center',
  },
];

export const nationalHoliday = {
  columns,
};
