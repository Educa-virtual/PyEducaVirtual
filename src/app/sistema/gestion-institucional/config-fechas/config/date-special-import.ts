import { dateSpecialTableColumns } from '../table/date-special-table-columns';

export const dateSpecialStructureImport = {
  sheetName: undefined,
  structures: [
    {
      header: 'A3:E3',
      data: 'B4',
      columns: dateSpecialTableColumns,
      inTableColumn: true,
    },
  ],
};
