import { PrimengModule } from '@/app/primeng.module';
import { TypesFilesUploadPrimengComponent } from '@/app/shared/types-files-upload-primeng/types-files-upload-primeng.component';
import { DatePipe, NgIf } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { EVALUACION } from '@/app/sistema/aula-virtual/interfaces/actividad.interface';
import { ValidacionFormulariosService } from '@/app/servicios/validacion-formularios.service';
import { EvaluacionesService } from '@/app/servicios/eval/evaluaciones.service';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { ModalPrimengComponent } from '@/app/shared/modal-primeng/modal-primeng.component';
import { MostrarErrorComponent } from '@/app/shared/components/mostrar-error/mostrar-error.component';
import { finalize } from 'rxjs';

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
export class FormEvaluacionComponent extends MostrarErrorComponent implements OnChanges {
  private _FormBuilder = inject(FormBuilder);
  private _ValidacionFormulariosService = inject(ValidacionFormulariosService);
  private _EvaluacionesService = inject(EvaluacionesService);
  private _ConstantesService = inject(ConstantesService);

  @Output() accionCloseForm = new EventEmitter();
  @Output() accionRefresh = new EventEmitter<void>();

  @Input() showModalEvaluacion: boolean = false;
  @Input() tituloEvaluacion: string;
  @Input() opcionEvaluacion: string;
  @Input() semanaEvaluacion;
  @Input() iEvaluacionId: string | number;

  isLoading: boolean = false;
  pipe = new DatePipe('es-ES');
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
    dtEvaluacionFin: [
      new Date(this.ajustarAHorarioDeMediaHora(new Date()).setHours(this.date.getHours() + 1)),
      Validators.required,
    ],
    iEvaluacionDuracionHoras: [],
    iEvaluacionDuracionMinutos: [],
    iEvaluacionIdPadre: [],
    cEvaluacionArchivoAdjunto: [],
    iContenidoSemId: [null, Validators.required],
    iActTipoId: [0, Validators.required],
    idDocCursoId: [''],
    iCredId: [null, Validators.required],

    iCapacitacionId: [''],
    iYAcadId: ['', Validators.required],
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
        this.mostrarErrores(error);
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

        this.accionCloseForm.emit();
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
      iDocenteId: this._ConstantesService.iDocenteId,
      iActTipoId: EVALUACION,
      iCredId: this._ConstantesService.iCredId,
      cEvaluacionArchivoAdjunto: JSON.stringify(this.filesUrl),
      iYAcadId: this._ConstantesService.iYAcadId,
      idDocCursoId: this.semanaEvaluacion.idDocCursoId,
      iCapacitacionId: this.semanaEvaluacion.iCapacitacionId,
    });

    const nombresCampos: Record<string, string> = {
      iDocenteId: 'Docente',
      cEvaluacionTitulo: 'Título de la evaluación',
      cEvaluacionDescripcion: 'Descripción',
      dtEvaluacionInicio: 'Fecha de inicio',
      dtEvaluacionFin: 'Fecha de fin',
      iContenidoSemId: 'Semana de contenido',
      iActTipoId: 'Tipo de actividad',
      iCredId: 'Credencial',
      iYAcadId: 'Año académico',
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

    const { idDocCursoId, iCapacitacionId } = this.formEvaluacion.value;

    const soloUnoPresente = Boolean(idDocCursoId) !== Boolean(iCapacitacionId);

    if (!soloUnoPresente) {
      this.mostrarMensajeToast({
        severity: 'error',
        summary: 'Error',
        detail: 'No se encontró el curso',
      });
      this.isLoading = false;
      return;
    }
    const data = {
      ...this.formEvaluacion.value,
      dtEvaluacionInicio: this.formEvaluacion.value.dtEvaluacionInicio
        ? this.pipe.transform(this.formEvaluacion.value.dtEvaluacionInicio, 'dd/MM/yyyy HH:mm:ss')
        : null,
      dtEvaluacionFin: this.formEvaluacion.value.dtEvaluacionFin
        ? this.pipe.transform(this.formEvaluacion.value.dtEvaluacionFin, 'dd/MM/yyyy HH:mm:ss')
        : null,
    };

    if (this.iEvaluacionId) {
      this.actualizarEvaluacion(data);
    } else {
      this.guardarEvaluacion(data);
    }
  }
  guardarEvaluacion(data) {
    this._EvaluacionesService
      .guardarEvaluaciones(data)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: resp => {
          if (resp.validated) {
            this.mostrarMensajeToast({
              severity: 'success',
              summary: '¡Genial!',
              detail: resp.message,
            });
            setTimeout(() => {
              this.accionRefresh.emit();
              this.accionCloseForm.emit();
            }, 500);
          }
        },
        error: error => {
          this.mostrarErrores(error);
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
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: resp => {
          if (resp.validated) {
            this.mostrarMensajeToast({
              severity: 'success',
              summary: '¡Genial!',
              detail: resp.message,
            });
            setTimeout(() => {
              this.accionRefresh.emit();
              this.accionCloseForm.emit();
            }, 500);
          }
        },
        error: error => {
          this.mostrarErrores(error);
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
}
