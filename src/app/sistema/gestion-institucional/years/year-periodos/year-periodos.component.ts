import { Component, OnInit } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { MenuItem, MessageService } from 'primeng/api';
import { YearService } from '../year.service';
import { ReactiveFormService } from '@/app/servicios/reactive-form.service';
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  year: any;
  bEditable: boolean = false;

  dialogPeriodo: any = {
    visible: false,
    title: '',
  };

  formPeriodo: FormGroup;
  selectedItem: any;

  constructor(
    private yearsService: YearService,
    private messageService: MessageService,
    private formService: ReactiveFormService,
    private fb: FormBuilder
  ) {
    this.yearsService.setActiveIndex(1);
    this.year = this.yearsService.getYear();
  }

  ngOnInit(): void {
    try {
      this.formPeriodo = this.fb.group({
        iPeriodoEvalAperId: [null],
        iPeriodoEvalId: [null, [Validators.required]],
        cPeriodoEvalNombre: ['', [Validators.required]],
        iFaseId: [null],
        dtPeriodoEvalAperInicio: [null],
        dtPeriodoEvalAperFin: ['', [Validators.required]],
        bHabilitado: [null],
      });
    } catch (error) {
      console.error(error, 'Error al inicializar el formulario');
    }
    this.listarPeriodos();
  }

  listarPeriodos() {
    this.yearsService
      .listarCalendarioPeriodos({
        iYAcadId: this.year.iYAcadId ?? null,
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

  setFormPeriodo(data: any) {
    this.formPeriodo.reset(data);
    this.formService.formatearFormControl(
      this.formPeriodo,
      'iPeriodoEvalId',
      data.iPeriodoEvalId,
      'number'
    );
    this.formService.formatearFormControl(this.formPeriodo, 'iFaseId', data.iFaseId, 'number');
    this.formService.formatearFormControl(
      this.formPeriodo,
      'iPeriodoEvalAperId',
      data.iPeriodoEvalAperId,
      'date'
    );
    this.formService.formatearFormControl(
      this.formPeriodo,
      'cPeriodoEvalApeNombre',
      data.cPeriodoEvalApeNombre,
      'date'
    );
  }

  accionBtnItemTable({ accion, item }) {
    this.selectedItem = item;
    switch (accion) {
      case 'editar':
        this.bEditable = true;
        this.dialogPeriodo = {
          title: 'Editar periodo',
          visible: true,
        };
        this.setFormPeriodo(item);
        break;
      case 'ver':
        this.bEditable = false;
        this.dialogPeriodo = {
          title: 'Periodo',
          visible: true,
        };
        this.setFormPeriodo(item);
        break;
    }
  }
  columnas: any[] = [
    {
      type: 'text',
      width: '10%',
      field: 'cPeriodoEvalNombre',
      header: 'Periodo',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '10%',
      field: 'cPeriodoEvalNombre',
      header: 'Fase',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'date',
      width: '10%',
      field: 'dtPeriodoEvalAperInicio',
      header: 'Inicio',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'date',
      width: '10%',
      field: 'dtPeriodoEvalAperFin',
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

  actions: any[] = [
    {
      labelTooltip: 'Editar',
      icon: 'pi pi-pencil',
      accion: 'editar',
      type: 'item',
      class: 'p-button-text',
    },
    {
      labelTooltip: 'Ver',
      icon: 'pi pi-eye',
      accion: 'ver',
      type: 'item',
      class: 'p-button-text',
    },
  ];
}
