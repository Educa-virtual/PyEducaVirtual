import { Component, inject, Input, OnChanges } from '@angular/core';
import { ToolbarPrimengComponent } from '../../../../../../shared/toolbar-primeng/toolbar-primeng.component';
import { CommonModule } from '@angular/common';
import { TimeComponent } from '@/app/shared/time/time.component';
import { PrimengModule } from '@/app/primeng.module';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { GeneralService } from '@/app/servicios/general.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { environment } from '@/environments/environment';
import { AccordionModule } from 'primeng/accordion';
import { RubricasModule } from '../../../../features/rubricas/rubricas.module';
import { EvaluacionPreguntasService } from '@/app/servicios/eval/evaluacion-preguntas.service';

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
  ],
  templateUrl: './evaluacion-estudiantes.component.html',
  styleUrl: './evaluacion-estudiantes.component.scss',
})
export class EvaluacionEstudiantesComponent implements OnChanges {
  private _ConstantesService = inject(ConstantesService);
  private _GeneralService = inject(GeneralService);
  private _MessageService = inject(MessageService);
  private _ConfirmationModalService = inject(ConfirmationModalService);
  private _ConfirmationService = inject(ConfirmationService);
  private _EvaluacionPreguntasService = inject(EvaluacionPreguntasService);

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
  ngOnChanges(changes) {
    if (changes.evaluacion?.currentValue) {
      this.evaluacion = changes.evaluacion.currentValue;
      if (this.evaluacion?.iEvaluacionId) {
        this.iEvaluacionId = this.evaluacion?.iEvaluacionId;
        this.obtenerEvaluacionPreguntasxiEvaluacionIdxiEstudianteId(this.evaluacion?.iEvaluacionId);
      }
      this.bloquearRespuestas = Number(this.evaluacion?.iEstado) === 10;
    }
  }

