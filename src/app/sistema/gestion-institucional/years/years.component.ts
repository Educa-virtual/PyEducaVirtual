import { Component, OnInit } from '@angular/core';
import {
  IActionTable,
  IColumn,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import { MenuItem, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeneralService } from '@/app/servicios/general.service';
import { StepConfirmationService } from '@/app/servicios/confirm.service';
import { PrimengModule } from '@/app/primeng.module';
import { YearService } from './config/service/year.service';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-years',
  standalone: true,
  imports: [TablePrimengComponent, PrimengModule],
  providers: [MessageService, GeneralService, StepConfirmationService, DatePipe],
  templateUrl: './years.component.html',
  styleUrl: './years.component.scss',
})
export class YearsComponent implements OnInit {
  formYear: FormGroup;
  formPeriodos: FormGroup;

  years: any;
  bEditar: boolean = false;

  dialogYear = {
    title: '',
    visible: false,
  };
  dialogPeriodos = {
    title: '',
    visible: false,
  };

  periodos: any[] = [];

  breadCrumbHome: MenuItem = { label: 'Inicio', icon: 'pi pi-house' };
  breadCrumbItems: MenuItem[] = [{ label: 'Años académicos' }];

  constructor(
    public messageService: MessageService,
    public query: GeneralService,
    private fb: FormBuilder,
    public yearsService: YearService,
    public dialogConfirm: ConfirmationModalService,
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
      this.formPeriodos = this.fb.group({
        iYAcadId: ['', [Validators.required]],
        iPeriodoEvalId: ['', [Validators.required]],
      });
    } catch (error) {
      console.error(error);
    }
    this.yearsService.crearYear({}).subscribe((data: any) => {
      this.periodos = this.yearsService.getPeriodos(data?.periodos);
    });
    this.listarYears();
  }

  agregarYear() {
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
    this.yearsService.formatearFormControl(
      this.formYear,
      'dtYAcadInicio',
      data.dtYAcadInicio,
      'date'
    );
    this.yearsService.formatearFormControl(this.formYear, 'dYAcadFin', data.dYAcadFin, 'date');
  }

  procesarPeriodos() {
    this.yearsService
      .procesarPeriodosEvaluacion({
        iPerioEvalId: this.formPeriodos.value.iPeriodoEvalId,
        iYAcadId: this.formYear.value.iYAcadId,
      })
      .subscribe({
        next: (res: any) => {
          const result = res.data[0];
          const isSuccess = result.Message === 'true';

          this.messageService.add({
            severity: isSuccess ? 'success' : 'warn',
            summary: 'Calendario académico',
            detail: result.resultado,
            life: 3000,
          });

          this.dialogPeriodos.visible = !isSuccess;
        },
      });
  }

  accionBtnItem({ accion, item }) {
    switch (accion) {
      case 'ver':
        this.formYear.disable();
        this.dialogYear = {
          title: 'Año académico',
          visible: true,
        };
        this.setFormYear(item);
        break;
      case 'editar':
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
      case 'periodos':
        this.dialogPeriodos = {
          title: `Generar periodos del calendario académico para el año: ${item.iYearId}`,
          visible: true,
        };
        this.setFormYear(item);
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
      labelTooltip: 'Procesar periodos',
      icon: 'pi pi-sync',
      accion: 'periodos',
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
