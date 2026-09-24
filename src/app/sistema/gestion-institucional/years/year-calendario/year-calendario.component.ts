import { PrimengModule } from '@/app/primeng.module';
import { Component, OnInit } from '@angular/core';
import { YearService } from '../year.service';
import { MenuItem, MessageService } from 'primeng/api';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormService } from '@/app/servicios/reactive-form.service';

@Component({
  selector: 'app-year-calendario',
  standalone: true,
  imports: [PrimengModule],
  templateUrl: './year-calendario.component.html',
  styleUrl: './year-calendario.component.scss',
})
export class YearCalendarioComponent implements OnInit {
  formCalendario: FormGroup;

  iYAcadId: number;
  year: any;
  periodos: any[] = [];
  turnos: any[] = [];

  tabIndex: number = 0;

  tipos_periodos: any[] = [];
  tipos_turnos: any[] = [];

  breadCrumbHome: MenuItem = { label: '', icon: 'pi pi-home' };
  breadCrumbItems: MenuItem[] = [];

  constructor(
    private yearsService: YearService,
    private formService: ReactiveFormService,
    private messageService: MessageService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.yearsService.setActiveIndex(0);
    this.route.parent?.paramMap.subscribe(params => {
      this.iYAcadId = params.get('iYAcadId') ? Number(params.get('iYAcadId')) : this.iYAcadId;
    });
  }

  ngOnInit(): void {
    try {
      this.formCalendario = this.fb.group({
        iCalAcadId: [null],
        iSedeId: [null],
        iYAcadId: [this.year?.iYAcadId, [Validators.required]],
        iPeriodoEvalId: [null, [Validators.required]],
        dtCalAcadInicio: [null, [Validators.required]],
        dtCalAcadFin: [null, [Validators.required]],
        dtCalAcadMatriculaInicio: [null, [Validators.required]],
        dtCalAcadMatriculaResagados: [null, [Validators.required]],
        dtCalAcadMatriculaFin: [null, [Validators.required]],
        bCalAcadFaseRegular: [null],
        bCalAcadFaseRecuperacion: [null],
        dtFaseInicioRegular: [null],
        dtFaseFinRegular: [null],
        dtFaseInicioRecuperacion: [null],
        dtFaseFinRecuperacion: [null],
      });
    } catch (error) {
      console.error(error);
    }
    this.yearsService.crearYear({}).subscribe((data: any) => {
      this.tipos_periodos = this.yearsService.getTiposPeriodos(data?.tipos_periodos);
    });
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
          this.setBreadCrumbItems();
          this.verCalendarioAcademicos();
        },
      });
  }

  setBreadCrumbItems() {
    this.breadCrumbItems = [
      { label: 'Años académicos', routerLink: '/gestion-institucional/years-academicos' },
      { label: this.year.cYearNombre },
      { label: 'Calendario académico' },
    ];
  }

  crearControlesPeriodos() {
    const formArray = this.formCalendario.get('controles_periodos') as FormArray;
    formArray.clear();
    this.periodos.map((param: any) => {
      let grupo: FormGroup = null;
      grupo = this.fb.group({
        iPeriodoEvalAperId: [param?.iPeriodoEvalAperId, [Validators.required]],
        cPeriodoEvalApeNombre: [param?.cPeriodoEvalApeNombre, [Validators.required]],
        iFaseId: [param?.iFaseId, [Validators.required]],
        iPeriodoEvalId: [param?.iPeriodoEvalId, [Validators.required]],
        dtPeriodoEvalAperInicio: [param?.dtPeriodoEvalAperInicio, [Validators.required]],
        dtPeriodoEvalAperFin: [param?.dtPeriodoEvalAperFin, [Validators.required]],
        bHabilitado: [param?.bHabilitado, [Validators.required]],
      });
      formArray.push(grupo);
    });
  }

  setFormCalendario(data: any) {
    this.formCalendario.reset(data);
    this.formService.formatearFormControl(
      this.formCalendario,
      'iPeriodoEvalId',
      data.iPeriodoEvalId,
      'number'
    );
    this.formService.formatearFormControl(
      this.formCalendario,
      'dtCalAcadInicio',
      data.dtCalAcadInicio,
      'date'
    );
    this.formService.formatearFormControl(
      this.formCalendario,
      'dtCalAcadFin',
      data.dtCalAcadFin,
      'date'
    );
    this.formService.formatearFormControl(
      this.formCalendario,
      'dtCalAcadMatriculaInicio',
      data.dtCalAcadMatriculaInicio,
      'date'
    );
    this.formService.formatearFormControl(
      this.formCalendario,
      'dtCalAcadMatriculaResagados',
      data.dtCalAcadMatriculaResagados,
      'date'
    );
    this.formService.formatearFormControl(
      this.formCalendario,
      'dtCalAcadMatriculaFin',
      data.dtCalAcadMatriculaFin,
      'date'
    );
    this.formService.formatearFormControl(
      this.formCalendario,
      'dtFaseInicioRegular',
      data.dtFaseInicioRegular,
      'date'
    );
    this.formService.formatearFormControl(
      this.formCalendario,
      'dtFaseFinRegular',
      data.dtFaseFinRegular,
      'date'
    );
    this.formService.formatearFormControl(
      this.formCalendario,
      'dtFaseInicioRecuperacion',
      data.dtFaseInicioRecuperacion,
      'date'
    );
    this.formService.formatearFormControl(
      this.formCalendario,
      'dtFaseFinRecuperacion',
      data.dtFaseFinRecuperacion,
      'date'
    );
  }

  verCalendarioAcademicos() {
    this.yearsService
      .verCalendarioAcademicos({
        iYAcadId: this.year.iYAcadId,
      })
      .subscribe({
        next: (data: any) => {
          this.setFormCalendario(data.data);
        },
        error: (error: any) => {
          console.error(error.error.message);
        },
      });
  }

  actualizarCalendario() {
    if (this.formCalendario.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor complete todos los campos requeridos',
      });
      this.formService.validarFormulario(this.formCalendario);
      return;
    }
    this.yearsService.actualizarCalendarioAcademicos(this.formCalendario.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Se actualizó el calendario académico',
        });
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

  volver() {
    this.router.navigate([`/gestion-institucional/years`]);
  }
}
