import { PrimengModule } from '@/app/primeng.module';
import { TurnosService } from '@/app/servicios/acad/turnos.service';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { MostrarErrorComponent } from '@/app/shared/components/mostrar-error/mostrar-error.component';
import { IColumn } from '@/app/shared/table-primeng/table-primeng.component';
import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-resumen',
  standalone: true,
  imports: [PrimengModule],
  templateUrl: './resumen.component.html',
  styleUrl: './resumen.component.scss',
})
export class ResumenComponent extends MostrarErrorComponent implements OnChanges {
  @Input() data;

  private _TurnosService = inject(TurnosService);
  private _ConstantesService = inject(ConstantesService);

  turnos: any = [];
  cTurno: string = '';
  dtAperTurnoInicio;
  dtAperTurnoFin;
  label: string = 'Periodo';

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']?.currentValue) {
      this.data = changes['data'].currentValue;

      if (this.data.jsonCalendarioTurnos && this.data.jsonCalendarioTurnos.length) {
        this.data.jsonCalendarioTurnos.forEach(turno => {
          if (turno.dtAperTurnoInicio) {
            this.dtAperTurnoInicio = turno.dtAperTurnoInicio.substring(0, 5);
          }
          if (turno.dtAperTurnoFin) {
            this.dtAperTurnoFin = turno.dtAperTurnoFin.substring(0, 5);
          }
        });
      }
      if (this.data.iPeriodoEvalId === '1') {
        this.label = 'Semestre';
      }
      if (this.data.iPeriodoEvalId === '2') {
        this.label = 'Trimestre';
      }
      if (this.data.iPeriodoEvalId === '3') {
        this.label = 'Bimestre';
      }
      if (this.data.jsonRegular?.length > 0 || this.data.jsonRecuperacion?.length > 0) {
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
        }
      }
    }

    this.obtenerTurnos();
  }
  periodos: any = [];

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
      type: 'date',
      width: '8rem',
      field: 'dtPeriodoEvalAperInicio',
      header: 'Inicio',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'date',
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
  ];

  obtenerTurnos() {
    const params = {
      iCredId: this._ConstantesService.iCredId,
    };
    this._TurnosService.obtenerTurnos(params).subscribe({
      next: resp => {
        if (resp.validated) {
          this.turnos = resp.data;
          this.turnos.forEach(turno => {
            turno.iTurnoId = Number(turno.iTurnoId);
          });
          this.cTurno =
            this.turnos.find(t => t.iTurnoId === this.data.iTurnoId)?.cTurnoNombre || '';
        }
      },
      error: error => {
        this.mostrarErrores(error);
      },
    });
  }
}
