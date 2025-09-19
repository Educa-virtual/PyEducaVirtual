import { Component, inject, Input, OnChanges } from '@angular/core';
import { ToolbarPrimengComponent } from '../../../../../../shared/toolbar-primeng/toolbar-primeng.component';
import { CommonModule } from '@angular/common';
import { TimeComponent } from '@/app/shared/time/time.component';
import { PrimengModule } from '@/app/primeng.module';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { GeneralService } from '@/app/servicios/general.service';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { environment } from '@/environments/environment';
import { AccordionModule } from 'primeng/accordion';
import { RubricasModule } from '../../../../features/rubricas/rubricas.module';
import { EvaluacionPreguntasService } from '@/app/servicios/eval/evaluacion-preguntas.service';
import { finalize } from 'rxjs';
import { MostrarErrorComponent } from '@/app/shared/components/mostrar-error/mostrar-error.component';
import { PizarraDigitalComponent } from '@/app/shared/pizarra-digital/pizarra-digital.component';
import { EvaluacionRespuestasService } from '@/app/servicios/eval/evaluacion-respuestas.service';

@Component({
  selector: 'app-evaluacion-estudiantes',
  standalone: true,
  imports: [
    ToolbarPrimengComponent,
    CommonModule,
    TimeComponent,
    PrimengModule,
    NgxDocViewerModule,
    AccordionModule,
    RubricasModule,
    PizarraDigitalComponent,
  ],
  templateUrl: './evaluacion-estudiantes.component.html',
  styleUrl: './evaluacion-estudiantes.component.scss',
})
export class EvaluacionEstudiantesComponent extends MostrarErrorComponent implements OnChanges {
  private _ConstantesService = inject(ConstantesService);
  private _GeneralService = inject(GeneralService);
  private _EvaluacionPreguntasService = inject(EvaluacionPreguntasService);
  private _EvaluacionRespuestasService = inject(EvaluacionRespuestasService);

  environment = environment.backend;
  @Input() evaluacion;
  evaluacion1: { iTiempo: number | null } = { iTiempo: 120 };

  iPreguntaId: number = 1;
  preguntas = [];
  itemPreguntas = [];
  esUltimaPregunta: boolean = false;
  display: boolean;
  timeRemaining: number;
  cTareaEstudianteComentarioDocente: any;
  selectedEstudiante: any;
  toggleSection: any;
  sections: any;
  tabs: any;
  dInicio = new Date();
  iEvaluacionId;
  bloquearRespuestas: boolean = false;
  activeIndex: number = 0;

