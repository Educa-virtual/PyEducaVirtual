import { PrimengModule } from '@/app/primeng.module';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { EncabezadoPreguntasService } from '@/app/servicios/eval/encabezado-preguntas.service';
import { ValidacionFormulariosService } from '@/app/servicios/validacion-formularios.service';
import { Component, EventEmitter, inject, Input, Output, OnChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-form-encabezado',
  standalone: true,
  imports: [PrimengModule],
  templateUrl: './form-encabezado.component.html',
  styleUrl: './form-encabezado.component.scss',
})
export class FormEncabezadoComponent implements OnChanges {
  @Output() accionForm = new EventEmitter();

  @Input() data;

  private _FormBuilder = inject(FormBuilder);
  private _ConstantesService = inject(ConstantesService);
  private _ValidacionFormulariosService = inject(ValidacionFormulariosService);
  private _MessageService = inject(MessageService);
  private _EncabezadoPreguntasService = inject(EncabezadoPreguntasService);

  formEncabezadoPreguntas = this._FormBuilder.group({
    iEvaluacionId: ['', Validators.required],
    iDocenteId: ['', Validators.required],
    iNivelCicloId: ['', Validators.required],
    iCursoId: ['', Validators.required],
    cEncabPregTitulo: ['', Validators.required],
    cEncabPregContenido: ['', Validators.required],
    iCredId: ['', Validators.required],
  });

  opcion: 'GUARDAR' | 'ACTUALIZAR' = 'GUARDAR';
  isLoading: boolean = false;
  idEncabPregId: string | number;

  ngOnChanges(changes) {
    if (changes.data.currentValue) {
      this.data = changes.data.currentValue;
      const formulario = this.data.cFormulario;
      this.idEncabPregId = formulario?.idEncabPregId;
      this.opcion = this.idEncabPregId ? 'ACTUALIZAR' : 'GUARDAR';
      this.formEncabezadoPreguntas.patchValue({
        cEncabPregTitulo: formulario?.cEncabPregTitulo,
        cEncabPregContenido: formulario?.cEncabPregContenido,
      });
    }
  }

  enviarFormulario() {
    if (this.opcion === 'GUARDAR') {
      this.guardarEncabezadoPreguntas();
    }
    if (this.opcion === 'ACTUALIZAR') {
      if (!this.idEncabPregId) return;
      this.actualizarEncabezadoPreguntas();
    }
  }

  guardarEncabezadoPreguntas() {
    if (this.isLoading) return; // evitar doble clic
    this.isLoading = true;

    this.formEncabezadoPreguntas.patchValue({
      iEvaluacionId: this.data?.iEvaluacionId,
      iDocenteId: this._ConstantesService.iDocenteId,
      iCursoId: this.data?.iCursoId,
      iNivelCicloId: this.data?.iNivelCicloId,
      iCredId: this._ConstantesService.iCredId,
    });

    const nombresCampos: Record<string, string> = {
      iEvaluacionId: 'Evaluación',
      iDocenteId: 'Docente',
      iCursoId: 'Curso',
      iNivelCicloId: 'Nivel Ciclo',
      cEncabPregTitulo: 'Título',
      cEncabPregContenido: 'Descripción',
      iCredId: 'Credencial',
    };
    const { valid, message } = this._ValidacionFormulariosService.validarFormulario(
      this.formEncabezadoPreguntas,
      nombresCampos
    );

    if (!valid && message) {
      this.mostrarMensajeToast(message);
      this.isLoading = false;
      return;
    }

    this._EncabezadoPreguntasService
      .guardarEncabezadoPreguntas(this.formEncabezadoPreguntas.value)
      .subscribe({
        next: resp => {
          if (resp.validated) {
            this.mostrarMensajeToast({
              severity: 'success',
              summary: '¡Genial!',
              detail: resp.message,
            });
            this.accionForm.emit(true);
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

  actualizarEncabezadoPreguntas() {
    if (this.isLoading) return; // evitar doble clic
    this.isLoading = true;

    this.formEncabezadoPreguntas.patchValue({
      iEvaluacionId: this.data?.iEvaluacionId,
      iDocenteId: this._ConstantesService.iDocenteId,
      iCursoId: this.data?.iCursoId,
      iNivelCicloId: this.data?.iNivelCicloId,
      iCredId: this._ConstantesService.iCredId,
    });

    const nombresCampos: Record<string, string> = {
      iEvaluacionId: 'Evaluación',
      iDocenteId: 'Docente',
      iCursoId: 'Curso',
      iNivelCicloId: 'Nivel Ciclo',
      cEncabPregTitulo: 'Título',
      cEncabPregContenido: 'Descripción',
      iCredId: 'Credencial',
    };
    const { valid, message } = this._ValidacionFormulariosService.validarFormulario(
      this.formEncabezadoPreguntas,
      nombresCampos
    );

    if (!valid && message) {
      this.mostrarMensajeToast(message);
      this.isLoading = false;
      return;
    }

    const params = {
      ...this.formEncabezadoPreguntas.value,
    };

    this._EncabezadoPreguntasService
      .actualizarEncabezadoPreguntas(this.idEncabPregId, params)
      .subscribe({
        next: resp => {
          if (resp.validated) {
            this.mostrarMensajeToast({
              severity: 'success',
              summary: '¡Genial!',
              detail: resp.message,
            });
            this.accionForm.emit(true);
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

  mostrarMensajeToast(message) {
    this._MessageService.add(message);
  }
}
