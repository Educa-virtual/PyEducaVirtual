import { Component, OnInit } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { MessageService } from 'primeng/api';
import { YearService } from '../year.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormService } from '@/app/servicios/reactive-form.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-year-dias',
  standalone: true,
  imports: [PrimengModule],
  templateUrl: './year-dias.component.html',
  styleUrl: './year-dias.component.scss',
})
export class YearDiasComponent implements OnInit {
  year: any;

  tipos_turnos: any[] = [];
  dias_semana: any[] = [];
  formTurno: FormGroup;

  constructor(
    private yearsService: YearService,
    private formService: ReactiveFormService,
    private messageService: MessageService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.yearsService.setActiveIndex(2);
    this.year = this.yearsService.getYear();
  }

  ngOnInit(): void {
    try {
      this.formTurno = this.fb.group({
        iCalTurnoId: [null],
        iCalAcadId: [null],
        iTurnoId: [null, [Validators.required]],
        dtAperTurnoInicio: [null, [Validators.required]],
        dtAperTurnoFin: [null, [Validators.required]],
        dias: [null, [Validators.required]],
        jsonDiasLaborables: [null],
      });
    } catch (error) {
      console.error(error, 'Error al inicializar el formulario');
    }
    this.yearsService.crearYear({}).subscribe((data: any) => {
      this.tipos_turnos = this.yearsService.getTiposTurnos(data?.tipos_turnos);
      this.dias_semana = this.yearsService.getDiasSemana(data?.dias_semana);
    });
    this.verCalendarioTurno();
  }

  setFormTurno(data: any) {
    this.formTurno.reset(data);
    this.formTurno.get('iCalAcadId').setValue(this.year.iCalAcadId);
    this.formService.formatearFormControl(this.formTurno, 'iTurnoId', data?.iTurnoId, 'number');
    this.formService.formatearFormControl(
      this.formTurno,
      'dtAperTurnoInicio',
      data?.dtAperTurnoInicio,
      'time'
    );
    this.formService.formatearFormControl(
      this.formTurno,
      'dtAperTurnoFin',
      data?.dtAperTurnoFin,
      'time'
    );
    this.formService.formatearFormControl(this.formTurno, 'dias', data.dias, 'json', 'iDiaId');
  }

  verCalendarioTurno() {
    this.yearsService
      .verCalendarioTurno({
        iCalAcadId: this.year.iCalAcadId ?? null,
      })
      .subscribe({
        next: (data: any) => {
          this.setFormTurno(data.data);
        },
        error: (error: any) => {
          console.error(error.error.message);
        },
      });
  }

  guardarCalendarioTurno() {
    this.formService.formControlJsonStringify(
      this.formTurno,
      'jsonDiasLaborables',
      'dias',
      'iDiaId'
    );
    this.yearsService.guardarCalendarioTurno(this.formTurno.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Se guardó con éxito',
        });
        this.verCalendarioTurno();
      },
      error: error => {
        console.error('Error guardando turno:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message ?? 'Error desconocido',
        });
      },
    });
  }

  cambiarTab(index: number) {
    this.yearsService.setActiveIndex(index);
    if (index === 1) {
      this.router.navigate([
        `/gestion-institucional/years-academicos/${this.year.iYAcadId}/config/periodos`,
      ]);
    }
  }
}
