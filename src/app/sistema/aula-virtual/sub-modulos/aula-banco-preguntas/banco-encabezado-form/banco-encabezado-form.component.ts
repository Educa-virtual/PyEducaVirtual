import { PrimengModule } from '@/app/primeng.module';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { EncabezadoPreguntasService } from '@/app/servicios/eval/encabezado-preguntas.service';
import { ValidacionFormulariosService } from '@/app/servicios/validacion-formularios.service';
import { ModalPrimengComponent } from '@/app/shared/modal-primeng/modal-primeng.component';
import { Component, EventEmitter, inject, Input, Output, OnChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-banco-encabezado-form',
  standalone: true,
  imports: [ModalPrimengComponent, PrimengModule],
  templateUrl: './banco-encabezado-form.component.html',
  styleUrl: './banco-encabezado-form.component.scss',
})
export class BancoEncabezadoFormComponent implements OnChanges {
  @Output() accionBtnItem = new EventEmitter();

  @Input() showModal: boolean = false;
  @Input() data: any;
  @Input() curso: any;

  private _FormBuilder = inject(FormBuilder);
  private _MessageService = inject(MessageService);
  private _ValidacionFormulariosService = inject(ValidacionFormulariosService);
  private _EncabezadoPreguntasService = inject(EncabezadoPreguntasService);
  private _ConstantesService = inject(ConstantesService);

  opcion: 'GUARDAR' | 'ACTUALIZAR' = 'GUARDAR';
  isLoading: boolean = false;
  idEncabPregId: string | number;

  formEncabezadoPreguntas = this._FormBuilder.group({
    iDocenteId: ['', Validators.required],
    iNivelCicloId: [''],
    iCursoId: [''],
    cEncabPregTitulo: ['', Validators.required],
    cEncabPregContenido: ['', Validators.required],
    iCredId: ['', Validators.required],
  });

  ngOnChanges(changes) {
    if (changes.data.currentValue) {
      this.data = changes.data.currentValue;
      this.idEncabPregId = this.data?.idEncabPregId;
      this.opcion = this.idEncabPregId ? 'ACTUALIZAR' : 'GUARDAR';
      this.formEncabezadoPreguntas.patchValue({
        cEncabPregTitulo: this.data?.cEncabPregTitulo,
        cEncabPregContenido: this.data?.cEncabPregContenido,
      });
    }
    if (changes.curso?.currentValue) {
      this.curso = changes.curso.currentValue;
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
      iDocenteId: this._ConstantesService.iDocenteId,
      iCursoId: this.curso?.iCursoId,
      iNivelCicloId: this.curso?.iNivelCicloId,
      iCredId: this._ConstantesService.iCredId,
    });

    const nombresCampos: Record<string, string> = {
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
      .guardarBancoEncabezadoPreguntas(this.formEncabezadoPreguntas.value)
      .subscribe({
        next: resp => {
          if (resp.validated) {
            this.mostrarMensajeToast({
              severity: 'success',
              summary: '¡Genial!',
              detail: resp.message,
            });
            this.accionBtnItem.emit({
              accion: 'close-modal',
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

  actualizarEncabezadoPreguntas() {
    if (!this.idEncabPregId) return;

    if (this.isLoading) return; // evitar doble clic
    this.isLoading = true;

    this.formEncabezadoPreguntas.patchValue({
      iDocenteId: this._ConstantesService.iDocenteId,
      iCredId: this._ConstantesService.iCredId,
    });

    const nombresCampos: Record<string, string> = {
      iDocenteId: 'Docente',
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
      .actualizarBancoEncabezadoPreguntas(this.idEncabPregId, params)
      .subscribe({
        next: resp => {
          if (resp.validated) {
            this.mostrarMensajeToast({
              severity: 'success',
              summary: '¡Genial!',
              detail: resp.message,
            });
            this.accionBtnItem.emit({
              accion: 'close-modal',
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

  mostrarMensajeToast(message) {
    this._MessageService.add(message);
  }
}
