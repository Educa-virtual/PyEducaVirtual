import { IColumn } from '@/app/shared/table-primeng/table-primeng.component';
import { YearsComponent } from '@/app/sistema/gestion-institucional/years/years.component';
import { container } from '@/app/sistema/gestion-institucional/years/config/actions/years.actions.container';
import { actions } from '@/app/sistema/gestion-institucional/years/config/actions/years.actions.table';
import { of, switchMap, takeWhile, tap } from 'rxjs';
import { tiposDistribucion } from '../service/distribucion-bloques.service';

export const columns: IColumn[] = [
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
    field: 'cYearNombre',
    header: 'Año',
    text_header: 'center',
    text: 'center',
  },
  {
    type: 'text',
    width: '5rem',
    field: 'cYearOficial',
    header: 'Nombre oficial',
    text_header: 'center',
    text: 'center',
  },
  {
    type: 'estado-activo',
    width: '5rem',
    field: 'iYearEstado',
    header: 'Activo',
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

function accionBtnItem(this: YearsComponent, { accion, item }) {
  this.forms.year.reset();
  this.forms.year.enable();
  this.distribucionBloques.table.data = [];

  switch (accion) {
    case 'agregar':
      this.dialogs.year = {
        title: 'Agregar año acedémico',
        visible: true,
      };

      this.forms.year.patchValue({
        iYearEstado: true,
      });

      break;
    case 'ver':
      this.forms.year.disable();

      this.dialogs.year = {
        title: 'Información del año acedémico',
        visible: true,
      };

      this.forms.year.patchValue({
        iYearId: item.iYearId,
        cYearNombre: item.cYearNombre,
        cYearOficial: item.cYearOficial,
        iYearEstado: Number(item.iYearEstado),
      });

      break;
    case 'editar':
      this.dialogs.year = {
        title: 'Editar año acedémico',
        visible: true,
      };

      this.forms.year.get('iYearEstado').disable();

      this.forms.year.patchValue({
        iYearId: item.iYearId,
        cYearNombre: item.cYearNombre,
        cYearOficial: item.cYearOficial,
        iYearEstado: Number(item.iYearEstado),
      });

      break;
    case 'eliminar':
      this.dialogConfirm.openConfirm({
        header: `¿Esta seguro de eliminar el año: ${item.iYearId} ?`,
        accept: () => {
          of(null)
            .pipe(
              switchMap(() => this.yearsService.deleteYears(item.iYearId)),
              tap((res: any) => {
                const result = res.data[0];
                const isSuccess = result.Message === 'true';

                this.messageService.add({
                  severity: isSuccess ? 'success' : 'warn',
                  summary: 'Año académico',
                  detail: result.resultado,
                  life: 3000,
                });
              }),
              takeWhile((res: any) => res?.data?.[0]?.Message == 'true'),
              switchMap(() => this.yearsService.getYears())
            )
            .subscribe({
              next: (res: any) => {
                this.years.table.data = res.data;
              },

              error: (error: any) => {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Año académico',
                  detail: error.resultado,
                  life: 3000,
                });
              },
            });
        },
      });
      break;

    case 'semanasLectivas':
      this.dialogs.distribucionBloques = {
        title: `Semanas lectivas del año: ${item.iYearId}`,
        visible: true,
      };

      this.forms.year.patchValue({
        iYearId: item.iYearId,
        cYearNombre: item.cYearNombre,
        cYearOficial: item.cYearOficial,
        iYearEstado: item.iYearEstado,
      });

      this.distribucionBloquesService.getDistribucionBloques(item.iYearId).subscribe({
        next: (res: any) => {
          console.log('res');
          console.log(res.data);

          this.distribucionBloques.table.data = res.data.map(item => {
            const tipoDistribucion = tiposDistribucion.find(
              tipo => tipo.iTipoDistribucionId == item.iTipoDistribucionId
            );

            return {
              ...item,
              cBloqueNombre: tipoDistribucion.cBloqueNombre,
              dtInicioBloque: this.datePipe.transform(item.dtInicioBloque, 'dd/MM/yyyy'),
              dtFinBloque: this.datePipe.transform(item.dtFinBloque, 'dd/MM/yyyy'),
            };
          });
        },
      });

      break;
    case 'procesarPeriodos':
      this.dialogs.procesarPeriodo = {
        title: `Generar periodos del calendario académico para el año: ${item.iYearId}`,
        visible: true,
      };

      this.forms.year.patchValue({
        iYearId: item.iYearId,
        cYearNombre: item.cYearNombre,
        cYearOficial: item.cYearOficial,
        iYearEstado: item.iYearEstado,
        iYAcadId: item.iYAcadId,
      });

      console.log('this.forms.year');
      console.log(this.forms.year.value);

      break;
    case 'verSemanasLectivas':
      this.dialogs.distribucionBloques = {
        title: `Semanas lectivas del año: ${item.iYearId}`,
        visible: true,
      };

      this.forms.year.disable();
      this.forms.distribucionBloque.disable();

      this.forms.year.patchValue({
        iYearId: item.iYearId,
        cYearNombre: item.cYearNombre,
        cYearOficial: item.cYearOficial,
        iYearEstado: item.iYearEstado,
      });

      this.distribucionBloquesService.getDistribucionBloques(item.iYearId).subscribe({
        next: (res: any) => {
          console.log('res');
          console.log(res.data);

          this.distribucionBloques.table.data = res.data.map(item => {
            const tipoDistribucion = tiposDistribucion.find(
              tipo => tipo.iTipoDistribucionId == item.iTipoDistribucionId
            );

            return {
              ...item,
              cBloqueNombre: tipoDistribucion.cBloqueNombre,
              dtInicioBloque: this.datePipe.transform(item.dtInicioBloque, 'dd/MM/yyyy'),
              dtFinBloque: this.datePipe.transform(item.dtFinBloque, 'dd/MM/yyyy'),
            };
          });
        },
      });
      break;
  }
}

