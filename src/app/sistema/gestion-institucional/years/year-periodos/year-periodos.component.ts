import { Component, OnInit } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { MenuItem, MessageService } from 'primeng/api';
import { YearService } from '../year.service';
import { ReactiveFormService } from '@/app/servicios/reactive-form.service';
import {
  IActionTable,
  IColumn,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-year-periodos',
  standalone: true,
  imports: [PrimengModule, TablePrimengComponent],
  templateUrl: './year-periodos.component.html',
  styleUrl: './year-periodos.component.scss',
})
export class YearPeriodosComponent implements OnInit {
  breadCrumbHome: MenuItem = { label: '', icon: 'pi pi-home' };
  breadCrumbItems: MenuItem[] = [];

  periodos: any[] = [];
  tiposFases: any[] = [];

  iYAcadId: number;
  year: any;
  bEditable: boolean = false;

  dialogPeriodo: any = {
    visible: false,
    title: '',
  };

  formPeriodo: FormGroup;
  selectedItem: any;

  opciones: any[] = [
    { label: 'SI', value: true },
    { label: 'NO', value: false },
  ];

  constructor(
    private yearsService: YearService,
    private messageService: MessageService,
    private formService: ReactiveFormService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.yearsService.setActiveIndex(1);
    this.route.parent?.paramMap.subscribe(params => {
      this.iYAcadId = params.get('iYAcadId') ? Number(params.get('iYAcadId')) : this.iYAcadId;
    });
  }

  ngOnInit(): void {
    try {
      this.formPeriodo = this.fb.group({
        iPeriodoEvalAperId: [null],
        iOrden: [{ value: '', disabled: true }],
        iPeriodoEvalId: [null, [Validators.required]],
        cPeriodoEvalNombre: [{ value: '', disabled: true }],
        cFasePromNombre: [{ value: '', disabled: true }],
        iFaseId: [null],
        dtPeriodoEvalAperInicio: [null],
        dtPeriodoEvalAperFin: ['', [Validators.required]],
        bHabilitado: [null],
      });
    } catch (error) {
      console.error(error, 'Error al inicializar el formulario');
    }
    this.verYear();
  }

  verYear() {
    this.yearsService
      .verYear({
        iYAcadId: this.iYAcadId,
      })
      .subscribe({
        next: (data: any) => {
          this.year = data.data;
          this.listarPeriodos();
        },
      });
  }

  listarPeriodos() {
    this.yearsService
      .listarCalendarioPeriodos({
        iYAcadId: this.iYAcadId ?? null,
      })
      .subscribe({
        next: (data: any) => {
          this.periodos = data.data;
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

  procesarPeriodos() {
    this.yearsService
      .procesarCalendarioPeriodos({
        iCalAcadId: this.year.iCalAcadId ?? null,
      })
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Periodo procesado con éxito',
          });
          this.dialogPeriodo.visible = false;
          this.listarPeriodos();
        },
        error: error => {
          console.error('Error procesando periodo:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Error desconocido',
          });
        },
      });
  }

  actualizarPeriodo() {
    this.yearsService.actualizarCalendarioPeriodo(this.formPeriodo.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Periodo actualizado con éxito',
        });
        this.dialogPeriodo.visible = false;
        this.listarPeriodos();
      },
      error: error => {
        console.error('Error actualizando periodo:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Error desconocido',
        });
      },
    });
  }

  setFormPeriodo(data: any) {
    this.formPeriodo.reset(data);
    this.formService.formatearFormControl(
      this.formPeriodo,
      'dtPeriodoEvalAperInicio',
      data.dtPeriodoEvalAperInicio,
      'date'
    );
    this.formService.formatearFormControl(
      this.formPeriodo,
      'dtPeriodoEvalAperFin',
      data.dtPeriodoEvalAperFin,
      'date'
    );
    this.formService.formatearFormControl(
      this.formPeriodo,
      'bHabilitado',
      data.bHabilitado,
      'boolean'
    );
  }

  habilitarForm(bHabilitado: boolean) {
    if (bHabilitado) {
      this.formPeriodo.enable();
      this.formPeriodo.get('iOrden').disable();
      this.formPeriodo.get('cPeriodoEvalNombre').disable();
      this.formPeriodo.get('cFasePromNombre').disable();
    } else {
      this.formPeriodo.disable();
    }
  }

  cambiarTab(index: number) {
    this.yearsService.setActiveIndex(index);
    if (index === 0) {
      this.router.navigate([
        `/gestion-institucional/years-academicos/${this.year.iYAcadId}/config/calendario`,
      ]);
    } else if (index === 2) {
      this.router.navigate([
        `/gestion-institucional/years-academicos/${this.year.iYAcadId}/config/dias`,
      ]);
    }
  }

  accionBtnItemTable({ accion, item }) {
    this.selectedItem = item;
    switch (accion) {
      case 'editar':
        this.bEditable = true;
        this.habilitarForm(true);
        this.dialogPeriodo = {
          title: 'Editar periodo',
          visible: true,
        };
        this.setFormPeriodo(item);
        break;
      case 'ver':
        this.bEditable = false;
        this.habilitarForm(false);
        this.dialogPeriodo = {
          title: 'Periodo',
          visible: true,
        };
        this.setFormPeriodo(item);
        break;
    }
  }

  columnas: IColumn[] = [
    {
      type: 'text',
      width: '10%',
      field: 'iOrden',
      header: 'Orden',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '15%',
      field: 'cFasePromNombre',
      header: 'Fase',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '20%',
      field: 'cPeriodoEvalNombre',
      header: 'Periodo',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'date',
      width: '20%',
      field: 'dtPeriodoEvalAperInicio',
      header: 'Inicio',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'date',
      width: '20%',
      field: 'dtPeriodoEvalAperFin',
      header: 'Fin',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'estado-activo',
      width: '15%',
      field: 'bHabilitado',
      header: 'Habilitado',
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
      labelTooltip: 'Ver',
      icon: 'pi pi-eye',
      accion: 'ver',
      type: 'item',
      class: 'p-button-text p-button-rounded p-button-secondary',
    },
  ];
}
