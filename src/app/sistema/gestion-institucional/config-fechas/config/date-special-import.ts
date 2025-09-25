import { nationalHoliday } from '../table/national-holiday-table-columns';

export const nationalHolidayStructureImport = {
  sheetName: undefined,
  structures: [
    {
      header: 'B2:E2',
      data: 'B3',
      columns: {
        inTableColumns: nationalHoliday.columns,
      },
      inTableColumn: true,
    },
  ],
};
