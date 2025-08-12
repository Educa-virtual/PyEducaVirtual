import { PrimengModule } from '@/app/primeng.module';
import { ADMINISTRADOR_DREMO, INSTRUCTOR, PARTICIPANTE } from '@/app/servicios/seg/perfiles';
import { environment } from '@/environments/environment';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-card-capacitaciones',
  standalone: true,
  imports: [PrimengModule],
  templateUrl: './card-capacitaciones.component.html',
  styleUrl: './card-capacitaciones.component.scss',
})
export class CardCapacitacionesComponent {
  backend = environment.backend;
  @Input() capacitacion;
  @Input() descripcion = false; // Para mostrar u ocultar la descripción
  @Input() iPerfilId = ADMINISTRADOR_DREMO;
  @Output() verDetalle = new EventEmitter<string>();

  ADMINISTRADOR_DREMO = ADMINISTRADOR_DREMO;
  INSTRUCTOR = INSTRUCTOR;
  PARTICIPANTE = PARTICIPANTE;

  CAP_EXT = 'CAP-EXT';

  updateUrl(item) {
    item.cImagenUrl = '/images/recursos/miss-lesson-animate.svg';
  }

  getUrlImg(cImagenUrl: string) {
    const imagen = cImagenUrl ? JSON.parse(cImagenUrl) : [];
    return imagen.url ? imagen.url : '/images/recursos/miss-lesson-animate.svg';
  }
  irAccionEvento() {
    this.verDetalle.emit(this.capacitacion);
  }

  getBotonLabel(): string {
    if (this.iPerfilId === this.ADMINISTRADOR_DREMO) {
      return this.capacitacion.cTipoCapDesc === this.CAP_EXT ? 'Ir al sitio' : 'Ver inscritos';
    }
    return 'Ingresar';
  }

  getBotonSeverity():
    | 'success'
    | 'info'
    | 'warning'
    | 'danger'
    | 'help'
    | 'primary'
    | 'secondary'
    | 'contrast' {
    if (this.iPerfilId === this.ADMINISTRADOR_DREMO) {
      return this.capacitacion.cTipoCapDesc === this.CAP_EXT ? 'danger' : 'primary';
    }
    return 'success';
  }
}
