import { Component, EventEmitter, Input, Output, inject, OnChanges } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { FormBuilder, Validators } from '@angular/forms';
import { abecedario } from '@/app/sistema/aula-virtual/constants/aula-virtual';
import { ValidacionFormulariosService } from '@/app/servicios/validacion-formularios.service';
import { EvaluacionPreguntasService } from '@/app/servicios/eval/evaluacion-preguntas.service';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { MostrarErrorComponent } from '@/app/shared/components/mostrar-error/mostrar-error.component';
import { finalize, lastValueFrom } from 'rxjs';
import { EditorComponent, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';

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
  imports: [PrimengModule, EditorComponent],
  templateUrl: './preguntas-form.component.html',
  styleUrl: './preguntas-form.component.scss',
  providers: [{ provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }],
})
export class PreguntasFormComponent extends MostrarErrorComponent implements OnChanges {
  @Output() accionForm = new EventEmitter();
  @Output() accionCloseForm = new EventEmitter<void>();

  @Input() data;

  initEnunciado: EditorComponent['init'] = {
    base_url: '/tinymce', // Root for resources
    suffix: '.min', // Suffix to use when loading resources
    menubar: false,
    selector: 'textarea',
    placeholder: 'Escribe aqui...',
    plugins: 'lists image table',
    toolbar:
      'undo redo | bold italic underline strikethrough | ' +
      'alignleft aligncenter alignright alignjustify | bullist numlist',
    editable_root: true,
    paste_as_text: true,
    branding: false,
    statusbar: false,

    autoresize_bottom_margin: 10,
  };

  private _FormBuilder = inject(FormBuilder);
  private _ValidacionFormulariosService = inject(ValidacionFormulariosService);
  private _EvaluacionPreguntasService = inject(EvaluacionPreguntasService);
  private _ConstantesService = inject(ConstantesService);
  private _HttpClient = inject(HttpClient);

  backend = environment.backend;

  opcion: 'GUARDAR' | 'ACTUALIZAR' = 'GUARDAR';
  isLoading: boolean = false;
  iEvalPregId: string | number;