function saveData(this: YearsComponent) {
  const data: any = {
    cYearNombre: this.forms.year.value.cYearNombre,
    cYearOficial: this.forms.year.value.cYearOficial,
    iYearEstado: Number(this.forms.year.value.iYearEstado),
  };

  if (!this.forms.year.value.iYearId) {
    of(null)
      .pipe(
        switchMap(() => this.yearsService.insYears(data)),
        tap((res: any) => {
          const result = res.data[0];
          const isSuccess = result.Message == 'true';

          this.messageService.add({
            severity: isSuccess ? 'success' : 'warn',
            summary: 'Año calendario',
            detail: result.resultado,
            life: 3000,
          });

          this.dialogs.year.visible = !isSuccess;
        }),
        switchMap(() => this.yearsService.getYears())
      )
      .subscribe({
        next: (res: any) => {
          this.years.table.data = res.data;
        },
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Distribución de bloque',
            detail: error ?? 'Ha ocurrido un error al guardar los feriados nacionales',
            life: 3000,
          });
        },
      });
  } else {
    data.iYearId = this.forms.year.value.iYearId;

    of(null)
      .pipe(
        switchMap(() => this.yearsService.updYears(data)),
        tap((res: any) => {
          const result = res.data[0];
          const isSuccess = result.Message === 'true';

          this.messageService.add({
            severity: isSuccess ? 'success' : 'warn',
            summary: 'Distribución de bloque',
            detail: result.resultado,
            life: 3000,
          });

          this.dialogs.year.visible = !isSuccess;
        }),
        switchMap(() => this.yearsService.getYears())
      )
      .subscribe({
        next: (res: any) => {
          this.years.table.data = res.data;
        },
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Distribución de bloque',
            detail: error ?? 'Ha ocurrido un error al guardar los feriados nacionales',
            life: 3000,
          });
        },
      });
  }
}

export const years = {
  accionBtnItem,
  saveData,
  container,
  table: {
    columns,
    actions,
  },
};