  ngOnChanges(changes) {
    if (changes.evaluacion?.currentValue) {
      this.evaluacion = changes.evaluacion.currentValue;
      if (this.evaluacion?.iEvaluacionId) {
        this.iEvaluacionId = this.evaluacion?.iEvaluacionId;
        this.obtenerEvaluacionPreguntasxiEvaluacionIdxiEstudianteId(this.evaluacion?.iEvaluacionId);
      }
      //this.bloquearRespuestas = Number(this.evaluacion?.iEstado) === 10;
    }
  }
  i;
  mensajeError: string;
  bLoadingPreguntas: boolean = true;
  obtenerEvaluacionPreguntasxiEvaluacionIdxiEstudianteId(iEvaluacionId) {
    this.mensajeError = null;
    if (!iEvaluacionId) return;
    const iEstudianteId = this._ConstantesService.iEstudianteId;
    const params = {
      iCredId: this._ConstantesService.iCredId,
    };
    this.bLoadingPreguntas = true;
    this._EvaluacionPreguntasService
      .obtenerEvaluacionPreguntasxiEvaluacionIdxiEstudianteId(iEvaluacionId, iEstudianteId, params)
      .pipe(finalize(() => (this.bLoadingPreguntas = false)))
      .subscribe({
        next: resp => {
          if (resp.validated) {
            this.preguntas = resp.data;
            this.preguntas.forEach(pregunta => {
              pregunta.bArgumentar = Boolean(Number(pregunta.bArgumentar));
              // Paso 1: Parsear jsonPreguntas si es string
              if (typeof pregunta.jsonPreguntas === 'string') {
                try {
                  pregunta.jsonPreguntas = JSON.parse(pregunta.jsonPreguntas);
                } catch (e) {
                  console.error('Error al parsear jsonPreguntas:', e);
                  pregunta.jsonPreguntas = {};
                }
              }

              // Paso 2: Parsear jsonAlternativas dentro de jsonPreguntas
              if (
                pregunta.jsonPreguntas &&
                typeof pregunta.jsonPreguntas.jsonAlternativas === 'string'
              ) {
                try {
                  pregunta.jsonPreguntas.jsonAlternativas = JSON.parse(
                    pregunta.jsonPreguntas.jsonAlternativas
                  );
                } catch (e) {
                  console.error('Error al parsear jsonAlternativas (en jsonPreguntas):', e);
                  pregunta.jsonPreguntas.jsonAlternativas = [];
                }
              }

              // Paso 3: Parsear jsonAlternativas raíz si es string
              if (typeof pregunta.jsonAlternativas === 'string') {
                try {
                  pregunta.jsonAlternativas = JSON.parse(pregunta.jsonAlternativas);
                } catch (e) {
                  console.error('Error al parsear jsonAlternativas (raíz):', e);
                  pregunta.jsonAlternativas = [];
                }
              }

              // Paso 4: Inicializar alternativas
              const alternativas =
                pregunta.jsonPreguntas?.jsonAlternativas || pregunta.jsonAlternativas || [];

              if (Array.isArray(alternativas)) {
                alternativas.forEach(alt => {
                  alt.cRptaRadio = false;
                  alt.cRptaCheck = false;
                  alt.cRptaTexto = null;
                });
              }

              // Paso 5: Parsear jEvalRptaEstudiante si es string
              let rpta = pregunta.jEvalRptaEstudiante;
              if (typeof rpta === 'string') {
                try {
                  rpta = JSON.parse(rpta);
                } catch (e) {
                  console.warn('Error al parsear jEvalRptaEstudiante:', e, rpta);
                  rpta = {};
                }
              }

              // Paso 6: Establecer campos en pregunta principal
              if (Number(pregunta.iTipoPregId) === 1 && rpta?.rptaUnica) {
                pregunta.cRptaRadio = rpta.rptaUnica;
              }

              if (Number(pregunta.iTipoPregId) === 2 && Array.isArray(rpta?.rptaMultiple)) {
                pregunta.cRptaCheck = rpta.rptaMultiple;

                const alternativas =
                  pregunta.jsonPreguntas?.jsonAlternativas || pregunta.jsonAlternativas || [];

                alternativas.forEach(alt => {
                  alt.cRptaCheck = rpta.rptaMultiple.includes(alt.cBancoAltLetra);
                });
              }

              if (Number(pregunta.iTipoPregId) === 3 && rpta?.rptaAbierta) {
                pregunta.cRptaTexto = rpta.rptaAbierta;
              }

              // PASO 7: Si jsonPreguntas es un array (caso de encabezado), iterar e inicializar campos
              if (Array.isArray(pregunta.jsonPreguntas)) {
                pregunta.jsonPreguntas.forEach(jsonPregunta => {
                  // A. Parsear jsonAlternativas si es string
                  if (typeof jsonPregunta.jsonAlternativas === 'string') {
                    try {
                      jsonPregunta.jsonAlternativas = JSON.parse(jsonPregunta.jsonAlternativas);
                    } catch (e) {
                      console.error('Error en alternativas hijas:', e);
                      jsonPregunta.jsonAlternativas = [];
                    }
                  }

                  // B. Inicializar alternativas hijas
                  jsonPregunta.jsonAlternativas?.forEach(alt => {
                    alt.cRptaCheck = false;
                    alt.cRptaRadio = false;
                    alt.cRptaTexto = null;
                  });

                  // C. Parsear jEvalRptaEstudiante hija
                  let rptaHija = jsonPregunta.jEvalRptaEstudiante;
                  if (typeof rptaHija === 'string') {
                    try {
                      rptaHija = JSON.parse(rptaHija);
                    } catch (e) {
                      console.warn('Error al parsear respuesta hija:', e, rptaHija);
                      rptaHija = {};
                    }
                  }

                  // D. Respuesta única hija
                  if (Number(jsonPregunta.iTipoPregId) === 1 && rptaHija?.rptaUnica) {
                    jsonPregunta.cRptaRadio = rptaHija.rptaUnica;
                  }

                  // E. Respuesta múltiple hija
                  if (
                    Number(jsonPregunta.iTipoPregId) === 2 &&
                    Array.isArray(rptaHija?.rptaMultiple)
                  ) {
                    jsonPregunta.cRptaCheck = rptaHija.rptaMultiple;

                    jsonPregunta.jsonAlternativas?.forEach(alt => {
                      alt.cRptaCheck = rptaHija.rptaMultiple.includes(alt.cBancoAltLetra);
                    });
                  }

                  // F. Respuesta libre hija
                  if (Number(jsonPregunta.iTipoPregId) === 3 && rptaHija?.rptaAbierta) {
                    jsonPregunta.cRptaTexto = rptaHija.rptaAbierta;
                  }

                  // G. Marcar
                  jsonPregunta.iMarcado =
                    !!jsonPregunta.cRptaRadio ||
                    (Array.isArray(jsonPregunta.cRptaCheck) &&
                      jsonPregunta.cRptaCheck.length > 0) ||
                    !!jsonPregunta.cRptaTexto;
                });
              }
              //Marcar
              pregunta.iMarcado =
                !!pregunta.cRptaRadio ||
                (Array.isArray(pregunta.cRptaCheck) && pregunta.cRptaCheck.length > 0) ||
                !!pregunta.cRptaTexto ||
                (Array.isArray(pregunta.jsonPreguntas) &&
                  pregunta.jsonPreguntas.some(jp => jp.iMarcado));
            });
          }
        },
        error: error => {
          this.mostrarErrores(error);
          this.mensajeError =
            error?.error?.message || 'Ocurrió algo inesperado, vuelva recargar en un momento';
        },
      });
  }
  //Enviando Respuesta unica,multiple,libre
  enviarRpta(tipoRpta, pregunta, item) {
    switch (tipoRpta) {
      case 'unica':
        const dataUnica = {
          iEstudianteId: this._ConstantesService.iEstudianteId,
          iEvalPregId: item.iEvalPregId,
          iEvaluacionId: this.iEvaluacionId,
          jEvalRptaEstudiante: '{"rptaUnica":"' + item.cRptaRadio + '"}',
          cEvalRptaPizarraUrl: item.cEvalRptaPizarraUrl,
          iCredId: this._ConstantesService.iCredId,
        };
        this.guardarEvaluacionRespuestasxiEvaluacionIdxiEstudianteId(dataUnica, item);
        break;
      case 'multiple':
        const respuestasArray = item.cRptaCheck || [];
        const respuestas = respuestasArray.map(r => `"${r}"`).join(',');

        const dataMultiple = {
          iEstudianteId: this._ConstantesService.iEstudianteId,
          iEvalPregId: item.iEvalPregId,
          iEvaluacionId: this.iEvaluacionId,
          jEvalRptaEstudiante: `{"rptaMultiple":[${respuestas}]}`,
          cEvalRptaPizarraUrl: item.cEvalRptaPizarraUrl,
          iCredId: this._ConstantesService.iCredId,
        };
        this.guardarEvaluacionRespuestasxiEvaluacionIdxiEstudianteId(dataMultiple, item);
        break;
      case 'libre':
        if (item.cRptaTexto != '') {
          const dataLibre = {
            iEstudianteId: this._ConstantesService.iEstudianteId,
            iEvalPregId: item.iEvalPregId,
            iEvaluacionId: this.iEvaluacionId,
            jEvalRptaEstudiante: '{"rptaAbierta":"' + item.cRptaTexto + '"}',
            cEvalRptaPizarraUrl: item.cEvalRptaPizarraUrl,
            iCredId: this._ConstantesService.iCredId,
          };
          this.guardarEvaluacionRespuestasxiEvaluacionIdxiEstudianteId(dataLibre, item);
        } else {
          this.mostrarMensajeToast({
            severity: 'warn',
            summary: '¡Atención!',
            detail: 'Su respuesta no debe estar vacío',
          });
        }
        break;
    }
  }
  /**
   * Método para obtener información y manejar respuestas en función de una acción específica.
   * @param {any} params - Parámetros necesarios para realizar la solicitud al servicio.
   * @param {string} accion - Nombre de la acción asociada a esta solicitud, utilizado para identificarla en el flujo.
   */

