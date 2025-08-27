import { PrimengModule } from '@/app/primeng.module';
import { MostrarErrorComponent } from '@/app/shared/components/mostrar-error/mostrar-error.component';
import { IColumn } from '@/app/shared/table-primeng/table-primeng.component';
import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-periodos-academicos',
  standalone: true,
  imports: [PrimengModule],
  templateUrl: './periodos-academicos.component.html',
  styleUrl: './periodos-academicos.component.scss',
})
export class PeriodosAcademicosComponent extends MostrarErrorComponent implements OnChanges {
  @Input() data;
  @Input() tiposPeriodos;

  periodos: any = [];
  ngOnChanges(changes) {
    if (changes.data.currentValue) {
      this.data = changes.data.currentValue;
      this.data.iPeriodoEvalId;
      this.generarPeriodos();
    }
    if (changes.tiposPeriodos.currentValue) {
      this.tiposPeriodos = changes.tiposPeriodos.currentValue;
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
      type: 'item-innerHtml',
      width: '8rem',
      field: 'cFase',
      header: 'Fase',
      text_header: 'center',
      text: 'center',
    },
  ];

  generarPeriodos() {
    const iPeriodoEvalId = this.data.iPeriodoEvalId;

    const mesesPorPeriodo =
      this.tiposPeriodos.find(periodo => periodo.iPeriodoEvalId === iPeriodoEvalId)
        ?.iPeriodoEvalCantidad ?? 0;

    const crearPeriodoVacio = (index: number) => ({
      iPeriodoEvalAperId: null,
      iFaseId: null,
      iPeriodoEvalId,
      dtPeriodoEvalAperFin: null,
      dtPeriodoEvalAperInicio: null,
      cFase: `<span class="px-4 py-2 text-white bg-green-500 text-lg border-round-xl font-semibold">
            REGULAR ${index + 1}
          </span>`,
    });

    let periodos = [...this.data.jsonRegular];

    if (periodos.length < mesesPorPeriodo) {
      const faltantes = mesesPorPeriodo - periodos.length;
      const nuevos = Array.from({ length: faltantes }, (_, idx) =>
        crearPeriodoVacio(periodos.length + idx)
      );
      periodos = [...periodos, ...nuevos];
    } else if (periodos.length > mesesPorPeriodo) {
      periodos = periodos.slice(0, mesesPorPeriodo);
    }

    this.periodos = periodos;

    if (this.data.jsonRecuperacion.length) {
      this.periodos = [...this.periodos, ...this.data.jsonRecuperacion];
    } else {
      this.periodos = [
        ...this.periodos,
        {
          iPeriodoEvalAperId: null,
          iFaseId: null,
          iPeriodoEvalId: null,
          dtPeriodoEvalAperFin: null,
          dtPeriodoEvalAperInicio: null,
          cFase:
            '<span class="px-4 py-2 text-white bg-red-500 text-lg border-round-xl font-semibold">RECUPERACIÓN</span>',
        },
      ];
    }

    this.periodos.forEach((periodo, index) => {
      if (periodo.dtPeriodoEvalAperInicio) {
        periodo.dtPeriodoEvalAperInicio = new Date(periodo.dtPeriodoEvalAperInicio);
      }
      if (periodo.dtPeriodoEvalAperFin) {
        periodo.dtPeriodoEvalAperFin = new Date(periodo.dtPeriodoEvalAperFin);
      }

      if (index === this.periodos.length - 1 && !periodo.dtPeriodoEvalAperInicio) {
        periodo.cPeriodo = 'Vacacional';
      } else {
        let label = 'Periodo';
        if (this.data.iPeriodoEvalId === '1') {
          label = 'Semestre';
        }
        if (this.data.iPeriodoEvalId === '2') {
          label = 'Trimestre';
        }
        if (this.data.iPeriodoEvalId === '3') {
          label = 'Bimestre';
        }

        periodo.cPeriodo = `${index + 1}° ${label}`;
      }
    });
  }
}
