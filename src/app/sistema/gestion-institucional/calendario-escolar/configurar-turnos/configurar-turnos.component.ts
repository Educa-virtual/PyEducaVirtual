import { PrimengModule } from '@/app/primeng.module';
import { ModalPrimengComponent } from '@/app/shared/modal-primeng/modal-primeng.component';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

@Component({
  selector: 'app-configurar-turnos',
  standalone: true,
  imports: [PrimengModule, ModalPrimengComponent],
  templateUrl: './configurar-turnos.component.html',
  styleUrl: './configurar-turnos.component.scss',
})
export class ConfigurarTurnosComponent implements OnChanges {
  @Output() accionCloseForm = new EventEmitter<void>();

  @Input() showModal: boolean = false;

  isLoading: boolean = false;

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

  ngOnChanges(changes) {
    if (changes.showModal.currentValue) {
      this.showModal = changes.showModal.currentValue;
    }
  }
}
