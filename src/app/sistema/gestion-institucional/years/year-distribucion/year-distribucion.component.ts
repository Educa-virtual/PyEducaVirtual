import { PrimengModule } from '@/app/primeng.module';
import {
  IActionTable,
  IColumn,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import { Component, OnInit } from '@angular/core';
import { YearService } from '../year.service';
import { FormBuilder } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormService } from '@/app/servicios/reactive-form.service';

@Component({
  selector: 'app-year-distribucion',
  standalone: true,
  imports: [PrimengModule, TablePrimengComponent],
  templateUrl: './year-distribucion.component.html',
  styleUrl: './year-distribucion.component.scss',
})
export class YearDistribucionComponent implements OnInit {
  formDistribucion: any;
  year: any;
  iYAcadId: number;

  dialogDistribucion: any = {
    visible: false,
    title: 'Nuevo Distribucion',
  };
  tipos_distribuciones: any[] = [];
  estados: any[] = [
    { label: 'ACTIVO', value: 1 },
    { label: 'INACTIVO', value: 0 },
  ];
  distribuciones: any[] = [];

  bEditar: boolean = false;

  breadCrumbHome: MenuItem = { label: '', icon: 'pi pi-home' };
  breadCrumbItems: MenuItem[] = [];

  constructor(
    private yearService: YearService,
    private formService: ReactiveFormService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmService: ConfirmationModalService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.paramMap.subscribe(params => {
      this.iYAcadId = params.get('iYAcadId') ? Number(params.get('iYAcadId')) : this.iYAcadId;
    });
  }

  setBreadCrumbItems() {
    this.breadCrumbItems = [
      { label: 'Años académicos', routerLink: '/gestion-institucional/years-academicos' },
      { label: this.year ? this.year.cYearNombre : '' },
      { label: 'Distribución de bloques' },
    ];
  }

  ngOnInit(): void {
    try {
      this.formDistribucion = this.fb.group({
        iTipoDistribucionId: [null],
        dtInicioBloque: [null],
        dtFinBloque: [null],
      });
      this.yearService.crearYear({}).subscribe((data: any) => {
        this.tipos_distribuciones = this.yearService.getTiposDistribuciones(
          data?.tipos_distribuciones
        );
      });
    } catch (error) {
      console.error(error);
    }
    this.verYear();
    this.listarDistribuciones();
  }

  verYear() {
    this.yearService
      .verYear({
        iYAcadId: this.iYAcadId,
      })
      .subscribe({
        next: (data: any) => {
          this.year = data.data;
          this.setBreadCrumbItems();
        },
      });
  }

  setFormDistribucion(data: any) {
    this.formDistribucion.reset(data);
    this.formService.formatearFormControl(
      this.formDistribucion,
      'iTipoDistribucionId',
      data.iTipoDistribucionId,
      'number'
    );
    this.formService.formatearFormControl(
      this.formDistribucion,
      'dtInicioBloque',
      data.dtInicioBloque,
      'date'
    );
    this.formService.formatearFormControl(
      this.formDistribucion,
      'dtFinBloque',
      data.dtFinBloque,
      'date'
    );
  }

  agregarDistribucion() {
    this.bEditar = false;
    this.dialogDistribucion.title = 'Agregar distribución';
    this.dialogDistribucion.visible = true;
    this.setFormDistribucion({});
  }

  listarDistribuciones() {
    this.yearService
      .listarDistribucionBloques({
        iYAcadId: this.iYAcadId ?? null,
      })
      .subscribe({
        next: (res: any) => {
          this.distribuciones = res.data;
        },
        error: (error: any) => {
          console.error(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        },
      });
  }

  guardarDistribucion() {
    this.yearService.guardarDistribucionBloque(this.formDistribucion.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Se guardó con éxito',
        });
        this.dialogDistribucion.visible = false;
        this.listarDistribuciones();
      },
      error: error => {
        console.error('Error guardando distribución:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }

  actualizarDistribucion() {
    this.yearService.actualizarDistribucionBloque(this.formDistribucion.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Se actualizó con éxito',
        });
        this.dialogDistribucion.visible = false;
        this.listarDistribuciones();
      },
      error: error => {
        console.error('Error actualizando distribución:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }

  eliminarDistribucion(item: any) {
    this.yearService.borrarDistribucionBloque(item).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Eliminado con éxito',
        });
        this.listarDistribuciones();
      },
      error: (error: any) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }

  accionBtnItem({ accion, item }) {
    switch (accion) {
      case 'editar':
        this.bEditar = true;
        this.dialogDistribucion = {
          title: 'Editar distribución',
          visible: true,
        };
        this.setFormDistribucion(item);
        break;
      case 'borrar':
        this.confirmService.openConfirm({
          header: 'Eliminar distribución',
          message: `¿Realmente desea eliminar el distribución: ${item.c} ?`,
          accept: () => {
            this.eliminarDistribucion(item);
          },
        });
        break;
    }
  }

  regresar() {
    this.router.navigate([`/gestion-institucional/years-academicos`]);
  }

  /* Datos de tabla */
  columns: IColumn[] = [
    {
      type: 'item',
      width: '10%',
      field: 'item',
      header: 'Item',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '40%',
      field: 'cTipoDistribucionNombre',
      header: 'Tipo de Distribucion',
      text_header: 'center',
      text: 'left',
    },
    {
      type: 'date',
      width: '20%',
      field: 'dtInicioBloque',
      header: 'Inicio',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'date',
      width: '20%',
      field: 'dtFinBloque',
      header: 'Fin',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'actions',
      width: '10%',
      field: 'actions',
      header: 'Acciones',
      text_header: 'right',
      text: 'right',
    },
  ];

  actions: IActionTable[] = [
    {
      labelTooltip: 'Editar',
      icon: 'pi pi-pencil',
      accion: 'editar',
      type: 'item',
      class: 'p-button-text p-button-rounded p-button-warning',
    },
    {
      labelTooltip: 'Eliminar',
      icon: 'pi pi-trash',
      accion: 'borrar',
      type: 'item',
      class: 'p-button-text p-button-rounded p-button-danger',
    },
  ];
}
