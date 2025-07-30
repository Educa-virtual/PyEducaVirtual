import { PrimengModule } from '@/app/primeng.module';
import { PreguntaAlternativasRespuestasService } from '@/app/servicios/aula/pregunta-alternativas-respuestas.service';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { NoDataComponent } from '@/app/shared/no-data/no-data.component';
import { Component, inject, Input, OnChanges } from '@angular/core';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-cuestionario-estudiante',
  standalone: true,
  imports: [PrimengModule, NoDataComponent],
  templateUrl: './cuestionario-estudiante.component.html',
  styleUrl: './cuestionario-estudiante.component.scss',
})
export class CuestionarioEstudianteComponent implements OnChanges {
  @Input() cuestionario;

  private _ConstantesService = inject(ConstantesService);
  private _PreguntaAlternativasRespuestasService = inject(PreguntaAlternativasRespuestasService);
  private _MessageService = inject(MessageService);
  private _ConfirmationModalService = inject(ConfirmationModalService);

  preguntas: any[] = [];
  respuestasTexto: { [idPregunta: string]: string } = {}; // variable para almacenar de respuesta unica
  respuestasOpcion: { [idPregunta: string]: string } = {}; // variable para almacenar de opción unica
  respuestasDropdown: { [pregId: string]: string } = {}; // variable para almacenar lo del select o Dropdon
  respuestasMultiple: { [iPregId: number]: number[] } = {}; // variable para almacenar varias opciones

  bCuestionarioFinalizado: boolean = false;

  ngOnChanges(changes) {
    if (changes.cuestionario.currentValue) {
      this.cuestionario = changes.cuestionario.currentValue;
      this.obtenerPreguntaAlternativasRespuestasxiCuestionarioIdxiEstudianteId(
        this.cuestionario?.iCuestionarioId
      );
    }
  }

