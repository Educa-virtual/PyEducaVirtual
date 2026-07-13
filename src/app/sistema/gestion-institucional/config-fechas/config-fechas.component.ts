import { PrimengModule } from '@/app/primeng.module';
import { BtnFileUploadComponent } from '@/app/shared/btn-file-upload/btn-file-upload.component';
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component';
import { IColumn, TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component';
import { Component, OnInit } from '@angular/core';
import { CalendarModule } from 'primeng/calendar';
import { FormBuilder, FormGroup } from '@angular/forms';
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

  dialogImportar = {
    title: '',
    visible: false,
  };
  dialogFeriado = {
    title: '',
    visible: false,
  };

  breadCrumbHome: MenuItem = { icon: 'pi pi-home', routerLink: '/' };
  breadCrumbItems: MenuItem[] = [{ label: 'Feriados nacionales' }];

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
        cFeriadoNombre: [''],
        iYAcadId: [''],
        dtFeriado: [''],
        bFeriadoEsRecuperable: [''],
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
          console.error('Error fetching Años Académicos:', error);
        },
        complete: () => {
          console.log('Request completed');
        },
      });
  }

  setForm(item) {
    this.form.reset(item);
    console.log(item, 'item');
    this.nationalHolidayService.formatearFormControl(
      this.form,
      'dtFeriado',
      item.dtFeriado,
      'date',
      null
    );
    this.nationalHolidayService.formatearFormControl(
      this.form,
      'bFeriadoEsRecuperable',
      item.bFeriadoEsRecuperable,
      'number',
      null
    );
  }

  accionBtnItem({ accion, item }): void {
    switch (accion) {
      case 'agregar':
        this.dialogFeriado = {
          title: 'Agregar feriado nacional',
          visible: true,
        };
        break;
      case 'editar':
        this.setForm(item);
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
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Los datos se han guardado correctamente',
        });
        this.listarFeriadosNacionales();
      },
      error: error => {
        this.messageService.add({
          severity: 'danger',
          summary: 'Error',
          detail: error.error.message ?? 'Error desconocido',
          life: 3000,
        });
      },
    });
  }

  async handleArchivo(event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
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
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Los feriados nacionales se han guardado correctamente',
          });
          this.importados = data.data;
          this.listarFeriadosNacionales;
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
    this.setForm({});
  }

  cerrarDialogImportar() {
    this.datosExcel = null;
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
      header: '¿Es recuperable?',
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
      width: '10%',
      field: 'item',
      header: 'Item',
      text_header: 'center',
      text: 'center',
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
      width: '30%',
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
      width: '20%',
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
