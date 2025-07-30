import { PrimengModule } from '@/app/primeng.module';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { ValidacionFormulariosService } from '@/app/servicios/validacion-formularios.service';
import { Component, EventEmitter, inject, Input, Output, OnChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { IBancoAlternativas } from '../../actividades/actividad-evaluacion/evaluacion-form/preguntas-form/preguntas-form.component';
import { abecedario } from '../../../constants/aula-virtual';
import { ModalPrimengComponent } from '@/app/shared/modal-primeng/modal-primeng.component';
import { BancoPreguntasService } from '@/app/servicios/eval/banco-preguntas.service';

@Component({
  selector: 'app-banco-preguntas-form',
  standalone: true,
  imports: [PrimengModule, ModalPrimengComponent],
  templateUrl: './banco-preguntas-form.component.html',
  styleUrl: './banco-preguntas-form.component.scss',
})
export class BancoPreguntasFormComponent implements OnChanges {
  @Output() accionBtnItem = new EventEmitter();

  @Input() showModal: boolean = false;
  @Input() data: any;
  @Input() curso: any;

  private _FormBuilder = inject(FormBuilder);
  private _MessageService = inject(MessageService);
  private _ValidacionFormulariosService = inject(ValidacionFormulariosService);
  private _BancoPreguntasService = inject(BancoPreguntasService);
  private _ConstantesService = inject(ConstantesService);

  iBancoId: any;

  ngOnChanges(changes) {
    if (changes.data?.currentValue) {
      this.data = changes.data.currentValue;
      this.iBancoId = this.data?.iBancoId || null;
      this.opcion = this.iBancoId ? 'ACTUALIZAR' : 'GUARDAR';
      //console.log(this.data)
      this.formPreguntas.patchValue({
        iTipoPregId: Number(this.data?.iTipoPregId),
        cBancoPregunta: this.data?.cBancoPregunta,
        cBancoTextoAyuda: this.data?.cBancoTextoAyuda,
      });
      this.alternativas = this.data?.jsonAlternativas || [];
      this.alternativas = this.alternativas.map((alt, index) => ({
        ...alt,
        id: index.toString(),
        iBancoAltId: alt.iBancoAltId != null ? String(alt.iBancoAltId) : null,
        bBancoAltRptaCorrecta: alt.bBancoAltRptaCorrecta ? 1 : 0,
      }));
    }
    if (changes.curso?.currentValue) {
      this.curso = changes.curso.currentValue;
    }
  }
  opcion: 'GUARDAR' | 'ACTUALIZAR' = 'GUARDAR';
  isLoading: boolean = false;

  formPreguntas = this._FormBuilder.group({
    iDocenteId: ['', Validators.required],
    iTipoPregId: [1, Validators.required],
    iCursoId: [''],
    iNivelCicloId: [''],
    idEncabPregId: [],
    cBancoPregunta: ['', Validators.required],
    cBancoTextoAyuda: [],
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
    //   iTipoPregId: 4,
    //   cTipoPregunta: 'Opción Condicional',
    // },
  ];

  alternativas: IBancoAlternativas[] = [];

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
    const tipo = this.formPreguntas.value.iTipoPregId;
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
      this.guardarBancoPreguntas();
    }

    if (this.opcion === 'ACTUALIZAR') {
      if (!this.iBancoId) return;
      this.actualizarBancoPreguntas();
    }
  }

  validarAlternativas(tipo: number): { esValido: boolean; mensaje: string } {
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

  mostrarMensajeToast(message) {
    this._MessageService.add(message);
  }

  guardarBancoPreguntas() {
    if (this.isLoading) return; // evitar doble clic
    this.isLoading = true;

    this.formPreguntas.patchValue({
      iDocenteId: this._ConstantesService.iDocenteId,
      iCursoId: this.curso?.iCursoId,
      iNivelCicloId: this.curso?.iNivelCicloId,
      iCredId: this._ConstantesService.iCredId,
      jsonAlternativas: JSON.stringify(this.alternativas),
      idEncabPregId: this.curso?.idEncabPregId,
    });

    const nombresCampos: Record<string, string> = {
      iDocenteId: 'Docente',
      iTipoPregId: 'Tipo de Pregunta',
      iCursoId: 'Curso',
      iNivelCicloId: 'Nivel Ciclo',
      cBancoPregunta: 'Enunciado de la pregunta',
      iCredId: 'Credencial',
    };
    const { valid, message } = this._ValidacionFormulariosService.validarFormulario(
      this.formPreguntas,
      nombresCampos
    );

    if (!valid && message) {
      this.mostrarMensajeToast(message);
      this.isLoading = false;
      return;
    }

    this._BancoPreguntasService.guardarBancoPreguntas(this.formPreguntas.value).subscribe({
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

  actualizarBancoPreguntas() {
    if (!this.iBancoId) return;

    if (this.isLoading) return; // evitar doble clic
    this.isLoading = true;

    this.formPreguntas.patchValue({
      iDocenteId: this._ConstantesService.iDocenteId,
      iCredId: this._ConstantesService.iCredId,
      jsonAlternativas: JSON.stringify(this.alternativas),
      idEncabPregId: this.curso?.idEncabPregId,
    });

    const nombresCampos: Record<string, string> = {
      iDocenteId: 'Docente',
      iTipoPregId: 'Tipo de Pregunta',
      cBancoPregunta: 'Enunciado de la pregunta',
      iCredId: 'Credencial',
    };
    const { valid, message } = this._ValidacionFormulariosService.validarFormulario(
      this.formPreguntas,
      nombresCampos
    );

    if (!valid && message) {
      this.mostrarMensajeToast(message);
      this.isLoading = false;
      return;
    }
    const params = {
      ...this.formPreguntas.value,
    };

    this._BancoPreguntasService.actualizarBancoPreguntasxiBancoId(this.iBancoId, params).subscribe({
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
}