  obtenerPreguntaAlternativasRespuestasxiCuestionarioIdxiEstudianteId(iCuestionarioId) {
    const iEstudianteId = this._ConstantesService.iEstudianteId;
    if (!iCuestionarioId || !iEstudianteId) return;
    const params = {
      iCredId: this._ConstantesService.iCredId,
    };
    this._PreguntaAlternativasRespuestasService
      .obtenerRespuestas(iCuestionarioId, iEstudianteId, params)
      .subscribe({
        next: resp => {
          if (resp.validated) {
            if (Number(resp.bCuestionarioActivo) !== 1) {
              this.bCuestionarioFinalizado = true;
            } else {
              this.bCuestionarioFinalizado = false;
              this.preguntas = resp.data;
              this.preguntas.forEach(pregunta => {
                // Paso 1: Parsear jsonAlternativas raíz si es string
                if (typeof pregunta.jsonAlternativas === 'string') {
                  try {
                    pregunta.jsonAlternativas = JSON.parse(pregunta.jsonAlternativas);
                  } catch (e) {
                    console.error('Error al parsear jsonAlternativas (raíz):', e);
                    pregunta.jsonAlternativas = [];
                  }
                }
                if (pregunta.cCodeTipoPreg === 'TIP-PREG-TEXTO') {
                  const respuestaSeleccionada = pregunta.jsonAlternativas.find(
                    alt => alt.iPrgAltRptaId !== null
                  );
                  if (respuestaSeleccionada) {
                    this.respuestasTexto[pregunta.iPregId] = respuestaSeleccionada.cRespuesta;
                  }
                }

                if (pregunta.cCodeTipoPreg === 'TIP-PREG-OPCIONES') {
                  const respuestaSeleccionada = pregunta.jsonAlternativas.find(
                    alt => alt.iPrgAltRptaId !== null
                  );
                  if (respuestaSeleccionada) {
                    this.respuestasOpcion[pregunta.iPregId] = respuestaSeleccionada.iPregAlterId;
                  }
                }

                if (pregunta.cCodeTipoPreg === 'TIP-PREG-CASILLA') {
                  const alternativasSeleccionadas = pregunta.jsonAlternativas
                    .filter(alt => alt.iPrgAltRptaId !== null)
                    .map(alt => alt.iPregAlterId);

                  if (alternativasSeleccionadas.length > 0) {
                    this.respuestasMultiple[pregunta.iPregId] = alternativasSeleccionadas;
                  } else {
                    this.respuestasMultiple[pregunta.iPregId] = [];
                  }
                }

                if (pregunta.cCodeTipoPreg === 'TIP-PREG-DESPLEGABLE') {
                  const respuestaSeleccionada = pregunta.jsonAlternativas.find(
                    alt => alt.iPrgAltRptaId !== null
                  );
                  if (respuestaSeleccionada) {
                    this.respuestasDropdown[pregunta.iPregId] = respuestaSeleccionada.iPregAlterId;
                  }
                }
              });
            }
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

  guardarRespuesta(item: any, opcion: string, multiple): void {
    this.bCuestionarioFinalizado = false;
    const iCuestionarioId = this.cuestionario.iCuestionarioId;
    const iEstudianteId = this._ConstantesService.iEstudianteId;
    let iPregAlterId = null;
    let params = {};
    let cRespuesta = null;
    switch (item.cCodeTipoPreg) {
      case 'TIP-PREG-TEXTO':
        iPregAlterId = item.jsonAlternativas[0]?.iPregAlterId;
        cRespuesta = this.respuestasTexto[item.iPregId];
        break;

      case 'TIP-PREG-OPCIONES':
        const idOpcion = item.jsonAlternativas.find(alt => alt.iPregAlterId === opcion);
        iPregAlterId = idOpcion.iPregAlterId;
        break;
      case 'TIP-PREG-CASILLA':
        const idMultiple = item.jsonAlternativas.find(alt => alt.iPregAlterId === multiple);
        iPregAlterId = idMultiple.iPregAlterId;
        break;
      case 'TIP-PREG-DESPLEGABLE':
        const idDropdown = item.jsonAlternativas.find(alt => alt.iPregAlterId === opcion);
        iPregAlterId = idDropdown.iPregAlterId;
        break;
    }
    params = {
      iPregAlterId: iPregAlterId,
      cRespuesta: cRespuesta,
      iCredId: this._ConstantesService.iCredId,
    };
    this._PreguntaAlternativasRespuestasService
      .guardarRespuestaEstudiante(iCuestionarioId, iEstudianteId, params)
      .subscribe({
        next: resp => {
          if (resp.validated) {
            if (!resp.estado) {
              this.mostrarMensajeToast({
                severity: 'error',
                summary: 'Atención!',
                detail: resp.message,
              });
              this.bCuestionarioFinalizado = true;
            } else {
              this.mostrarMensajeToast({
                severity: 'success',
                summary: '¡Genial!',
                detail: resp.message,
              });
            }
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

  getCantidadRespuestas(): { respondidas: number; total: number } {
    const total = this.preguntas.length;
    let respondidas = 0;

    for (const pregunta of this.preguntas) {
      const id = pregunta.iPregId;
      switch (pregunta.cCodeTipoPreg) {
        case 'TIP-PREG-TEXTO':
          if (this.respuestasTexto[id]?.trim()) {
            respondidas++;
          }
          break;

        case 'TIP-PREG-OPCIONES':
          if (this.respuestasOpcion[id]) {
            respondidas++;
          }
          break;

        case 'TIP-PREG-DESPLEGABLE':
          if (this.respuestasDropdown[id]) {
            respondidas++;
          }
          break;

        case 'TIP-PREG-CASILLA':
          if (this.respuestasMultiple[id]?.length > 0) {
            respondidas++;
          }
          break;
      }
    }

    return { respondidas, total };
  }

  finalizarCuestionario() {
    this.bCuestionarioFinalizado = false;
    this._ConfirmationModalService.openConfirm({
      header:
        'Has respondido ' +
        this.getCantidadRespuestas().respondidas +
        ' de ' +
        this.getCantidadRespuestas().total +
        ' preguntas, ¿Estás seguro de finalizar?',
      accept: () => {
        const params = {
          iCredId: this._ConstantesService.iCredId,
        };
        this._PreguntaAlternativasRespuestasService
          .finalizarPreguntaAlternativasRespuestas(
            this.cuestionario.iCuestionarioId,
            this._ConstantesService.iEstudianteId,
            params
          )
          .subscribe({
            next: resp => {
              if (resp.validated) {
                this.mostrarMensajeToast({
                  severity: 'success',
                  summary: '¡Genial!',
                  detail: resp.message,
                });
                this.bCuestionarioFinalizado = true;
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
                this.mostrarMensajeToast({
                  severity: 'error',
                  summary: 'Error',
                  detail: error?.error?.message || 'Ocurrió un error inesperado',
                });
              }
            },
          });
      },
    });
  }

  mostrarMensajeToast(message) {
    this._MessageService.add(message);
  }
}
