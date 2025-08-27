import { PrimengModule } from '@/app/primeng.module';
import { TurnosService } from '@/app/servicios/acad/turnos.service';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { MostrarErrorComponent } from '@/app/shared/components/mostrar-error/mostrar-error.component';
import { ModalPrimengComponent } from '@/app/shared/modal-primeng/modal-primeng.component';
import { Component, EventEmitter, inject, Input, OnChanges, Output } from '@angular/core';

@Component({
  selector: 'app-configurar-turnos',
  standalone: true,
  imports: [PrimengModule, ModalPrimengComponent],
  templateUrl: './configurar-turnos.component.html',
  styleUrl: './configurar-turnos.component.scss',
})
export class ConfigurarTurnosComponent extends MostrarErrorComponent implements OnChanges {
  @Output() accionCloseForm = new EventEmitter<void>();
  @Output() datosConfiguracionTurnos = new EventEmitter();

  @Input() showModal: boolean = false;
  @Input() horarios: any = [];
  @Input() iTurnoId: number;
  @Input() dtAperTurnoInicio: any;
  @Input() dtAperTurnoFin: any;

  private _TurnosService = inject(TurnosService);
  private _ConstantesService = inject(ConstantesService);

  isLoading: boolean = false;

  turnos: any = [];

  ngOnChanges(changes) {
    if (changes.showModal.currentValue) {
      this.showModal = changes.showModal.currentValue;
    }
    if (changes.horarios.currentValue) {
      this.horarios = changes.horarios.currentValue;
    }
    if (changes.iTurnoId.currentValue) {
      this.iTurnoId = changes.iTurnoId.currentValue;
    }
    if (changes.iTurnoId.currentValue) {
      this.iTurnoId = changes.iTurnoId.currentValue;
    }
    if (changes.iTurnoId.currentValue) {
      this.iTurnoId = Number(changes.iTurnoId.currentValue);
    }

    this.obtenerTurnos();
  }

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
        }
      },
      error: error => {
        this.mostrarErrores(error);
      },
    });
  }

  enviarDatosConfiguracionTurno() {
    if (this.isLoading) return; // evitar doble clic
    this.isLoading = true;

    const hayDiaSeleccionado = this.horarios.some(dia => dia.iDiaSeleccionado);

    if (!hayDiaSeleccionado) {
      this.mostrarMensajeToast({
        severity: 'error',
        summary: 'Error',
        detail: 'No ha seleccionado días',
      });
      this.isLoading = false;
      return;
    }

    if (!this.iTurnoId) {
      this.mostrarMensajeToast({
        severity: 'error',
        summary: 'Error',
        detail: 'No ha seleccionado el turno',
      });
      this.isLoading = false;
      return;
    }

    if (!this.dtAperTurnoInicio) {
      this.mostrarMensajeToast({
        severity: 'error',
        summary: 'Error',
        detail: 'No ha seleccionado la hora de inicio',
      });
      this.isLoading = false;
      return;
    }
    if (!this.dtAperTurnoFin) {
      this.mostrarMensajeToast({
        severity: 'error',
        summary: 'Error',
        detail: 'No ha seleccionado la hora de fin',
      });
      this.isLoading = false;
      return;
    }

    if (this.dtAperTurnoInicio >= this.dtAperTurnoFin) {
      this.mostrarMensajeToast({
        severity: 'error',
        summary: 'Error',
        detail: 'La hora de inicio no puede ser mayor o igual que la hora de fin',
      });
      this.isLoading = false;
      return;
    }

    const data = {
      horarios: this.horarios,
      iTurnoId: this.iTurnoId,
      dtAperTurnoInicio: this.dtAperTurnoInicio,
      dtAperTurnoFin: this.dtAperTurnoFin,
    };
    this.datosConfiguracionTurnos.emit(data);

    this.isLoading = false;
  }
}
