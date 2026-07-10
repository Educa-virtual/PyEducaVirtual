import { PrimengModule } from '@/app/primeng.module';
import { Component, OnInit } from '@angular/core';
import { YearService } from '../year.service';
import { MenuItem, MessageService } from 'primeng/api';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-year-calendario',
  standalone: true,
  imports: [PrimengModule],
  templateUrl: './year-calendario.component.html',
  styleUrl: './year-calendario.component.scss',
})
export class YearCalendarioComponent implements OnInit {
  formCalendario: FormGroup;
  formPeriodo: FormGroup;
  formTurnos: FormGroup;

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
    private messageService: MessageService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.year = this.yearsService.getYear();
  }

  get controles_periodos(): FormArray {
    return this.formPeriodo.get('controles_periodos') as FormArray;
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
        dtFaseInicioRegular: [null, [Validators.required]],
        dtFaseFinRegular: [null, [Validators.required]],
        dtFaseInicioRecuperacion: [null, [Validators.required]],
        dtFaseFinRecuperacion: [null, [Validators.required]],
        controles_periodos: this.fb.array([]),
      });
    } catch (error) {
      console.error(error);
    }
    this.yearsService.crearYear({}).subscribe((data: any) => {
      console.log(data, 'data');
      this.tipos_periodos = this.yearsService.getTiposPeriodos(data?.tipos_periodos);
    });
    this.setBreadCrumbItems();
    this.verCalendarioAcademicos();
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
    this.yearsService.formatearFormControl(
      this.formCalendario,
      'iPeriodoEvalId',
      data.iPeriodoEvalId,
      'number'
    );
    this.yearsService.formatearFormControl(
      this.formCalendario,
      'dtCalAcadInicio',
      data.dtCalAcadInicio,
      'date'
    );
    this.yearsService.formatearFormControl(
      this.formCalendario,
      'dtCalAcadFin',
      data.dtCalAcadFin,
      'date'
    );
    this.yearsService.formatearFormControl(
      this.formCalendario,
      'dtCalAcadMatriculaInicio',
      data.dtCalAcadMatriculaInicio,
      'date'
    );
    this.yearsService.formatearFormControl(
      this.formCalendario,
      'dtCalAcadMatriculaResagados',
      data.dtCalAcadMatriculaResagados,
      'date'
    );
    this.yearsService.formatearFormControl(
      this.formCalendario,
      'dtCalAcadMatriculaFin',
      data.dtCalAcadMatriculaFin,
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

  procesarPeriodos() {
    this.yearsService.procesarPeriodosEvaluacion(this.formCalendario.value).subscribe({
      next: (res: any) => {
        const result = res.data[0];
        const isSuccess = result.Message === 'true';

        this.messageService.add({
          severity: isSuccess ? 'success' : 'warn',
          summary: 'Calendario académico',
          detail: result.resultado,
          life: 3000,
        });
      },
    });
  }

  volver() {
    this.router.navigate([`/gestion-institucional/years`]);
  }
}
