import { Component, EventEmitter, Input, Output, inject, OnChanges } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { FormBuilder, Validators } from '@angular/forms';
import { abecedario } from '@/app/sistema/aula-virtual/constants/aula-virtual';
import { MessageService } from 'primeng/api';
import { ValidacionFormulariosService } from '@/app/servicios/validacion-formularios.service';
import { EvaluacionPreguntasService } from '@/app/servicios/eval/evaluacion-preguntas.service';
import { ConstantesService } from '@/app/servicios/constantes.service';

export interface IBancoAlternativas {
  id: string;
  iBancoAltId: string;
  cBancoAltLetra: string;
  cBancoAltDescripcion: string;
  bBancoAltRptaCorrecta: number | boolean;
  cBancoAltExplicacionRpta: string;
  cAlternativaImagen: string;
}

@Component({
  selector: 'app-preguntas-form',
  standalone: true,
  imports: [PrimengModule],
  templateUrl: './preguntas-form.component.html',
  styleUrl: './preguntas-form.component.scss',
})
export class PreguntasFormComponent implements OnChanges {
  @Output() accionForm = new EventEmitter();
  @Output() accionCloseForm = new EventEmitter<void>();

  @Input() data;

  private _FormBuilder = inject(FormBuilder);
  private _MessageService = inject(MessageService);
  private _ValidacionFormulariosService = inject(ValidacionFormulariosService);
  private _EvaluacionPreguntasService = inject(EvaluacionPreguntasService);
  private _ConstantesService = inject(ConstantesService);

  opcion: 'GUARDAR' | 'ACTUALIZAR' = 'GUARDAR';
  isLoading: boolean = false;
  iEvalPregId: string | number;

  formEvaluacionPreguntas = this._FormBuilder.group({
    iEvaluacionId: ['', Validators.required],
    iDocenteId: ['', Validators.required],
    iTipoPregId: [1, Validators.required],
    iCursoId: ['', Validators.required],
    iNivelCicloId: ['', Validators.required],
    idEncabPregId: [],
    cEvalPregPregunta: ['', Validators.required],
    cEvalPregTextoAyuda: [],
    jsonAlternativas: [],
    iCredId: ['', Validators.required],
  });

  tipoPreguntas = [
    {
      iTipoPregId: 1,
      cTipoPregunta: 'Opción única',
    },
    {
      iTipoPregId: 2,
      cTipoPregunta: 'Opción múltiple',
    },
    {
      iTipoPregId: 3,
      cTipoPregunta: 'Opción libre',
    },
    // {
    //     iTipoPregId: 4,
    //     cTipoPregunta: 'Opción Condicional',
    // },
  ];

  alternativas: IBancoAlternativas[] = [];

  ngOnChanges(changes) {
    if (changes.data.currentValue) {
      this.data = changes.data.currentValue;
      const formulario = this.data.cFormulario;
      this.iEvalPregId = formulario?.iEvalPregId;
      this.opcion = this.iEvalPregId ? 'ACTUALIZAR' : 'GUARDAR';
      this.formEvaluacionPreguntas.patchValue({
        iTipoPregId: Number(formulario?.iTipoPregId),
        cEvalPregPregunta: formulario?.cEvalPregPregunta,
        cEvalPregTextoAyuda: formulario?.cEvalPregTextoAyuda,
      });
      this.alternativas = formulario?.jsonAlternativas || [];
      this.alternativas = this.alternativas.map((alt, index) => ({
        ...alt,
        id: index.toString(),
        iBancoAltId: alt.iBancoAltId != null ? String(alt.iBancoAltId) : null,
        bBancoAltRptaCorrecta: alt.bBancoAltRptaCorrecta ? 1 : 0,
      }));
    }
  }

  eliminarAlternativa(index: number) {
    this.alternativas.splice(index, 1);
    this.alternativas.forEach((alternativa, i) => {
      const letra = abecedario[i]; // Obtiene la letra según el índice
      alternativa.cBancoAltLetra = letra ? letra.code : ''; // Asigna la nueva letra
    });
  }

  agregarAlternativa() {
    this.alternativas.push({
      id: this.alternativas.length.toString(),
      iBancoAltId: null,
      cBancoAltLetra: null,
      cBancoAltDescripcion: null,
      bBancoAltRptaCorrecta: null,
      cBancoAltExplicacionRpta: null,
      cAlternativaImagen: null,
    });
    this.ordenarAlternativaLetra(this.alternativas);
  }
  ordenarAlternativaLetra(alternativas) {
    if (!alternativas) {
      return;
    }
    alternativas.forEach((alternativa, i) => {
      const letra = abecedario[i]; // Obtiene la letra según el índice
      alternativa.cBancoAltLetra = letra ? letra.code : ''; // Asigna la nueva letra
    });
  }

