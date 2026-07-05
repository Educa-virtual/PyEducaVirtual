import { PrimengModule } from '@/app/primeng.module';
import { BtnFileUploadComponent } from '@/app/shared/btn-file-upload/btn-file-upload.component';
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component';
import { IColumn, TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component';
import { Component, OnInit } from '@angular/core';
import { CalendarModule } from 'primeng/calendar';
import { nationalHolidayStructureImport } from './config/date-special-import';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { nationalHolidayService } from './service/national-holiday.service';
import { DatePipe } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { SheetToMatrix } from '../sincronizar-archivo/bulk-data-import/utils/sheetToMatrix';
import * as XLSX from 'xlsx';
import { of, switchMap, tap } from 'rxjs';
import { LocalStoreService } from '@/app/servicios/local-store.service';

@Component({
  selector: 'app-config-fechas',
  standalone: true,
  imports: [
    PrimengModule,
    ContainerPageComponent,
    TablePrimengComponent,
    CalendarModule,
    BtnFileUploadComponent,
    ToastModule,
    ToggleButtonModule,
  ],
  templateUrl: './config-fechas.component.html',
  styleUrl: './config-fechas.component.scss',
  providers: [DatePipe],
})
export class ConfigFechasComponent implements OnInit {
  collection = nationalHolidayStructureImport;
  file: any;
  form: FormGroup;
  option: string;

  data: any[] = [];
  dataImport: any[] = [];

  importLoading = false;

  dialogs = {
    importNationalHolyday: {
      title: '',
      visible: false,
    },
    nationalHoliday: {
      title: '',
      visible: false,
    },
  };

  breadCrumbHome: MenuItem = { icon: 'pi pi-home', routerLink: '/' };
  breadCrumbItems: MenuItem[] = [{ label: 'Feriados nacionales' }];

  iYAcadId: number;

  constructor(
    private fb: FormBuilder,
    public messageService: MessageService,
    public dialog: ConfirmationModalService,
    public nationalHolidayService: nationalHolidayService,
    public datePipe: DatePipe,
    private store: LocalStoreService
  ) {
    this.iYAcadId = this.store.getItem('dremoiYAcadId');
  }

  ngOnInit(): void {
    try {
      this.form = this.fb.group({
        iFeriadoId: [''],
        cFeriadoNombre: [''],
        iYAcadId: [''],
        dtFeriado: [''],
        bFeriadoEsRecuperable: [''],
        cDocumento: [''],
      });
    } catch (error) {
      console.error(error, 'error de formulario');
    }
    this.loadFeriados();
  }

  loadFeriados(): void {
    this.nationalHolidayService
      .listarFeriadosNacionales({
        iYAcadId: this.iYAcadId,
      })
      .subscribe({
        next: (data: any) => {
          this.data = data.data.map(item => ({
            ...item,
            dtFeriado: this.datePipe.transform(item.dtFeriado, 'dd/MM/yyyy'),
          }));
        },
        error: error => {
          console.error('Error fetching Años Académicos:', error);
        },
        complete: () => {
          console.log('Request completed');
        },
      });
  }

  accionBtnItem({ accion, item }): void {
    this.form.reset();
    this.dataImport = [];

    switch (accion) {
      case 'agregar':
        this.dialogs.nationalHoliday = {
          title: 'Agregar feriado nacional',
          visible: true,
        };
        break;
      case 'editar':
        this.dialogs.nationalHoliday = {
          title: 'Editar feriado nacional',
          visible: true,
        };

        const [day, month, year] = item.dtFeriado.split('/');

        const storedYAcadId = localStorage.getItem('dremoiYAcadId');
        this.form.patchValue({
          iFeriadoId: item.iFeriadoId,
          cFeriadoNombre: item.cFeriadoNombre,
          iYAcadId: storedYAcadId ? JSON.parse(storedYAcadId) : null,
          dtFeriado: new Date(`${month}/${day}/${year}`),
          cDocumento: item.cDocumento,
          bFeriadoEsRecuperable: Number(item.bFeriadoEsRecuperable),
        });
        break;
      case 'eliminar':
        this.dialog.openConfirm({
          header: 'Eliminar Registro',
          accept: () => {
            of(null)
              .pipe(
                switchMap(() =>
                  this.nationalHolidayService.borrarFeriadoNacional({
                    iFeriadoId: item.iFeriadoId,
                  })
                ),
                tap((res: any) => {
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Feriados nacionales',
                    detail: res.message,
                    life: 3000,
                  });
                }),
                switchMap(() =>
                  this.nationalHolidayService.listarFeriadosNacionales({
                    iYAcadId: this.iYAcadId,
                  })
                )
              )
              .subscribe({
                next: (res: any) => {
                  this.data = res.data.map(item => ({
                    ...item,
                    dtFeriado: this.datePipe.transform(item.dtFeriado, 'dd/MM/yyyy'),
                  }));
                },
                error: error => {
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Feriados nacionales',
                    detail: error ?? 'Ha ocurrido un error al eliminar el feriado nacional',
                    life: 3000,
                  });
                },
              });
          },
        });
        break;
      case 'sincronizar':
        this.dialog.openConfirm({
          header: 'Aplicar feriados nacionales',
          accept: () => {
            this.nationalHolidayService
              .aplicarFeriadosNacionales({
                iYAcadId: this.iYAcadId,
              })
              .subscribe({
                next: (res: any) => {
                  const result = res.data[0];
                  const isSuccess = result.Message === 'true';

                  this.messageService.add({
                    severity: isSuccess ? 'success' : 'error',
                    summary: 'Feriados nacionales',
                    detail: result.resultado,
                    life: 3000,
                  });
                },
                error: error => {
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Feriados nacionales',
                    detail: error ?? 'Ha ocurrido un error al eliminar el feriado nacional',
                    life: 3000,
                  });
                },
              });
          },
        });
        break;
      case 'importar':
        this.dialogs.importNationalHolyday = {
          title: 'Importar feriados nacionales',
          visible: true,
        };
        break;
    }
  }

  saveData(): void {
    const data: any = {
      cFeriadoNombre: this.form.value.cFeriadoNombre,
      iYAcadId: this.iYAcadId,
      dtFeriado: this.datePipe.transform(this.form.value.dtFeriado, 'yyyy-MM-dd'),
      bFeriadoEsRecuperable: Number(this.form.value.bFeriadoEsRecuperable),
      cDocumento: this.form.value.cDocumento,
    };

    if (!this.form.value.iFeriadoId) {
      of(null)
        .pipe(
          switchMap(() => this.nationalHolidayService.guardarFeriadoNacional(data)),
          tap((res: any) => {
            const result = res.data[0];
            const isSuccess = result.Message === 'true';

            this.messageService.add({
              severity: isSuccess ? 'success' : 'warn',
              summary: 'Feriados nacionales',
              detail: result.resultado,
              life: 3000,
            });

            this.dialogs.nationalHoliday.visible = !isSuccess;
          }),
          switchMap(() =>
            this.nationalHolidayService.listarFeriadosNacionales({
              iYAcadId: this.iYAcadId,
            })
          )
        )
        .subscribe({
          next: (res: any) => {
            this.data = res.data.map(item => ({
              ...item,
              dtFeriado: this.datePipe.transform(item.dtFeriado, 'dd/MM/yyyy'),
            }));

            const result = res.data[0];

            if (result.Message) {
              this.messageService.add({
                severity: 'error',
                summary: 'Feriados nacionales',
                detail: result.resultado,
                life: 3000,
              });
            }
          },
          error: error => {
            this.messageService.add({
              severity: 'error',
              summary: 'Feriados nacionales',
              detail: error ?? 'Ha ocurrido un error al guardar los feriados nacionales',
              life: 3000,
            });
          },
        });
    } else {
      data.iFeriadoId = this.form.value.iFeriadoId;

      of(null)
        .pipe(
          switchMap(() => this.nationalHolidayService.actualizarFeriadoNacional(data)),
          tap((res: any) => {
            const result = res.data[0];
            const isSuccess = result.Message === 'true';

            this.messageService.add({
              severity: isSuccess ? 'success' : 'warn',
              summary: 'Feriados nacionales',
              detail: result.resultado,
              life: 3000,
            });

            this.dialogs.nationalHoliday.visible = !isSuccess;
          }),
          switchMap(() =>
            this.nationalHolidayService.listarFeriadosNacionales({
              iYAcadId: this.iYAcadId,
            })
          )
        )
        .subscribe({
          next: (res: any) => {
            this.data = res.data.map(item => ({
              ...item,
              dtFeriado: this.datePipe.transform(item.dtFeriado, 'dd/MM/yyyy'),
            }));
          },
          error: error => {
            this.messageService.add({
              severity: 'error',
              summary: 'Feriados nacionales',
              detail: error ?? 'Ha ocurrido un error al guardar los feriados nacionales',
              life: 3000,
            });
          },
        });
    }
  }

  fileChange(file: any): void {
    this.dataImport = [];

    SheetToMatrix.resetInstance('hojaDeDatosAImportar');

    if (!file) return;

    this.file = file;

    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });

      const firstSheetName = workbook.SheetNames[0];

      const worksheet = workbook.Sheets[this.collection?.sheetName ?? firstSheetName];

      const excelData = SheetToMatrix.setInstance('hojaDeDatosAImportar', worksheet, {
        structures: this.collection.structures,
      });

      this.dataImport = excelData.inTableData;
    };

    reader.readAsArrayBuffer(file);
  }

  importData(): void {
    this.importLoading = true;
    const data = SheetToMatrix.getInstance('hojaDeDatosAImportar');
    data.setDataAccordingColumns();

    data.dataAccordingColumns = data.dataAccordingColumns.map(item => {
      const [year, month, day] = item.dtFeriado.split('-');
      const storedYear = localStorage.getItem('dremoYear');

      return {
        ...item,
        dtFeriado: this.datePipe.transform(new Date(`${month}-${day}-${year}`), 'yyyy-MM-dd'),
        iYearId: storedYear ? JSON.parse(storedYear) : null,
      };
    });

    if (data.dataAccordingColumns.length > 0) {
      of(null)
        .pipe(
          switchMap(() =>
            this.nationalHolidayService.guardarFeriadoNacionalMasivo(data.dataAccordingColumns)
          ),
          tap((res: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Feriados nacionales',
              detail: res.message,
              life: 3000,
            });
          }),
          switchMap(() =>
            this.nationalHolidayService.listarFeriadosNacionales({
              iYAcadId: this.iYAcadId,
            })
          )
        )
        .subscribe({
          next: (res: any) => {
            this.data = res.data.map(item => ({
              ...item,
              dtFeriado: this.datePipe.transform(item.dtFeriado, 'dd/MM/yyyy'),
            }));

            this.dialogs.importNationalHolyday.visible = false;
          },
          error: error => {
            this.importLoading = false;

            this.messageService.add({
              severity: 'error',
              summary: 'Feriados nacionales',
              detail: error ?? 'Ha ocurrido un error al importar los feriados nacionales',
              life: 3000,
            });
          },
          complete: () => {
            this.importLoading = false;
            this.file = undefined;
          },
        });
    } else {
      this.importLoading = false;
      this.messageService.add({
        severity: 'success',
        summary: 'Feriados nacionales',
        detail: 'Sin datos',
        life: 3000,
      });
    }
  }

  // Datos para tablas
  columns: IColumn[] = [
    {
      type: 'item',
      width: '10%',
      field: '',
      header: '#',
      text_header: 'center',
      text: 'left',
    },
    {
      type: 'date',
      width: '15%',
      field: 'dtFeriado',
      header: 'Fecha',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '50%',
      field: 'cFeriadoNombre',
      header: 'Nombre',
      text_header: 'left',
      text: 'left',
    },
    {
      type: 'estado-activo',
      width: '15%',
      field: 'bFeriadoEsRecuperable',
      header: 'Estado',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'actions',
      width: '10%',
      field: 'actions',
      header: 'Acciones',
      text_header: 'center',
      text: 'center',
    },
  ];
  columnsImport: IColumn[] = [
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

  actions = [
    {
      labelTooltip: 'Editar',
      icon: 'pi pi-pencil',
      accion: 'editar',
      type: 'item',
      class: 'p-button-rounded p-button-warning p-button-text',
    },
    {
      labelTooltip: 'Eliminar',
      icon: 'pi pi-trash',
      accion: 'eliminar',
      type: 'item',
      class: 'p-button-rounded p-button-danger p-button-text',
    },
  ];

  containerActions = [
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
}