  finalizado: any;
  classTime = 'text-blue-500 font-bold';
  timeEvent($event) {
    if (!this.evaluacion) {
      return;
    }
    const { accion } = $event;
    switch (accion) {
      case 'tiempo-finalizado':
        this.classTime = 'text-green-500 font-bold';
        this.finalizado = true;
        this.mostrarMensajeToast({
          severity: 'error',
          summary: 'Evaluación finalizada',
          detail: 'El tiempo se ha agotado, el examen ha finalizado.',
        });

        setTimeout(() => {
          this.obtenerEvaluacionPreguntasxiEvaluacionIdxiEstudianteId(
            this.evaluacion?.iEvaluacionId
          );
        }, 2000);

        break;
      case 'tiempo-1-minuto-restante':
        this.classTime = 'text-red-500 font-bold';
        this.mostrarMensajeToast({
          severity: 'warn',
          detail: 'Queda 1 minuto para finalizar la evaluación',
        });
        break;
    }
  }

  guardarDibujo(data: { svg; id }) {
    const svg = data.svg;
    const id = data.id;

    if (!svg || !id) return;
    const blob = new Blob([svg], { type: 'image/svg+xml' });

    const file = new File([blob], 'pizarra.svg', { type: 'image/svg+xml' });
    const formData = new FormData();
    formData.append('file', file);
    formData.append('nameFile', 'pizarras');

    this._GeneralService.subirSvgPizarra(formData).subscribe({
      next: (resp: any) => {
        this.enviarPizarraUrl(id, resp.data);
      },
      error: error => {
        console.error('Error subiendo SVG:', error);
      },
    });
  }
  enviarPizarraUrl(id: number, imgUrl: string) {
    if (!id || !imgUrl) return;

    let pregunta: any = null;
    pregunta = this.preguntas.find((i: any) => i.iEvalPregId === id);
    if (!pregunta) {
      for (const encabezado of this.preguntas) {
        if (encabezado.jsonPreguntas) {
          const hijos = Array.isArray(encabezado.jsonPreguntas)
            ? encabezado.jsonPreguntas
            : JSON.parse(encabezado.jsonPreguntas);

          const encontrada = hijos.find((h: any) => h.iEvalPregId === id);
          if (encontrada) {
            pregunta = encontrada;
            break;
          }
        }
      }
    }

    // 3. Si aún no se encontró, salir
    if (!pregunta) return;

    // 4. Armar data y guardar
    const dataEncabezado = {
      iEstudianteId: this._ConstantesService.iEstudianteId,
      iEvalPregId: pregunta.iEvalPregId,
      jEvalRptaEstudiante: pregunta.jEvalRptaEstudiante,
      iEvaluacionId: this.iEvaluacionId,
      cEvalRptaPizarraUrl: imgUrl,
      iCredId: this._ConstantesService.iCredId,
    };

    this.guardarEvaluacionRespuestasxiEvaluacionIdxiEstudianteId(dataEncabezado, pregunta);
  }

  guardarEvaluacionRespuestasxiEvaluacionIdxiEstudianteId(data, pregunta) {
    this._EvaluacionRespuestasService
      .guardarEvaluacionRespuestasxiEvaluacionIdxiEstudianteId(data)
      .subscribe({
        next: resp => {
          if (data.cEvalRptaPizarraUrl) {
            pregunta.cEvalRptaPizarraUrl = data.cEvalRptaPizarraUrl;
          }
          if (resp.validated) {
            if (pregunta && !data.cEvalRptaPizarraUrl) {
              pregunta.iMarcado = true;
            }
            this.mostrarMensajeToast({
              severity: 'success',
              summary: '¡Genial!',
              detail: resp.message,
            });
          }
        },
        error: error => {
          this.obtenerEvaluacionPreguntasxiEvaluacionIdxiEstudianteId(
            this.evaluacion?.iEvaluacionId
          );
          this.mostrarErrores(error);
        },
      });
  }
}
