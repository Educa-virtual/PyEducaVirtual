import { PrimengModule } from '@/app/primeng.module';
import { CalendarioPeriodosEvalacionesService } from '@/app/servicios/acad/calendario-periodos-evaluaciones.service';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { MostrarErrorComponent } from '@/app/shared/components/mostrar-error/mostrar-error.component';
import { IColumn } from '@/app/shared/table-primeng/table-primeng.component';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-periodos-academicos',
  standalone: true,
  imports: [PrimengModule],
  templateUrl: './periodos-academicos.component.html',
  styleUrl: './periodos-academicos.component.scss',
})
export class PeriodosAcademicosComponent extends MostrarErrorComponent implements OnChanges {
  @Output() recargarobtenerCalendarioAcademicos = new EventEmitter();

  @Input() data;
  @Input() tiposPeriodos;

  private _CalendarioPeriodosEvalacionesService = inject(CalendarioPeriodosEvalacionesService);
  private _ConstantesService = inject(ConstantesService);

  periodos: any = [];
  isLoading: boolean = false;
  label: string = 'Periodo';
  iPeriodoEvalId: string | number;
  respaldoPeriodos: any = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']?.currentValue) {
      this.data = changes['data'].currentValue;
      if (this.data.iPeriodoEvalId === '1') {
        this.label = 'Semestre';
      }
      if (this.data.iPeriodoEvalId === '2') {
        this.label = 'Trimestre';
      }
      if (this.data.iPeriodoEvalId === '3') {
        this.label = 'Bimestre';
      }
      if (this.data.jsonRegular?.length > 0) {
        this.periodos = [];

        if (this.data.jsonRegular?.length > 0) {
          this.data.jsonRegular.forEach((p: any, index) => {
            this.periodos.push({
              ...p,
              dtPeriodoEvalAperInicio: new Date(p.dtPeriodoEvalAperInicio),
              dtPeriodoEvalAperFin: new Date(p.dtPeriodoEvalAperFin),
              cPeriodo: `${index + 1}° ${this.label}`,
            });
          });
        }

        if (this.data.jsonRecuperacion?.length > 0) {
          this.data.jsonRecuperacion.forEach((p: any) => {
            this.periodos.push({
              ...p,
              dtPeriodoEvalAperInicio: new Date(p.dtPeriodoEvalAperInicio),
              dtPeriodoEvalAperFin: new Date(p.dtPeriodoEvalAperFin),
              cPeriodo: 'Vacacional',
              dtFaseFinRecuperacion: new Date(this.data.dtFaseFinRecuperacion),
            });
          });
        } else {
          this.periodos.push({
            iPeriodoEvalAperId: null,
            iFaseId: null,
            dtPeriodoEvalAperFin: this.data.dtFaseFinRecuperacion
              ? new Date(this.data.dtFaseFinRecuperacion)
              : new Date(),
            dtPeriodoEvalAperInicio: this.data.dtFaseInicioRecuperacion
              ? new Date(this.data.dtFaseInicioRecuperacion)
              : new Date(),
            cFase: `RECUPERACIÓN`,
            cPeriodo: 'Vacacional',
            bHabilitado: 1,
            iFasePromId: 2,
          });
        }
        this.respaldoPeriodos = this.periodos;
      } else {
        this.generarPeriodos();
      }
      this.iPeriodoEvalId = this.data.iPeriodoEvalId;
    }
    if (changes['tiposPeriodos']?.currentValue) {
      this.tiposPeriodos = changes['tiposPeriodos'].currentValue;
    }
  }
  public columnasTabla: IColumn[] = [
    {
      type: 'item',
      width: '0.5rem',
      field: 'index',
      header: '#',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '8rem',
      field: 'cPeriodo',
      header: 'Periodo',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'calendar',
      width: '8rem',
      field: 'dtPeriodoEvalAperInicio',
      header: 'Inicio',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'calendar',
      width: '8rem',
      field: 'dtPeriodoEvalAperFin',
      header: 'Fin',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'tag-estado',
      width: '8rem',
      field: 'cFase',
      header: 'Fase',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'tag',
      width: '8rem',
      field: 'bHabilitado',
      header: 'Estado',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'action',
      width: '8rem',
      field: 'cAction',
      header: '¿Cambiar Estado?',
      text_header: 'center',
      text: 'center',
    },
  ];

  generarPeriodos() {
    const iPeriodoEvalId = this.data.iPeriodoEvalId;
    if (this.data.iPeriodoEvalId === '1') {
      this.label = 'Semestre';
    }
    if (this.data.iPeriodoEvalId === '2') {
      this.label = 'Trimestre';
    }
    if (this.data.iPeriodoEvalId === '3') {
      this.label = 'Bimestre';
    }

    if (!iPeriodoEvalId) return;
    const periodo = this.tiposPeriodos.find(periodo => periodo.iPeriodoEvalId === iPeriodoEvalId);

    const fechasCalculadas = this.calculandoPeriodosFormativos(periodo, this.data);

    this.periodos = fechasCalculadas.map((fecha, index) => ({
      iPeriodoEvalAperId: null,
      iFaseId: null,
      dtPeriodoEvalAperFin: new Date(fecha.fin),
      dtPeriodoEvalAperInicio: new Date(fecha.inicio),
      cFase: `REGULAR`,
      cPeriodo: `${index + 1}° ${this.label}`,
      bHabilitado: 1,
      iFasePromId: 1,
    }));

    if (this.data.dtFaseInicioRecuperacion && this.data.dtFaseFinRecuperacion) {
      this.periodos.push({
        iPeriodoEvalAperId: null,
        iFaseId: null,
        dtPeriodoEvalAperFin: new Date(this.data.dtFaseFinRecuperacion),
        dtPeriodoEvalAperInicio: new Date(this.data.dtFaseInicioRecuperacion),
        cFase: `RECUPERACIÓN`,
        cPeriodo: 'Vacacional',
        bHabilitado: 1,
        iFasePromId: 2,
      });
    }
  }

  calculandoPeriodosFormativos(periodo, data) {
    const inicio = new Date(data.dtFaseInicioRegular);
    const fin = new Date(data.dtFaseFinRegular);

    // Configuración de periodos según cantidad
    const periodosConfig = {
      4: { cantidad: 2, meses: 6, label: 'Semestre' },
      3: { cantidad: 3, meses: 3, label: 'Trimestre' },
      2: { cantidad: 4, meses: 3, label: 'Bimestre' },
    };

    const config = periodosConfig[periodo.iPeriodoEvalCantidad];
    if (!config) {
      throw new Error(
        'Cantidad de periodos no válida. Debe ser 2 (Bimestre), 3 (Trimestre) o 6 (Semestre).'
      );
    }

    const periodosAcad = [];
    let inicioPeriodo = new Date(inicio);

    for (let i = 0; i < config.cantidad; i++) {
      // calcular fin de periodo
      let finPeriodo = new Date(inicioPeriodo);
      finPeriodo.setMonth(finPeriodo.getMonth() + config.meses);
      finPeriodo.setDate(finPeriodo.getDate() - 1);

      if (finPeriodo > fin) finPeriodo = new Date(fin);

      periodosAcad.push({
        tipo: config.label,
        inicio: new Date(inicioPeriodo),
        fin: new Date(finPeriodo),
      });

      // siguiente inicio = día siguiente
      inicioPeriodo = new Date(finPeriodo);
      inicioPeriodo.setDate(inicioPeriodo.getDate() + 1);
    }

    return periodosAcad;
  }

  onDateChange(rowIndex: number, field: string, value: Date) {
    if (field === 'dtPeriodoEvalAperFin') {
      const siguiente = this.periodos[rowIndex + 1];
      if (siguiente) {
        const nuevoInicio = new Date(value);
        nuevoInicio.setDate(nuevoInicio.getDate() + 1);
        siguiente.dtPeriodoEvalAperInicio = nuevoInicio;
      }
    }

    if (field === 'dtPeriodoEvalAperInicio') {
      const anterior = this.periodos[rowIndex - 1];
      if (anterior) {
        const nuevoFin = new Date(value);
        nuevoFin.setDate(nuevoFin.getDate() - 1);
        anterior.dtPeriodoEvalAperFin = nuevoFin;
      }
    }
  }

  cambiarEstado(row) {
    row.bHabilitado = row.bHabilitado ? 0 : 1;
  }

  guardarCalendarioPeriodosEvaluaciones() {
    if (this.isLoading) return; // evitar doble clic
    this.isLoading = true;

    for (let i = 0; i < this.periodos.length - 1; i++) {
      const actual = this.periodos[i];
      const siguiente = this.periodos[i + 1];

      const fin = new Date(actual.dtPeriodoEvalAperFin);
      const inicioSiguiente = new Date(siguiente.dtPeriodoEvalAperInicio);

      // Si el siguiente es REGULAR (fase 1), debe iniciar al día siguiente exacto
      if (siguiente.iFasePromId === 1) {
        const esperado = new Date(fin);
        esperado.setDate(fin.getDate() + 1);

        if (inicioSiguiente.getTime() !== esperado.getTime()) {
          this.mostrarMensajeToast({
            summary: '¡Atención!',
            detail: `El periodo "${siguiente.cPeriodo}" debe iniciar el ${esperado.toLocaleDateString()}, 
      pero inicia el ${inicioSiguiente.toLocaleDateString()}`,
            severity: 'error',
          });

          this.isLoading = false;
          return;
        }
      }

      // Si el siguiente es VACACIONAL (fase 2), solo validar que sea después del fin del último
      if (siguiente.iFasePromId === 2) {
        if (inicioSiguiente <= fin) {
          this.mostrarMensajeToast({
            summary: '¡Atención!',
            detail: `El periodo vacacional debe iniciar después de ${fin.toLocaleDateString()}, 
      pero inicia el ${inicioSiguiente.toLocaleDateString()}`,
            severity: 'error',
          });

          this.isLoading = false;
          return;
        }
      }
    }

    const periodosNormalizados = this.periodos.map(p => ({
      ...p,
      bHabilitado: p.bHabilitado === true || p.bHabilitado === 1 ? 1 : 0,
    }));

    const data = {
      iPeriodoEvalId: this.data.iPeriodoEvalId,
      jsonPeriodos: JSON.stringify(periodosNormalizados),
      iSedeId: this._ConstantesService.iSedeId,
      iYAcadId: this._ConstantesService.iYAcadId,
    };

    this._CalendarioPeriodosEvalacionesService
      .guardarCalendarioPeriodosEvalaciones(data)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (resp: any) => {
          if (resp.validated) {
            this.mostrarMensajeToast({
              severity: 'success',
              summary: '¡Éxito!',
              detail: resp.message,
            });
            this.recargarobtenerCalendarioAcademicos.emit();
          }
        },
        error: error => {
          this.mostrarErrores(error);
        },
      });
  }

  restablecerCalendarioPeriodosEvaluaciones() {
    this.data.iPeriodoEvalId = this.iPeriodoEvalId;
    this.periodos = this.respaldoPeriodos;
  }
}
