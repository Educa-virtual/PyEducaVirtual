import { PrimengModule } from '@/app/primeng.module';
import { CertificadoService } from '@/app/servicios/cap/certificado.service';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { ADMINISTRADOR_DREMO, INSTRUCTOR, PARTICIPANTE } from '@/app/servicios/seg/perfiles';
import { MostrarErrorComponent } from '@/app/shared/components/mostrar-error/mostrar-error.component';
import { environment } from '@/environments/environment';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-card-capacitaciones',
  standalone: true,
  imports: [PrimengModule],
  templateUrl: './card-capacitaciones.component.html',
  styleUrl: './card-capacitaciones.component.scss',
})
export class CardCapacitacionesComponent extends MostrarErrorComponent {
  backend = environment.backend;
  @Input() capacitacion;
  @Input() descripcion = false; // Para mostrar u ocultar la descripción
  @Input() iPerfilId = ADMINISTRADOR_DREMO;
  @Output() verDetalle = new EventEmitter<string>();

  private _CertificadoService = inject(CertificadoService);
  private _ConstantesService = inject(ConstantesService);

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
      return this.capacitacion.cTipoCapDesc === this.CAP_EXT ? 'success' : 'primary';
    }
    return 'success';
  }

  isDownload = false;
  generarCertificado(capacitacion: any) {
    this.isDownload = true;
    const iPersId = this._ConstantesService.iPersId;

    this._CertificadoService
      .descargarCertificado(capacitacion.iCapacitacionId, iPersId)
      .pipe(finalize(() => (this.isDownload = false)))
      .subscribe({
        next: (resp: any) => {
          // Si es JSON → error
          if (resp?.validated === false) {
            this.mostrarMensajeToast({
              severity: 'error',
              summary: 'Error',
              detail: resp.message || 'Ocurrió un error inesperado',
            });
            return;
          }

          // Si es Blob → abrir/descargar PDF
          const blob = new Blob([resp], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);

          // abrir en otra pestaña:
          // window.open(url, '_blank');

          // descargar:
          const a = document.createElement('a');
          a.href = url;
          a.download = `certificado_${this._ConstantesService.nombres}.pdf`;
          a.click();

          window.URL.revokeObjectURL(url);
        },
        error: error => {
          this.mostrarErrores(error);
        },
      });
  }
}
