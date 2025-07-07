import { PrimengModule } from '@/app/primeng.module';
import { TypesFilesUploadPrimengComponent } from '@/app/shared/types-files-upload-primeng/types-files-upload-primeng.component';
import { NgIf } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { EVALUACION } from '@/app/sistema/aula-virtual/interfaces/actividad.interface';
import { MessageService } from 'primeng/api';
import { ValidacionFormulariosService } from '@/app/servicios/validacion-formularios.service';
import { EvaluacionesService } from '@/app/servicios/eval/evaluaciones.service';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { ModalPrimengComponent } from '@/app/shared/modal-primeng/modal-primeng.component';

@Component({
  selector: 'app-form-evaluacion',
  standalone: true,
  imports: [PrimengModule, NgIf, TypesFilesUploadPrimengComponent, ModalPrimengComponent],
  templateUrl: './form-evaluacion.component.html',
  styleUrl: './form-evaluacion.component.scss',
})

/**
 * @class FormEvaluacionComponent
 * Componente para gestionar el formulario de evaluaciones.
 * Incluye funcionalidad para manejar evaluaciones, cursos y archivos relacionados.
 */
export class FormEvaluacionComponent implements OnChanges {
  private _FormBuilder = inject(FormBuilder);
  private _MessageService = inject(MessageService);
  private _ValidacionFormulariosService = inject(ValidacionFormulariosService);
  private _EvaluacionesService = inject(EvaluacionesService);
  private _ConstantesService = inject(ConstantesService);

  @Output() accionBtnItem = new EventEmitter();
  @Input() showModalEvaluacion: boolean = false;
  @Input() tituloEvaluacion: string;
  @Input() opcionEvaluacion: string;
  @Input() semanaEvaluacion;
  @Input() iEvaluacionId: string | number;

  isLoading: boolean = false;
  date = this.ajustarAHorarioDeMediaHora(new Date());
  filesUrl = [];
  typesFiles = {
    file: true,
    url: true,
    youtube: true,
    repository: false,
    image: false,
  };

  formEvaluacion = this._FormBuilder.group({
    iEvaluacionId: [],
    iTipoEvalId: [1],
    iInstrumentoId: [],
    iEscalaCalifId: [],
    iDocenteId: [0, Validators.required],
    dtEvaluacionPublicacion: [],
    cEvaluacionTitulo: [null, Validators.required],
    cEvaluacionDescripcion: ['', Validators.required],
    cEvaluacionObjetivo: [],
    nEvaluacionPuntaje: [],
    iEvaluacionNroPreguntas: [],
    dtEvaluacionInicio: [this.date, Validators.required],
    dtEvaluacionFin: [this.date, Validators.required],
    iEvaluacionDuracionHoras: [],
    iEvaluacionDuracionMinutos: [],
    iEvaluacionIdPadre: [],
    cEvaluacionArchivoAdjunto: [],
    iContenidoSemId: [null, Validators.required],
    iActTipoId: [0, Validators.required],
    idDocCursoId: [null, Validators.required],
    iCredId: [null, Validators.required],
  });

  ngOnChanges(changes) {
    // Si el valor de 'showModalEvaluacion' cambia, se actualiza y se obtiene el tipo de evaluaciones
    if (changes.showModalEvaluacion?.currentValue) {
      this.showModalEvaluacion = changes.showModalEvaluacion.currentValue;
    }

    if (changes.semanaEvaluacion?.currentValue) {
      this.semanaEvaluacion = changes.semanaEvaluacion.currentValue;
    }
    if (changes.iEvaluacionId?.currentValue) {
      this.iEvaluacionId = changes.iEvaluacionId.currentValue;
      this.obtenerEvaluacion(this.iEvaluacionId);
    }
  }