  obtenerEvaluacionPreguntasxiEvaluacionIdxiEstudianteId(iEvaluacionId) {
    if (!iEvaluacionId) return;
    const iEstudianteId = this._ConstantesService.iEstudianteId;
    const params = {
      iCredId: this._ConstantesService.iCredId,
    };
    this._EvaluacionPreguntasService
      .obtenerEvaluacionPreguntasxiEvaluacionIdxiEstudianteId(iEvaluacionId, iEstudianteId, params)
      .subscribe({
        next: resp => {
          if (resp.validated) {
            this.preguntas = resp.data;
            this.preguntas.forEach(pregunta => {
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

              if (Number(pregunta.iTipoPregId) === 3 && rpta?.rptaLibre) {
                pregunta.cRptaTexto = rpta.rptaLibre;
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
                  if (Number(jsonPregunta.iTipoPregId) === 3 && rptaHija?.rptaLibre) {
                    jsonPregunta.cRptaTexto = rptaHija.rptaLibre;
                  }
                });
              }
            });

            console.log(this.preguntas);
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
  iniciarEvaluacion() {
    this.iPreguntaId++;
    this.itemPreguntas = this.preguntas.find(item => item.id === this.iPreguntaId);
    this.itemPreguntas = this.itemPreguntas?.['preguntas'] || [];
    this.esUltimaPregunta = this.iPreguntaId === this.preguntas.length;
    this.filtrarPreguntasxiTipoPregId();

    this.iniciarTemporizador();
  }

  regresarPregunta(): void {
    if (this.iPreguntaId > 1) {
      this.iPreguntaId--;
      const preguntaActual = this.preguntas.find(item => item.id === this.iPreguntaId);
      this.itemPreguntas = preguntaActual?.['preguntas'] || [];
      this.esUltimaPregunta = false; // Desactiva el estado de "última pregunta".
      this.filtrarPreguntasxiTipoPregId();
    } else {
      alert('Ya estás en la primera pregunta.');
    }
  }

  finalizarEvaluacion() {
    // Aquí va la lógica para finalizar la evaluación
    const fechaActual = new Date(); // Obtiene la fecha y hora actual.
    console.log(`Fecha y hora de envío: ${fechaActual.toLocaleString()}`); // Imprime fecha y hora en formato legible.
    console.log('Evaluación finalizada con ID de pregunta: ', this.iPreguntaId);
    alert('Evaluación finalizada. ¡Gracias por participar!');

    // Cerrar el modal
    // this._ConfirmationService.confirm({
    //     header: 'Evaluación finalizada!',
    //     message: '¡Felicitaciones, en hora buena! ahora a esperar tus resultados',
    //     icon:'pi pi-check',
    //     acceptIcon: 'pi pi-check mr-2',
    //     rejectIcon: 'pi pi-times mr-2',
    //     rejectButtonStyleClass: 'p-button-sm',
    //     acceptButtonStyleClass: 'p-button-outlined p-button-sm',

    // });
  }
  siguienteEvaluacion(): void {
    // Verificar si no estamos en la última pregunta
    if (this.evaluacion?.preguntas && this.iPreguntaId < this.evaluacion.preguntas.length) {
      this.iPreguntaId++; // Avanzar a la siguiente pregunta
      this.itemPreguntas = this.evaluacion.preguntas[this.iPreguntaId - 1]; // Actualizar la pregunta actual
      this.filtrarPreguntasxiTipoPregId();
    } else {
      console.warn('No hay más preguntas disponibles.');
    }
  }
  // esta seccion Filtrapreguntas por Pregunta ID
  filtrarPreguntasxiTipoPregId() {
    switch (Number(this.itemPreguntas['iTipoPregId'])) {
      case 1:
        this.itemPreguntas['cRptaRadio'] = null;
        break;
      case 2:
        this.itemPreguntas['alternativas'].forEach(i => {
          i.cRptaCheck = null;
        });
        console.log(this.itemPreguntas['alternativas']);
        break;
      case 3:
        this.itemPreguntas['cRptaTexto'] = null;
        break;
    }
    console.log(this.itemPreguntas);
  }
  //Enviando Respuesta unica,multiple,libre
  enviarRpta(tipoRpta, pregunta, item) {
    let params;
    switch (tipoRpta) {
      case 'unica':
        params = {
          petition: 'post',
          group: 'evaluaciones',
          prefix: 'evaluacion/estudiantes',
          ruta: 'guardarRespuestaxiEstudianteId',
          data: {
            iEstudianteId: this._ConstantesService.iEstudianteId,
            iEvalPregId: item.iEvalPregId,
            iEvaluacionId: this.iEvaluacionId,
            jEvalRptaEstudiante: '{"rptaUnica":"' + item.cRptaRadio + '"}',
          },
          params: { skipSuccessMessage: true },
        };
        this.getInformation(params, '');
        break;
      case 'multiple':
        const respuestasArray = item.cRptaCheck || [];
        const respuestas = respuestasArray.map(r => `"${r}"`).join(',');

        params = {
          petition: 'post',
          group: 'evaluaciones',
          prefix: 'evaluacion/estudiantes',
          ruta: 'guardarRespuestaxiEstudianteId',
          data: {
            iEstudianteId: this._ConstantesService.iEstudianteId,
            iEvalPregId: item.iEvalPregId,
            iEvaluacionId: this.iEvaluacionId,
            jEvalRptaEstudiante: `{"rptaMultiple":[${respuestas}]}`,
          },
          params: { skipSuccessMessage: true },
        };
        this.getInformation(params, '');
        //fin
        break;
      case 'libre':
        if (pregunta.cRptaTexto != '') {
          params = {
            petition: 'post',
            group: 'evaluaciones',
            prefix: 'evaluacion/estudiantes',
            ruta: 'guardarRespuestaxiEstudianteId',
            data: {
              iEstudianteId: this._ConstantesService.iEstudianteId,
              iEvalPregId: pregunta.iEvalPregId,
              iEvaluacionId: pregunta.iEvaluacionId,
              jEvalRptaEstudiante: '{"rptaAbierta":"' + pregunta.cRptaTexto + '"}',
            },
            params: { skipSuccessMessage: true },
          };
          this.getInformation(params, '');
        }
        break;
      case 'encabezado':
        if (pregunta.cRptaTexto != '') {
          params = {
            petition: 'post',
            group: 'evaluaciones',
            prefix: 'evaluacion/estudiantes',
            ruta: 'guardarRespuestaxiEstudianteId',
            data: {
              iEstudianteId: this._ConstantesService.iEstudianteId,
              iEvalPregId: pregunta.iEvalPregId,
              iEvaluacionId: pregunta.iEvaluacionId,
              jEvalRptaEstudiante: '{"rptacabecera":"' + pregunta.cRptaTexto + '"}',
            },
            params: { skipSuccessMessage: true },
          };
          this.getInformation(params, '');
        }
        break;
    }
  }
  /**
   * Método para obtener información y manejar respuestas en función de una acción específica.
   * @param {any} params - Parámetros necesarios para realizar la solicitud al servicio.
   * @param {string} accion - Nombre de la acción asociada a esta solicitud, utilizado para identificarla en el flujo.
   */
  getInformation(params, accion) {
    this._GeneralService.getGralPrefix(params).subscribe({
      next: response => {
        console.log(accion);
        if (response.validated) {
          this._MessageService.add({
            severity: 'success',
            summary: '¡Guardado!',
            detail: 'Se guardó correctamente la respuesta',
            life: 3000, // Duración en milisegundos
          });
        }
      },
      error: error => {
        console.log(error);
        this._MessageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.mensaje,
          sticky: true, // Aplicar también si es necesario para errores
        });
      },
      complete: () => {},
    });
  }

  subscription;
  tiempoRestante;
  tiempoEnMilisegundos;

  iniciarTemporizador(): void {
    if (!this.evaluacion?.dtEvaluacionInicio || !this.evaluacion?.dtEvaluacionFin) {
      //console.error("Fechas no válidas en `evaluacion`.");
      //return;
    }

    // Configuración inicial
    const inicio = new Date(this.evaluacion.dtEvaluacionInicio).getTime(); // Tiempo de inicio en ms
    const fin = new Date(this.evaluacion.dtEvaluacionFin).getTime(); // Tiempo de fin en ms
    this.tiempoEnMilisegundos = fin - inicio; // Diferencia en ms

    if (this.tiempoEnMilisegundos <= 0) {
      //console.log("El tiempo ya terminó.");
      //return;
    }

    // Actualizar el temporizador cada segundo
    setInterval(() => {
      const ahora = new Date().getTime(); // Tiempo actual en ms
      const tiempoRestante = fin - ahora; // Tiempo restante en ms

      if (tiempoRestante <= 0) {
        console.log('¡Tiempo finalizado!');
        this.tiempoEnMilisegundos = 0;
        return;
      }

      this.tiempoEnMilisegundos = new Date(tiempoRestante).toISOString().substr(11, 8);
    }, 1000);
  }
  // { // Calcula el número de minutos restantes dividiendo el tiempo restante por 60 y redondeando hacia abajo
  getFormattedTime(): string {
    const minutes = Math.floor(this.timeRemaining / 60);
    const seconds = this.timeRemaining % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  //  mostrado la rubrica en vista estudiante
  dialogRubricaInfo = {
    visible: false,
    header: undefined,
  };

  showRubrica(data) {
    this.dialogRubricaInfo.visible = true;
    this.dialogRubricaInfo.header = data;
  }
  // Ejemplo de datos

  convertirATiempo(tiempoEnMinutos: number): string {
    const horas = Math.floor(tiempoEnMinutos / 60);
    const minutos = tiempoEnMinutos % 60;
    return `${horas} horas ${minutos} minutos`;
  }

  finalizado: any;
  classTime = 'text-blue-500 font-bold';
  timeEvent($event) {
    if (this.evaluacion == null || $event) {
      return;
    }
    const { accion } = $event;
    switch (accion) {
      case 'tiempo-finalizado':
        this.classTime = 'text-green-500 font-bold';
        this.finalizado = true;
        break;
      case 'tiempo-1-minuto-restante':
        this.classTime = 'text-red-500 font-bold';
        this._MessageService.add({
          severity: 'warn',
          detail: 'Queda 1 minuto para finalizar la evaluación',
        });
        break;
    }
  }

  mostrarMensajeToast(message) {
    this._MessageService.add(message);
  }
}