  formEvaluacionPreguntas = this._FormBuilder.group({
    iEvaluacionId: ['', Validators.required],
    iDocenteId: ['', Validators.required],
    iTipoPregId: [1, Validators.required],
    iCursoId: [''],
    iNivelCicloId: [''],
    idEncabPregId: [],
    cEvalPregPregunta: ['', Validators.required],
    cEvalPregTextoAyuda: [],
    jsonAlternativas: [],
    iCredId: ['', Validators.required],

    bArgumentar: [false, Validators.required],
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
      console.log(formulario);
      this.iEvalPregId = formulario?.iEvalPregId;
      this.opcion = this.iEvalPregId ? 'ACTUALIZAR' : 'GUARDAR';
      this.formEvaluacionPreguntas.patchValue({
        iTipoPregId: Number(formulario?.iTipoPregId),
        cEvalPregPregunta: formulario?.cEvalPregPregunta,
        cEvalPregTextoAyuda: formulario?.cEvalPregTextoAyuda,
        bArgumentar: Boolean(Number(formulario?.bArgumentar)),
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

    const alternativasInvalidas = this.alternativas.filter(alt => {
      const sinDescripcion = !alt.cBancoAltDescripcion || alt.cBancoAltDescripcion.trim() === '';
      const sinImagenValida =
        !alt.cAlternativaImagen || alt.cAlternativaImagen === 'images/no-image.png';
      return sinDescripcion && sinImagenValida;
    });

    if (alternativasInvalidas.length > 0) {
      return {
        esValido: false,
        mensaje: 'Cada alternativa debe tener una descripción o una imagen válida.',
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

    const alternativas = this.alternativas;

    const alternativasLimpias = alternativas.map((alt: any) => {
      return {
        ...alt,
        cAlternativaImagen:
          alt.cAlternativaImagen === 'images/no-image.png' ? null : alt.cAlternativaImagen,
      };
    });

    this.formEvaluacionPreguntas.patchValue({
      iEvaluacionId: this.data?.iEvaluacionId,
      iDocenteId: this._ConstantesService.iDocenteId,
      iCursoId: this.data?.iCursoId,
      iNivelCicloId: this.data?.iNivelCicloId,
      idEncabPregId: this.data?.idEncabPregId,
      iCredId: this._ConstantesService.iCredId,
      jsonAlternativas: JSON.stringify(alternativasLimpias),
      bArgumentar: this.formEvaluacionPreguntas.value.bArgumentar,
    });

    const nombresCampos: Record<string, string> = {
      iEvaluacionId: 'Evaluación',
      iDocenteId: 'Docente',
      iTipoPregId: 'Tipo de Pregunta',
      //iCursoId: 'Curso',
      //iNivelCicloId: 'Nivel Ciclo',
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

    this.formEvaluacionPreguntas.value.jsonAlternativas.map;
    const datos = {
      ...this.formEvaluacionPreguntas.value,
      bArgumentar: this.formEvaluacionPreguntas.value.bArgumentar ? 1 : 0,
    };
    this._EvaluacionPreguntasService
      .guardarEvaluacionPreguntas(datos)
      .pipe(finalize(() => (this.isLoading = false)))
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
          this.mostrarErrores(error);
        },
      });
  }

  actualizarEvaluacionPreguntas() {
    if (this.isLoading) return; // evitar doble clic
    this.isLoading = true;

    const alternativas = this.alternativas;

    const alternativasLimpias = alternativas.map((alt: any) => {
      return {
        ...alt,
        cAlternativaImagen:
          alt.cAlternativaImagen === 'images/no-image.png' ? null : alt.cAlternativaImagen,
      };
    });

    this.formEvaluacionPreguntas.patchValue({
      iEvaluacionId: this.data?.iEvaluacionId,
      iDocenteId: this._ConstantesService.iDocenteId,
      iCursoId: this.data?.iCursoId,
      iNivelCicloId: this.data?.iNivelCicloId,
      idEncabPregId: this.data?.idEncabPregId,
      iCredId: this._ConstantesService.iCredId,
      jsonAlternativas: JSON.stringify(alternativasLimpias),
    });

    const nombresCampos: Record<string, string> = {
      iEvaluacionId: 'Evaluación',
      iDocenteId: 'Docente',
      iTipoPregId: 'Tipo de Pregunta',
      //iCursoId: 'Curso',
      //iNivelCicloId: 'Nivel Ciclo',
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
      .pipe(finalize(() => (this.isLoading = false)))
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
          this.mostrarErrores(error);
        },
      });
  }

  async onUploadChange(evt: Event, alternativa: any) {
    const input = evt.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const dataFile = this.objectToFormData({ file, nameFile: 'aula-alternativas' });

    try {
      const resp = await lastValueFrom(
        this._HttpClient.post<any>(`${environment.backendApi}/general/subir-archivo`, dataFile)
      );
      if (resp?.validated) {
        alternativa.cAlternativaImagen = resp.data;
      } else {
        console.warn('Respuesta sin validated:', resp);
      }
    } catch (err) {
      console.error('Error subida archivo', err);
    }

    (evt.target as HTMLInputElement).value = '';
  }

  objectToFormData(obj: Record<string, any>): FormData {
    const formData = new FormData();
    Object.keys(obj).forEach(key => {
      const val = obj[key];
      if (val === undefined || val === null || val === '') return;

      if (val instanceof File) {
        formData.append(key, val, val.name);
      } else if (Array.isArray(val)) {
        // si mandas arrays, los serializamos (ajusta según backend)
        val.forEach((v, i) => formData.append(`${key}[${i}]`, v));
      } else {
        formData.append(key, String(val));
      }
    });
    return formData;
  }

  updateUrl(item) {
    item.cAlternativaImagen = 'images/no-image.png';
  }
}
