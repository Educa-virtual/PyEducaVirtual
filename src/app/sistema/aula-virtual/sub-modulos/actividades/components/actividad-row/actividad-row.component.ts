import {
  CUESTIONARIO,
  EVALUACION,
  FORO,
  IActividad,
  TAREA,
} from '@/app/sistema/aula-virtual/interfaces/actividad.interface';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { IconComponent } from '@/app/shared/icon/icon.component';
import { ActividadConfigPipe } from '@/app/sistema/aula-virtual/pipes/actividad-config.pipe';
import { PrimengModule } from '@/app/primeng.module';
import { IsIconTypePipe } from '@/app/shared/pipes/is-icon-type.pipe';

@Component({
  selector: 'app-actividad-row',
  standalone: true,
  imports: [CommonModule, IconComponent, ActividadConfigPipe, PrimengModule, IsIconTypePipe],
  templateUrl: './actividad-row.component.html',
  styleUrl: './actividad-row.component.scss',
})
export class ActividadRowComponent {
  @Input({ required: true }) actividad: IActividad;
  @Output() actionSelected = new EventEmitter<{
    actividad: IActividad;
    action: string;
  }>();

  onAction(action: string, event: Event) {
    this.actionSelected.emit({ actividad: this.actividad, action });
    event.stopPropagation();
  }
  obtenerStyleActividad(iEstadoActividad) {
    let styleActividad = '';
    switch (Number(iEstadoActividad)) {
      case 1: //Sin iniciar
        styleActividad = 'border-left:15px solid var(--bluegray-500);';
        break;
      case 2: //EN PROCESO
        styleActividad = 'border-left:15px solid var(--green-500);';
        break;
      case 0: //CULMINADO
        styleActividad = 'border-left:15px solid var(--red-500);';
        break;
    }
    return styleActividad;
  }
  // asignar el color de los caracteres del titulo
  asignarColorActividad(): string {
    if (this.actividad.iActTipoId === TAREA) {
      return 'background-tarea';
    }
    if (this.actividad.iActTipoId === EVALUACION) {
      return 'background-evaluacion';
    }
    if (this.actividad.iActTipoId === FORO) {
      return 'background-foro';
    }
    if (this.actividad.iActTipoId === CUESTIONARIO) {
      return 'background-cuestionario';
    }
    return 'background-default';
  }
}