  enviarFormulario() {
    const tipo = this.formEvaluacionPreguntas.value.iTipoPregId;
    const validacion = this.validarAlternativas(tipo);
    if (!validacion.esValido) {
      this.mostrarMensajeToast({
        severity: 'error',
        summary: 'Error',
        detail: validacion.mensaje || 'Ocurrió un error inesperado',
      });
      return;
    }

    if (this.opcion === 'GUARDAR') {
      this.guardarEvaluacionPreguntas();
    }

    if (this.opcion === 'ACTUALIZAR') {
      if (!this.iEvalPregId) return;
      this.actualizarEvaluacionPreguntas();
    }
  }

  validarAlternativas(tipo: number): { esValido: boolean; mensaje: string } {
    const iTipoPregId = this.formEvaluacionPreguntas.value.iTipoPregId;
    if (iTipoPregId === 3) {
      // Si es opción libre, no se valida alternativas
      return { esValido: true, mensaje: '' };
    }
    if (!this.alternativas || this.alternativas.length < 3) {
      return {
        esValido: false,
        mensaje: 'Debe haber al menos 3 alternativas.',
      };
    }

    const alternativasSinDescripcion = this.alternativas.filter(
      alt => !alt.cBancoAltDescripcion || alt.cBancoAltDescripcion.trim() === ''
    );

    if (alternativasSinDescripcion.length > 0) {
      return {
        esValido: false,
        mensaje: 'Todas las alternativas deben tener una descripción.',
      };
    }

    const respuestasCorrectas = this.alternativas.filter(alt => alt.bBancoAltRptaCorrecta);
    if (tipo === 1 && respuestasCorrectas.length !== 1) {
      return {
        esValido: false,
        mensaje: 'Debe haber exactamente una respuesta correcta.',
      };
    }

    if (tipo === 2 && respuestasCorrectas.length < 2) {
      return {
        esValido: false,
        mensaje: 'Debe haber más de una respuesta correcta.',
      };
    }

    const todasConExplicacion = respuestasCorrectas.every(alt =>
      alt.cBancoAltExplicacionRpta?.trim()
    );
    if (!todasConExplicacion) {
      return {
        esValido: false,
        mensaje: 'Cada respuesta correcta debe tener una explicación.',
      };
    }

    return { esValido: true, mensaje: '' };
  }

  guardarEvaluacionPreguntas() {
    if (this.isLoading) return; // evitar doble clic
    this.isLoading = true;

    this.formEvaluacionPreguntas.patchValue({
      iEvaluacionId: this.data?.iEvaluacionId,
      iDocenteId: this._ConstantesService.iDocenteId,
      iCursoId: this.data?.iCursoId,
      iNivelCicloId: this.data?.iNivelCicloId,
      idEncabPregId: this.data?.idEncabPregId,
      iCredId: this._ConstantesService.iCredId,
      jsonAlternativas: JSON.stringify(this.alternativas),
    });

    const nombresCampos: Record<string, string> = {
      iEvaluacionId: 'Evaluación',
      iDocenteId: 'Docente',
      iTipoPregId: 'Tipo de Pregunta',
      iCursoId: 'Curso',
      iNivelCicloId: 'Nivel Ciclo',
      cEvalPregPregunta: 'Enunciado de la pregunta',
      iCredId: 'Credencial',
    };
    const { valid, message } = this._ValidacionFormulariosService.validarFormulario(
      this.formEvaluacionPreguntas,
      nombresCampos
    );

    if (!valid && message) {
      this.mostrarMensajeToast(message);
      this.isLoading = false;
      return;
    }

    this._EvaluacionPreguntasService
      .guardarEvaluacionPreguntas(this.formEvaluacionPreguntas.value)
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

  actualizarEvaluacionPreguntas() {
    if (this.isLoading) return; // evitar doble clic
    this.isLoading = true;

    this.formEvaluacionPreguntas.patchValue({
      iEvaluacionId: this.data?.iEvaluacionId,
      iDocenteId: this._ConstantesService.iDocenteId,
      iCursoId: this.data?.iCursoId,
      iNivelCicloId: this.data?.iNivelCicloId,
      idEncabPregId: this.data?.idEncabPregId,
      iCredId: this._ConstantesService.iCredId,
      jsonAlternativas: JSON.stringify(this.alternativas),
    });

    const nombresCampos: Record<string, string> = {
      iEvaluacionId: 'Evaluación',
      iDocenteId: 'Docente',
      iTipoPregId: 'Tipo de Pregunta',
      iCursoId: 'Curso',
      iNivelCicloId: 'Nivel Ciclo',
      cEvalPregPregunta: 'Enunciado de la pregunta',
      iCredId: 'Credencial',
    };
    const { valid, message } = this._ValidacionFormulariosService.validarFormulario(
      this.formEvaluacionPreguntas,
      nombresCampos
    );

    if (!valid && message) {
      this.mostrarMensajeToast(message);
      this.isLoading = false;
      return;
    }
    const params = {
      ...this.formEvaluacionPreguntas.value,
    };

    this._EvaluacionPreguntasService
      .actualizarEvaluacionPreguntasxiEvalPregId(this.iEvalPregId, params)
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