  obtenerEvaluacion(iEvaluacionId: string | number) {
    const params = {
      iCredId: this._ConstantesService.iCredId,
    };
    this._EvaluacionesService.obtenerEvaluacionesxiEvaluacionId(iEvaluacionId, params).subscribe({
      next: resp => {
        if (resp.validated) {
          let data = resp.data;
          data = data.length ? data[0] : [];
          data.cEvaluacionArchivoAdjunto = data.cEvaluacionArchivoAdjunto
            ? JSON.parse(data.cEvaluacionArchivoAdjunto)
            : [];
          this.filesUrl = data.cEvaluacionArchivoAdjunto;
          this.formEvaluacion.patchValue({
            ...data,
            dtEvaluacionInicio: new Date(data.dtEvaluacionInicio),
            dtEvaluacionFin: new Date(data.dtEvaluacionFin),
          });
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

  accionBtn(elemento): void {
    const { accion } = elemento;
    const { item } = elemento;
    switch (accion) {
      case 'close-modal-validated':
      case 'close-modal':
        this.formEvaluacion.reset();
        this.formEvaluacion.patchValue({
          cEvaluacionDescripcion: null,
          dtEvaluacionInicio: this.date,
          dtEvaluacionFin: this.date,
        });

        this.filesUrl = [];

        this.accionBtnItem.emit({ accion, item });
        break;
      case 'subir-file-evaluacion':
        this.filesUrl.push({
          type: 1, //1->file
          nameType: 'file',
          name: item.file.name,
          size: item.file.size,
          ruta: item.name,
        });
        break;
      case 'url-evaluacion':
        this.filesUrl.push({
          type: 2, //2->url
          nameType: 'url',
          name: item.name,
          size: '',
          ruta: item.ruta,
        });
        break;
      case 'youtube-evaluacion':
        this.filesUrl.push({
          type: 3, //3->youtube
          nameType: 'youtube',
          name: item.name,
          size: '',
          ruta: item.ruta,
        });
        break;
    }
  }

  guardarActualizarFormInfo() {
    if (this.isLoading) return; // evitar doble clic
    this.isLoading = true;

    this.formEvaluacion.patchValue({
      iContenidoSemId: this.semanaEvaluacion.iContenidoSemId,
      idDocCursoId: this.semanaEvaluacion.idDocCursoId,
      iDocenteId: this._ConstantesService.iDocenteId,
      iActTipoId: EVALUACION,
      iCredId: this._ConstantesService.iCredId,
      cEvaluacionArchivoAdjunto: JSON.stringify(this.filesUrl),
    });

    const nombresCampos: Record<string, string> = {
      iDocenteId: 'Docente',
      cEvaluacionTitulo: 'Título de la evaluación',
      cEvaluacionDescripcion: 'Descripción',
      dtEvaluacionInicio: 'Fecha de inicio',
      dtEvaluacionFin: 'Fecha de fin',
      iContenidoSemId: 'Semana de contenido',
      iActTipoId: 'Tipo de actividad',
      idDocCursoId: 'Curso',
      iCredId: 'Credencial',
    };
    const { valid, message } = this._ValidacionFormulariosService.validarFormulario(
      this.formEvaluacion,
      nombresCampos
    );

    if (!valid && message) {
      this.mostrarMensajeToast(message);
      this.isLoading = false;
      return;
    }

    const data = {
      ...this.formEvaluacion.value,
      dtEvaluacionInicio: this.formatearFechaLocal(this.formEvaluacion.value.dtEvaluacionInicio),
      dtEvaluacionFin: this.formatearFechaLocal(this.formEvaluacion.value.dtEvaluacionFin),
    };

    if (this.iEvaluacionId) {
      this.actualizarEvaluacion(data);
    } else {
      this.guardarEvaluacion(data);
    }
  }
  guardarEvaluacion(data) {
    this._EvaluacionesService.guardarEvaluaciones(data).subscribe({
      next: resp => {
        if (resp.validated) {
          this.mostrarMensajeToast({
            severity: 'success',
            summary: '¡Genial!',
            detail: resp.message,
          });
          this.accionBtn({
            accion: 'close-modal-validated',
            item: [],
          });
        }
        this.isLoading = false;
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
        this.isLoading = false;
      },
    });
  }
  actualizarEvaluacion(data) {
    const params = {
      ...data,
      iCredId: this._ConstantesService.iCredId,
    };
    this._EvaluacionesService
      .actualizarEvaluacionesxiEvaluacionId(this.iEvaluacionId, params)
      .subscribe({
        next: resp => {
          if (resp.validated) {
            this.mostrarMensajeToast({
              severity: 'success',
              summary: '¡Genial!',
              detail: resp.message,
            });
            this.accionBtn({
              accion: 'close-modal-validated',
              item: [],
            });
          }
          this.isLoading = false;
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
          this.isLoading = false;
        },
      });
  }

  ajustarAHorarioDeMediaHora(fecha) {
    const minutos = fecha.getMinutes(); // Obtener los minutos actuales
    const minutosAjustados = minutos <= 30 ? 30 : 0; // Decidir si ajustar a 30 o 0 (hora siguiente)
    if (minutos > 30) {
      fecha.setHours(fecha.getHours() + 1); // Incrementar la hora si los minutos pasan de 30
    }
    fecha.setMinutes(minutosAjustados);
    fecha.setSeconds(0);
    fecha.setMilliseconds(0);
    return fecha;
  }

  mostrarMensajeToast(message) {
    this._MessageService.add(message);
  }

  formatearFechaLocal(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }
}
