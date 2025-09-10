import { PrimengModule } from '@/app/primeng.module';
import { MostrarErrorComponent } from '@/app/shared/components/mostrar-error/mostrar-error.component';
import { ModalPrimengComponent } from '@/app/shared/modal-primeng/modal-primeng.component';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-asignar-horario-capacitacion',
  standalone: true,
  templateUrl: './asignar-horario-capacitacion.component.html',
  styleUrls: ['./asignar-horario-capacitacion.component.scss'],
  imports: [PrimengModule, ModalPrimengComponent],
})
export class AsignarHorarioCapacitacionComponent
  extends MostrarErrorComponent
  implements OnChanges
{
  @Input() showModal: boolean = false;
  @Input() data: any;

  @Output() accionCloseForm = new EventEmitter<any>();
  @Output() accionEnviarHorario = new EventEmitter<any>();

  iHorarioUniforme: boolean = true;
  isLoading: boolean = false;
  iHoraInicio: Date | null = null;
  iHoraFin: Date | null = null;

  dias = [
    {
      iDiaId: 1,
      cDiaNombre: 'Lunes',
      iSeleccionado: 0,
      iHoraInicio: null,
      iHoraFin: null,
      iHorarioUniforme: false,
    },
    {
      iDiaId: 2,
      cDiaNombre: 'Martes',
      iSeleccionado: 0,
      iHoraInicio: null,
      iHoraFin: null,
      iHorarioUniforme: false,
    },
    {
      iDiaId: 3,
      cDiaNombre: 'Miércoles',
      iSeleccionado: 0,
      iHoraInicio: null,
      iHoraFin: null,
      iHorarioUniforme: false,
    },
    {
      iDiaId: 4,
      cDiaNombre: 'Jueves',
      iSeleccionado: 0,
      iHoraInicio: null,
      iHoraFin: null,
      iHorarioUniforme: false,
    },
    {
      iDiaId: 5,
      cDiaNombre: 'Viernes',
      iSeleccionado: 0,
      iHoraInicio: null,
      iHoraFin: null,
      iHorarioUniforme: false,
    },
    {
      iDiaId: 6,
      cDiaNombre: 'Sábado',
      iSeleccionado: 0,
      iHoraInicio: null,
      iHoraFin: null,
      iHorarioUniforme: false,
    },
    {
      iDiaId: 7,
      cDiaNombre: 'Domingo',
      iSeleccionado: 0,
      iHoraInicio: null,
      iHoraFin: null,
      iHorarioUniforme: false,
    },
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['showModal']) {
      this.showModal = changes['showModal'].currentValue;
    }
    if (changes['data']) {
      this.data = changes['data'].currentValue;

      const horarios = this.data?.jsonHorario ? JSON.parse(this.data.jsonHorario) : [];
      this.iHorarioUniforme =
        horarios.length > 0 ? (horarios[0].iHorarioUniforme === 0 ? false : true) : false;

      this.iHoraInicio = horarios.length > 0 ? this.parseHoraToDate(horarios[0].iHoraInicio) : null;
      this.iHoraFin = horarios.length > 0 ? this.parseHoraToDate(horarios[0].iHoraFin) : null;

      this.dias = this.dias.map(dia => {
        const diaHorario = horarios.find(h => h.iDiaId === dia.iDiaId);

        return {
          ...dia,
          iHoraInicio: this.iHorarioUniforme
            ? null
            : diaHorario?.iHoraInicio
              ? this.parseHoraToDate(diaHorario.iHoraInicio)
              : null,
          iHoraFin: this.iHorarioUniforme
            ? null
            : diaHorario?.iHoraFin
              ? this.parseHoraToDate(diaHorario.iHoraFin)
              : null,
          iHorarioUniforme: !!this.iHorarioUniforme,
          iSeleccionado: diaHorario ? 1 : 0,
        };
      });
    }
  }

  get diasSeleccionados() {
    return this.dias.filter(d => d.iSeleccionado === 1);
  }

  isValidForm(): boolean {
    const diasSeleccionados = this.dias.filter(d => d.iSeleccionado === 1);

    if (diasSeleccionados.length === 0) {
      return true;
    }

    if (this.iHorarioUniforme) {
      if (!this.iHoraInicio || !this.iHoraFin) {
        return true;
      }
    } else {
      for (const dia of diasSeleccionados) {
        if (!dia.iHoraInicio || !dia.iHoraFin) {
          return true;
        }
      }
    }

    return false;
  }

  guardarHorario() {
    if (this.isLoading) return;
    this.isLoading = true;

    if (this.isValidForm()) {
      this.mostrarMensajeToast({
        severity: 'error',
        summary: 'Error',
        detail: 'Debe seleccionar al menos un día y definir las horas de inicio y fin.',
      });
      this.isLoading = false;
      return;
    }

    if (this.iHorarioUniforme) {
      this.diasSeleccionados.forEach(dia => {
        dia.iHoraInicio = this.iHoraInicio;
        dia.iHoraFin = this.iHoraFin;
        dia.iHorarioUniforme = this.iHorarioUniforme;
      });
    } else {
      this.diasSeleccionados.forEach(dia => {
        dia.iHorarioUniforme = false;
      });
    }

    this.accionEnviarHorario.emit({ dias: this.diasSeleccionados });
  }

  parseHoraToDate(hora: string): Date {
    const [h, m] = hora.split(':').map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d;
  }

  esUltimoDiaSeleccionado(item: any): boolean {
    const seleccionados = this.dias.filter(d => d.iSeleccionado === 1);
    return seleccionados.indexOf(item) === seleccionados.length - 1;
  }
}
