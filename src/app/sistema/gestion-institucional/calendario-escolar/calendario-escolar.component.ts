import { PrimengModule } from '@/app/primeng.module';
import { Component, inject, OnInit } from '@angular/core';
import { ToolbarPrimengComponent } from '@/app/shared/toolbar-primeng/toolbar-primeng.component';
import { TabsPrimengComponent } from '@/app/shared/tabs-primeng/tabs-primeng.component';
import { MostrarErrorComponent } from '@/app/shared/components/mostrar-error/mostrar-error.component';
import { ConfiguracionInicialComponent } from './configuracion-inicial/configuracion-inicial.component';
import { PeriodosAcademicosComponent } from './periodos-academicos/periodos-academicos.component';
import { ResumenComponent } from './resumen/resumen.component';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { FormBuilder, Validators } from '@angular/forms';
import { CalendarioAcademicosService } from '@/app/servicios/acad/calendario-academicos.service';
import { PeriodoEvaluacionesService } from '@/app/servicios/acad/periodo-evaluaciones.service';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';

@Component({
  selector: 'app-calendario-escolar',
  standalone: true,
  imports: [
    PrimengModule,
    ToolbarPrimengComponent,
    TabsPrimengComponent,
    ConfiguracionInicialComponent,
    PeriodosAcademicosComponent,
    ResumenComponent,
  ],
  templateUrl: './calendario-escolar.component.html',
  styleUrl: './calendario-escolar.component.scss',
})
export class CalendarioEscolarComponent extends MostrarErrorComponent implements OnInit {
  private _ConstantesService = inject(ConstantesService);
  private _FormBuilder = inject(FormBuilder);
  private _CalendarioAcademicosService = inject(CalendarioAcademicosService);
  private _PeriodoEvaluacionesService = inject(PeriodoEvaluacionesService);
  private _ConfirmationModalService = inject(ConfirmationModalService);

  selectTab: number = 0;
  tabSeleccionado: string = 'configuracion';
  tabs = [
    {
      title: 'Configuración Inicial',
      icon: 'pi pi-book',
      tab: 'configuracion',
    },
    {
      title: 'Periodos Académicos',
      icon: 'pi pi-home',
      tab: 'periodos',
    },
    {
      title: 'Resumen',
      icon: 'pi pi-home',
      tab: 'resumen',
    },
  ];

  tiposPeriodos: any = [];

  public formCalendarioAcademicos = this._FormBuilder.group({
    cYear: [this._ConstantesService.year],
    iYAcadId: [this._ConstantesService.iYAcadId, Validators.required],
    iSedeId: [this._ConstantesService.iSedeId, Validators.required],

    dtCalAcadInicio: [],
    dtCalAcadFin: [],
    dtCalAcadMatriculaInicio: [],
    dtCalAcadMatriculaFin: [],
    dtCalAcadMatriculaResagados: [],
    dtFaseInicioRegular: [],
    dtFaseFinRegular: [],
    dtFaseInicioRecuperacion: [],
    dtFaseFinRecuperacion: [],

    iPeriodoEvalId: [],
    jsonRegular: [],
    jsonRecuperacion: [],
    jsonCalendarioTurnos: [],
    jsonDiasLaborables: [],

    dtAperTurnoInicio: [],
    dtAperTurnoFin: [],
    jsonHorarios: [],

    iCredId: [this._ConstantesService.iCredId, Validators.required],
  });

  ngOnInit() {
    this.obtenerCalendarioAcademicos();
    this.obtenerPeriodoEvaluaciones();
  }

  updateTab(event): void {
    this.tabSeleccionado = event.tab;
  }

