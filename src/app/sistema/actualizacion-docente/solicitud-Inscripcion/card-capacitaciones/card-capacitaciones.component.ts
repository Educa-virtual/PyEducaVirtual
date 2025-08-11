import { PrimengModule } from '@/app/primeng.module';
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
  @Input() idPerfil: number; // ID del perfil del usuario
  @Output() verDetalle = new EventEmitter<string>();

  CAP_EXT = 'CAP-EXT';

  updateUrl(item) {
    item.cImagenUrl = '/images/recursos/miss-lesson-animate.svg';
  }

  getUrlImg(cImagenUrl: string) {
    const imagen = cImagenUrl ? JSON.parse(cImagenUrl) : [];
    return imagen.url ? imagen.url : '/images/recursos/miss-lesson-animate.svg';
  }
  mostrarInscritos() {
    this.verDetalle.emit(this.capacitacion);
  }
}
