import { PrimengModule } from '@/app/primeng.module';
import { BtnFileUploadComponent } from '@/app/shared/btn-file-upload/btn-file-upload.component';
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component';
import { IColumn, TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarModule } from 'primeng/calendar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { nationalHolidayService } from './service/national-holiday.service';
import { DatePipe } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { LeerExcelService } from '@/app/servicios/leer-excel.service';

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
  form: FormGroup;

  feriados: any[] = [];
  importados: any[] = [];

  importLoading: boolean = false;
  bEditar: boolean = false;

  dialogImportar = {
    title: '',
    visible: false,
  };
  dialogFeriado = {
    title: '',
    visible: false,
  };

  opciones = [
    { label: 'SI', value: 1 },
    { label: 'NO', value: 0 },
  ];

  breadCrumbHome: MenuItem = { icon: 'pi pi-home', routerLink: '/' };
  breadCrumbItems: MenuItem[] = [{ label: 'Feriados nacionales' }];

  @ViewChild('fileUpload') fileUpload!: BtnFileUploadComponent;

  iYAcadId: number;
  datosExcel: any | null = null;

  constructor(
    private fb: FormBuilder,
    public messageService: MessageService,
    public dialog: ConfirmationModalService,
    public nationalHolidayService: nationalHolidayService,
    public datePipe: DatePipe,
    private store: LocalStoreService,
    private leerExcel: LeerExcelService
  ) {
    this.iYAcadId = this.store.getItem('dremoiYAcadId');
  }

  ngOnInit(): void {
    try {
      this.form = this.fb.group({
        iFeriadoId: [''],
        cFeriadoNombre: ['', [Validators.required]],
        iYAcadId: [this.iYAcadId],
        dtFeriado: ['', [Validators.required]],
        bFeriadoEsRecuperable: [0, [Validators.required]],
        cDocumento: [''],
      });
    } catch (error) {
      console.error(error, 'error de formulario');
    }
    this.listarFeriadosNacionales();
  }

  listarFeriadosNacionales(): void {
    this.nationalHolidayService
      .listarFeriadosNacionales({
        iYAcadId: this.iYAcadId,
      })
      .subscribe({
        next: (data: any) => {
          this.feriados = data.data;
        },
        error: error => {
          console.error('Error obteniendo feriados nacionales:', error);
        },
      });
  }

  setForm(item) {
    this.form.reset(item);
    this.nationalHolidayService.formatearFormControl(
      this.form,
      'dtFeriado',
      item?.dtFeriado,
      'date',
      null
    );
    this.nationalHolidayService.formatearFormControl(
      this.form,
      'bFeriadoEsRecuperable',
      item ? item.bFeriadoEsRecuperable : 0,
      'number',
      null
    );
  }

  accionBtnItem({ accion, item }): void {
    switch (accion) {
      case 'agregar':
        this.bEditar = false;
        this.dialogFeriado = {
          title: 'Agregar feriado nacional',
          visible: true,
        };
        this.form.get('dtFeriado').enable();
        this.setForm({
          iYAcadId: this.iYAcadId,
          bFeriadoEsRecuperable: 0,
        });
        break;
      case 'editar':
        this.bEditar = true;
        this.setForm(item);
        this.form.get('dtFeriado').disable();
        this.dialogFeriado = {
          title: 'Editar feriado nacional',
          visible: true,
        };
        break;
      case 'eliminar':
        this.dialog.openConfirm({
          header: 'Eliminar Registro',
          accept: () => {
            this.borrarFeriadoNacional(item);
          },
        });
        break;
      case 'sincronizar':
        this.dialog.openConfirm({
          header: 'Aplicar feriados nacionales',
          accept: () => {
            this.aplicarFeriadosNacionales();
          },
        });
        break;
      case 'importar':
        this.dialogImportar = {
          title: 'Importar feriados nacionales',
          visible: true,
        };
        break;
    }
  }

  borrarFeriadoNacional(item) {
    this.nationalHolidayService
      .borrarFeriadoNacional({
        iFeriadoId: item.iFeriadoId,
      })
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Exito',
            detail: 'Se ha eliminado el feriado nacional',
          });
          this.listarFeriadosNacionales();
        },
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message ?? 'Error desconocido',
          });
        },
      });
  }

  aplicarFeriadosNacionales() {
    this.nationalHolidayService
      .aplicarFeriadosNacionales({
        iYAcadId: this.iYAcadId,
      })
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Exito',
            detail: 'Se han aplicado los feriados nacionales',
          });
        },
        error: error => {
          console.error('Error aplicando feriados nacionales:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Feriados nacionales',
            detail: error.error.message ?? 'Error desconocido',
          });
        },
      });
  }

  guardarFeriadoNacional(): void {
    this.nationalHolidayService.guardarFeriadoNacional(this.form.value).subscribe({
      next: () => {
        this.dialogFeriado.visible = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Los datos se han guardado correctamente',
        });
        this.listarFeriadosNacionales();
      },
      error: error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message ?? 'Error desconocido',
        });
      },
    });
  }

  actualizarFeriadoNacional() {
    this.nationalHolidayService.actualizarFeriadoNacional(this.form.value).subscribe({
      next: () => {
        this.dialogFeriado.visible = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Los datos se han actualizado correctamente',
        });
        this.listarFeriadosNacionales();
      },
      error: error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message ?? 'Error desconocido',
        });
      },
    });
  }

  async handleArchivo(file: File) {
    this.datosExcel = await this.leerExcel.leerArchivo(file, ['Feriados']);
  }

  guardarFeriadoNacionalMasivo() {
    this.nationalHolidayService
      .guardarFeriadoNacionalMasivo({
        iYAcadId: this.iYAcadId,
        jsonFeriadosNacionales: JSON.stringify(this.datosExcel),
      })
      .subscribe({
        next: (data: any) => {
          this.listarFeriadosNacionales;
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Se procesaron los datos importados',
          });
          this.importados = data.data;
          this.fileUpload?.resetFile();
        },
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message ?? 'Error desconocido',
            life: 3000,
          });
        },
      });
  }

  cerrarDialogFeriado() {
    this.setForm({
      iYAcadId: this.iYAcadId,
      bFeriadoEsRecuperable: 0,
    });
  }

  cerrarDialogImportar() {
    this.datosExcel = null;
    this.fileUpload?.resetFile();
  }

  // Datos para tablas
  columns: IColumn[] = [
    {
      type: 'item',
      width: '5%',
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
      width: '60%',
      field: 'cFeriadoNombre',
      header: 'Nombre',
      text_header: 'left',
      text: 'left',
    },
    {
      type: 'estado-activo',
      width: '15%',
      field: 'bFeriadoEsRecuperable',
      header: '¿Es recuperable?',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'actions',
      width: '5%',
      field: 'actions',
      header: 'Acciones',
      text_header: 'center',
      text: 'center',
    },
  ];

  columnsImport: IColumn[] = [
    {
      type: 'item',
      width: '5%',
      field: 'item',
      header: 'Item',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'date',
      width: '10%',
      field: 'dtFeriado',
      header: 'Fecha',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '35%',
      field: 'cFeriadoNombre',
      header: 'Nombre',
      text_header: 'left',
      text: 'left',
    },
    {
      type: 'estado-activo',
      width: '15%',
      field: 'bImportado',
      header: '¿Fue importado?',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '35%',
      field: 'cImportadoObs',
      header: 'Observación',
      text_header: 'left',
      text: 'left',
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
