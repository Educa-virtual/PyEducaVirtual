import { editar, eliminar, ver } from '@/app/shared/actions/actions.table';
import { YearsComponent } from '../../years.component';

export function actions(this: YearsComponent) {
  return [
    {
      ...ver,
      isVisible: () => {
        return this.formYear.value.iYearEstado == '0';
      },
    },
    {
      ...editar,
      isVisible: () => {
        return this.formYear.value.iYearEstado == '1';
      },
    },
    {
      ...eliminar,
      isVisible: () => {
        return this.formYear.value.iYearEstado == '1';
      },
    },
  ];
}
