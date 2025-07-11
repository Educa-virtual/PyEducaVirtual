import { PrimengModule } from '@/app/primeng.module';
import { TipoExperienciaAprendizajeService } from '@/app/servicios/aula/tipo-experiencia-aprendizaje.service';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { ModalPrimengComponent } from '@/app/shared/modal-primeng/modal-primeng.component';
import { NgIf } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { SubirArchivoComponent } from '../../../../../shared/subir-archivo/subir-archivo.component';
import { CalendarioPeriodosEvalacionesService } from '@/app/servicios/acad/calendario-periodos-evaluaciones.service';

@Component({
  selector: 'app-sesion-aprendizaje-form',
  standalone: true,
  imports: [ModalPrimengComponent, NgIf, PrimengModule, SubirArchivoComponent],
  templateUrl: './sesion-aprendizaje-form.component.html',
  styleUrl: './sesion-aprendizaje-form.component.scss',
})
export class SesionAprendizajeFormComponent implements OnChanges {
  @Output() accionCloseForm = new EventEmitter<void>();
  @Input() showModal: boolean = false;

  private _TipoExperienciaAprendizajeService = inject(TipoExperienciaAprendizajeService);
  private _ConstantesService = inject(ConstantesService);
  private _MessageService = inject(MessageService);
  private _CalendarioPeriodosEvalacionesService = inject(CalendarioPeriodosEvalacionesService);

  tipoExperiencia = [];
  periodos = [];

  ngOnChanges(changes) {
    if (changes['showModal']) {
      this.showModal = changes['showModal'].currentValue;
      this.obtenerTipoExperienciaAprendizaje();
      this.obtenerPeriodosxiYAcadIdxiSedeIdxFaseRegular();
    }
  }

  obtenerTipoExperienciaAprendizaje() {
    const params = {
      iCredId: this._ConstantesService.iCredId,
    };
    this._TipoExperienciaAprendizajeService.obtenerTipoExperienciaAprendizaje(params).subscribe({
      next: resp => {
        if (resp.validated) {
          const data = resp.data;
          this.tipoExperiencia = data;
        }
      },
      error: error => {
        const errores = error?.error?.errors;
        if (error.status === 422 && errores) {
          // Recorre y muestra cada mensaje de error
          Object.keys(errores).forEach(campo => {
            errores[campo].forEach((mensaje: string) => {
              this.mostrarMensajeToast({
                severity: 'error',
                summary: 'Error de validación',
                detail: mensaje,
              });
            });
          });
        } else {
          // Error genérico si no hay errores específicos
          this.mostrarMensajeToast({
            severity: 'error',
            summary: 'Error',
            detail: error?.error?.message || 'Ocurrió un error inesperado',
          });
        }
      },
    });
  }

  obtenerPeriodosxiYAcadIdxiSedeIdxFaseRegular() {
    const iYAcadId = this._ConstantesService.iYAcadId;
    const iSedeId = this._ConstantesService.iSedeId;
    const params = {
      iCredId: this._ConstantesService.iCredId,
    };
    this._CalendarioPeriodosEvalacionesService
      .obtenerPeriodosxiYAcadIdxiSedeIdxFaseRegular(iYAcadId, iSedeId, params)
      .subscribe({
        next: resp => {
          if (resp.validated) {
            const data = resp.data;
            this.periodos = data;
          }
        },
        error: error => {
          const errores = error?.error?.errors;
          if (error.status === 422 && errores) {
            // Recorre y muestra cada mensaje de error
            Object.keys(errores).forEach(campo => {
              errores[campo].forEach((mensaje: string) => {
                this.mostrarMensajeToast({
                  severity: 'error',
                  summary: 'Error de validación',
                  detail: mensaje,
                });
              });
            });
          } else {
            // Error genérico si no hay errores específicos
            this.mostrarMensajeToast({
              severity: 'error',
              summary: 'Error',
              detail: error?.error?.message || 'Ocurrió un error inesperado',
            });
          }
        },
      });
  }

  mostrarMensajeToast(message) {
    this._MessageService.add(message);
  }
  obtenerArchivo(file) {
    const documentos = file[0]['path'];
    console.log(documentos);
  }
}