  obtenerCalendarioAcademicos() {
    const params = {
      iCredId: this._ConstantesService.iCredId,
    };
    this._CalendarioAcademicosService
      .obtenerCalendarioAcademicosxiSedeIdxiYAcadId(
        this._ConstantesService.iSedeId,
        this._ConstantesService.iYAcadId,
        params
      )
      .subscribe({
        next: resp => {
          if (resp.validated) {
            const data = resp.data.length ? resp.data[0] : [];
            this.formCalendarioAcademicos.patchValue({
              dtCalAcadInicio: data.dtCalAcadInicio ? new Date(data.dtCalAcadInicio) : null,
              dtCalAcadFin: data.dtCalAcadFin ? new Date(data.dtCalAcadFin) : null,
              dtCalAcadMatriculaInicio: data.dtCalAcadMatriculaInicio
                ? new Date(data.dtCalAcadMatriculaInicio)
                : null,
              dtCalAcadMatriculaFin: data.dtCalAcadMatriculaFin
                ? new Date(data.dtCalAcadMatriculaFin)
                : null,
              dtCalAcadMatriculaResagados: data.dtCalAcadMatriculaResagados
                ? new Date(data.dtCalAcadMatriculaResagados)
                : null,
              dtFaseInicioRegular: data.dtFaseInicioRegular
                ? new Date(data.dtFaseInicioRegular)
                : null,
              dtFaseFinRegular: data.dtFaseFinRegular ? new Date(data.dtFaseFinRegular) : null,
              dtFaseInicioRecuperacion: data.dtFaseInicioRecuperacion
                ? new Date(data.dtFaseInicioRecuperacion)
                : null,
              dtFaseFinRecuperacion: data.dtFaseFinRecuperacion
                ? new Date(data.dtFaseFinRecuperacion)
                : null,
              iPeriodoEvalId: data.iPeriodoEvalId,
              jsonRegular: data.jsonRegular ? JSON.parse(data.jsonRegular) : [],
              jsonRecuperacion: data.jsonRecuperacion ? JSON.parse(data.jsonRecuperacion) : [],
              jsonCalendarioTurnos: data.jsonCalendarioTurnos
                ? JSON.parse(data.jsonCalendarioTurnos)
                : [],
              jsonDiasLaborables: data.jsonDiasLaborables
                ? JSON.parse(data.jsonDiasLaborables)
                : [],
            });
          }
        },
        error: error => {
          this.mostrarErrores(error);
        },
      });
  }

  obtenerPeriodoEvaluaciones() {
    const params = {
      iCredId: this._ConstantesService.iCredId,
    };
    this._PeriodoEvaluacionesService.obtenerPeriodoEvaluaciones(params).subscribe({
      next: resp => {
        if (resp.validated) {
          this.tiposPeriodos = resp.data;
        }
      },
      error: error => {
        this.mostrarErrores(error);
      },
    });
  }

  dataConfigTurnos(evento) {
    this.formCalendarioAcademicos.patchValue({
      dtAperTurnoInicio: evento.dtAperTurnoInicio,
      dtAperTurnoFin: evento.dtAperTurnoInicio,
      jsonHorarios: evento.horarios.length ? JSON.stringify(evento.horarios) : [],
    });
  }
  dataConfigInicial(evento) {
    this.formCalendarioAcademicos.patchValue({
      dtCalAcadInicio: evento.dtCalAcadInicio,
      dtCalAcadFin: evento.dtCalAcadFin,
      dtCalAcadMatriculaInicio: evento.dtCalAcadMatriculaInicio,
      dtCalAcadMatriculaFin: evento.dtCalAcadMatriculaFin,
      dtCalAcadMatriculaResagados: evento.dtCalAcadMatriculaResagados,
      dtFaseInicioRegular: evento.dtFaseInicioRegular,
      dtFaseFinRegular: evento.dtFaseFinRegular,
      dtFaseInicioRecuperacion: evento.dtFaseInicioRecuperacion,
      dtFaseFinRecuperacion: evento.dtFaseFinRecuperacion,
    });
  }

  enviarFormulario() {
    switch (this.tabSeleccionado) {
      case 'configuracion':
        this.enviarConfiguracionInicial();
        break;
    }
  }

  enviarConfiguracionInicial() {
    this._ConfirmationModalService.openConfirm({
      header: 'Antes de ir al siguiente, ¿Desea guardar la información?',
      message: 'No hay problema, puede volver.',
      accept: () => {
        this._CalendarioAcademicosService
          .guardarCalendarioAcademicos(this.formCalendarioAcademicos.value)
          .subscribe({
            next: (resp: any) => {
              if (resp.validated) {
                console.log(resp.data);
                this.selectTab = 1;
                this.tabSeleccionado = 'periodos';
              }
            },
            error: error => {
              this.mostrarErrores(error);
            },
          });
      },
      reject: () => {
        this.selectTab = 1;
        this.tabSeleccionado = 'periodos';
      },
    });
  }
}
