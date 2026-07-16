import { Component, OnInit } from '@angular/core';
import {
  IActionTable,
  IColumn,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import { MenuItem, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PrimengModule } from '@/app/primeng.module';
import { YearService } from './year.service';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormService } from '@/app/servicios/reactive-form.service';

@Component({
  selector: 'app-years',
  standalone: true,
  imports: [TablePrimengComponent, PrimengModule],
  providers: [DatePipe],
  templateUrl: './years.component.html',
  styleUrl: './years.component.scss',
})
export class YearsComponent implements OnInit {
  formYear: FormGroup;
  years: any;

  bEditar: boolean = false;
  bSoloLectura: boolean = false;

  dialogYear = {
    title: '',
    visible: false,
  };

  breadCrumbHome: MenuItem = { label: '', icon: 'pi pi-home' };
  breadCrumbItems: MenuItem[] = [{ label: 'Años académicos' }];

  constructor(
    private messageService: MessageService,
    private fb: FormBuilder,
    private yearsService: YearService,
    private formService: ReactiveFormService,
    private dialogConfirm: ConfirmationModalService,
    public datePipe: DatePipe,
    private router: Router
  ) {}

  ngOnInit(): void {
    try {
      this.formYear = this.fb.group({
        iYearId: [''],
        cYearNombre: [new Date().getFullYear(), [Validators.required]],
        cYearOficial: ['', [Validators.required]],
        iYearEstado: [''],
        dtYAcadInicio: ['', [Validators.required]],
        dYAcadFin: ['', [Validators.required]],
        iYAcadId: [''],
      });
    } catch (error) {
      console.error(error);
    }
    this.listarYears();
  }

  agregarYear() {
    this.bSoloLectura = false;
    this.bEditar = false;
    this.dialogYear.title = 'Agregar año académico';
    this.dialogYear.visible = true;
    this.setFormYear({
      iYearEstado: true,
      iYearId: new Date().getFullYear(),
    });
  }

  listarYears() {
    this.yearsService.listarYears({}).subscribe({
      next: (res: any) => {
        this.years = res.data;
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

  guardarYear() {
    this.yearsService.guardarYear(this.formYear.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Se guardó con éxito',
        });
        this.dialogYear.visible = false;
        this.listarYears();
      },
      error: error => {
        console.error('Error guardando año académico:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }

  actualizarYear() {
    this.yearsService.actualizarYear(this.formYear.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Se actualizó con éxito',
        });
        this.dialogYear.visible = false;
        this.listarYears();
      },
      error: error => {
        console.error('Error actualizando año académico:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }

  eliminarYear(item: any) {
    this.yearsService.borrarYear(item).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Eliminado con éxito',
        });
        this.listarYears();
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

  setFormYear(data: any) {
    console.log(data);
    this.formYear.reset(data);
    this.formService.formatearFormControl(
      this.formYear,
      'dtYAcadInicio',
      data.dtYAcadInicio,
      'date'
    );
    this.formService.formatearFormControl(this.formYear, 'dYAcadFin', data.dYAcadFin, 'date');
  }

  accionBtnItem({ accion, item }) {
    switch (accion) {
      case 'ver':
        this.bSoloLectura = true;
        this.formYear.disable();
        this.dialogYear = {
          title: 'Año académico',
          visible: true,
        };
        this.setFormYear(item);
        break;
      case 'editar':
        this.bSoloLectura = false;
        this.bEditar = true;
        this.dialogYear = {
          title: 'Editar año académico',
          visible: true,
        };
        this.formYear.get('iYearEstado').disable();
        this.setFormYear(item);
        break;
      case 'eliminar':
        this.dialogConfirm.openConfirm({
          header: 'Confirmación',
          message: `¿Realmente desea eliminar el año seleecionado?`,
          accept: () => {
            this.eliminarYear(item);
          },
        });
        break;
      case 'distribucion':
        this.yearsService.setYear(item);
        this.router.navigate([
          `/gestion-institucional/years-academicos/${item.iYAcadId}/distribucion`,
        ]);
        break;
      case 'calendario':
        this.yearsService.setYear(item);
        this.router.navigate([`/gestion-institucional/years-academicos/${item.iYAcadId}/config`]);
        break;
    }
  }

  /* Datos de tabla */
  columns: IColumn[] = [
    {
      type: 'item',
      width: '5%',
      field: 'item',
      header: 'Item',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '10%',
      field: 'cYearNombre',
      header: 'Año',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '35%',
      field: 'cYearOficial',
      header: 'Nombre oficial',
      text_header: 'left',
      text: 'left',
    },
    {
      type: 'estado-activo',
      width: '5%',
      field: 'iYearEstado',
      header: 'Activo',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'date',
      width: '10%',
      field: 'dtYAcadInicio',
      header: 'Inicio',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'date',
      width: '10%',
      field: 'dYAcadFin',
      header: 'Fin',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'dropdown-actions',
      width: '5%',
      field: 'actions',
      header: 'Acciones',
      text_header: 'right',
      text: 'right',
    },
  ];

  actions: IActionTable[] = [
    {
      labelTooltip: 'Gestionar semanas lectivas',
      icon: 'pi pi-calendar',
      accion: 'distribucion',
      type: 'item',
      class: 'p-menuitem-link text-primary',
      isVisible: rowData => Number(rowData.iYearEstado) == 1,
    },
    {
      labelTooltip: 'Ver semanas lectivas',
      icon: 'pi pi-calendar',
      accion: 'distribucion',
      type: 'item',
      class: 'p-menuitem-link text-primary',
      isVisible: rowData => Number(rowData.iYearEstado) == 0,
    },
    {
      labelTooltip: 'Configurar calendario académico',
      icon: 'pi pi-sync',
      accion: 'calendario',
      type: 'item',
      class: 'p-menuitem-link text-purple-500',
      isVisible: rowData => Number(rowData.iYearEstado) == 1,
    },
    {
      labelTooltip: 'Ver',
      icon: 'pi pi-eye',
      accion: 'ver',
      type: 'item',
      class: 'p-menuitem-link text-gray-500',
      isVisible: rowData => Number(rowData.iYearEstado) == 0,
    },
    {
      labelTooltip: 'Editar',
      icon: 'pi pi-pencil',
      accion: 'editar',
      type: 'item',
      class: 'p-menuitem-link text-orange-500',
      isVisible: rowData => Number(rowData.iYearEstado) == 1,
    },
    {
      labelTooltip: 'Eliminar',
      icon: 'pi pi-trash',
      accion: 'eliminar',
      type: 'item',
      class: 'p-menuitem-link text-red-500',
      isVisible: rowData => Number(rowData.iYearEstado) == 1,
    },
  ];
}
