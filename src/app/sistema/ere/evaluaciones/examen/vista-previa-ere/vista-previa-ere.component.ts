import { PrimengModule } from '@/app/primeng.module';
import { GeneralService } from '@/app/servicios/general.service';
import { Component, inject, Input, OnInit } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ProgressBarModule } from 'primeng/progressbar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RemoveHTMLCSSPipe } from '@/app/shared/pipes/remove-html-style.pipe';
import { TruncatePipe } from '@/app/shared/pipes/truncate-text.pipe';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { environment } from '@/environments/environment';
import { ModalEvaluacionFinalizadaComponent } from '../modal-evaluacion-finalizada/modal-evaluacion-finalizada.component';
import { ImagePreviewComponent } from '@/app/shared/image-preview/image-preview.component';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { TimeComponent } from '@/app/shared/time/time.component';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';

@Component({
  selector: 'app-vista-previa-ere',
  standalone: true,
  templateUrl: './vista-previa-ere.component.html',
  styleUrl: './vista-previa-ere.component.scss',
  imports: [
    PrimengModule,
    ProgressBarModule,
    RadioButtonModule,
    TruncatePipe,
    RemoveHTMLCSSPipe,
    NgxDocViewerModule,
    ModalEvaluacionFinalizadaComponent,
    ImagePreviewComponent,
    TimeComponent,
  ],
})
export class VistaPreviaEreComponent implements OnInit {
  @Input() iEvaluacionId: string;
  @Input() iCursoNivelGradId: string;
  /*@Input() cEvaluacionNombre: string
    @Input() cCursoNombre: string
    @Input() cGradoNombre: string*/
  evaluacion: any;
  //tiempoActual = new Date()
  //tiempoFin = new Date()
  previewImage: string | null = null;
  showModalPreview: boolean = false;

  private _GeneralService = inject(GeneralService);
  private _MessageService = inject(MessageService);
  private _DomSanitizer = inject(DomSanitizer);
  private _ConstantesService = inject(ConstantesService);
  private _ConfirmationModalService = inject(ConfirmationModalService);

  totalPregunta: number = 0;

  preguntas = [];

  activeIndex: number = 0;
  seleccion: string | null = null;
  backend = environment.backend;

  breadCrumbItems: MenuItem[];
  breadCrumbHome: MenuItem;

  constructor(
    private store: LocalStoreService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    //this.evaluacion = this.store.getItem('evaluacion')
    this.obtenerEvaluacion();
    this.obtenerPreguntas();
  }

  regresar() {
    window.history.back();
  }

  obtenerEvaluacion() {
    const params = {
      petition: 'post',
      group: 'ere',
      prefix: 'evaluacion',
      ruta: 'obtenerEvaluacionxiEvaluacionIdxiCursoNivelGradIdxiIieeId',
      data: {
        opcion: 'CONSULTARxiEvaluacionIdxiCursoNivelGradIdxiIieeId',
        iEvaluacionId: this.iEvaluacionId,
        iCursoNivelGradId: this.iCursoNivelGradId,
        iIieeId: this._ConstantesService.iIieeId,
      },
    };
    this.getInformation(params, params.data.opcion);
  }

  seleccionarOpcion(opcion: string) {
    this.seleccion = opcion;
  }

  anteriorPregunta(index: number) {
    if (index <= this.preguntas.length - 1) {
      this.activeIndex = index - 1;
    }
  }
  siguientePregunta(index: number) {
    if (index <= this.preguntas.length - 1) {
      this.activeIndex = index + 1;
    }
  }

  /*tiempoRestante: number = 60
    getTiempoFormateado(): string {
        const minutos = Math.floor(this.tiempoRestante / 60)
        const segundos = this.tiempoRestante % 60
        return `${minutos}:${segundos < 10 ? '0' + segundos : segundos}`
    }*/

  obtenerPreguntas() {
    const params = {
      petition: 'post',
      group: 'ere',
      prefix: 'evaluacion',
      ruta: 'ConsultarPreguntasxiEvaluacionIdxiCursoNivelGradIdxiEstudianteId',
      data: {
        opcion: 'ConsultarPreguntasxiEvaluacionIdxiCursoNivelGradIdxiEstudianteId',
        iEvaluacionId: this.iEvaluacionId,
        iCursoNivelGradId: this.iCursoNivelGradId,
        iEstudianteId: this._ConstantesService.iEstudianteId,
        iIieeId: this._ConstantesService.iIieeId,
        iYAcadId: this._ConstantesService.iYAcadId,
      },
    };
    this.getInformation(params, params.data.opcion);
  }

  /*marcarPaginadorPregunta() {
        const cantidadPreguntas =
            this.preguntas[this.activeIndex].pregunta.length
        let cantidadPreguntasMarcadas = 0
        this.preguntas[this.activeIndex].pregunta.forEach((item) => {
            item.alternativas.forEach((alter) => {
                if (alter.iMarcado == 1) {
                    cantidadPreguntasMarcadas++
                }
            })
        })

        if (cantidadPreguntas == cantidadPreguntasMarcadas) {
            this.preguntas[this.activeIndex].iMarcado = 1
        } else {
            this.preguntas[this.activeIndex].iMarcado = 0
        }
    }*/

  /*calcularPreguntasPendientes() {
        let cantidadPreguntasPendientes = 0
        this.preguntas.forEach((pregunta) => {

            pregunta.pregunta.forEach((item) => {
                let pendienteResponder = true
                item.alternativas.forEach((alter) => {
                    if (alter.iMarcado == 1) {
                        pendienteResponder = false
                    }
                })
                if (pendienteResponder) {
                    cantidadPreguntasPendientes++
                }
            })
        })
        return cantidadPreguntasPendientes
    }*/

  /*guardarPregunta(alternativas, alternativa, marcado) {
        alternativas.forEach((i) => {
            if (i.iAlternativaId !== alternativa.iAlternativaId) {
                i.iMarcado = false
            }
        })
        alternativa.iMarcado = marcado

        this.marcarPaginadorPregunta()
        const params = {
            petition: 'post',
            group: 'ere',
            prefix: 'resultados',
            ruta: 'guardarResultadosxiEstudianteIdxiResultadoRptaEstudiante',
            data: {
                opcion: 'guardarResultadosxiEstudianteIdxiResultadoRptaEstudiante',
                iResultadoId: alternativa.iResultadoId,
                iEstudianteId: this._ConstantesService.iEstudianteId,
                iResultadoRptaEstudiante: alternativa.iAlternativaId,
                iIieeId: this._ConstantesService.iIieeId,
                iEvaluacionId: this.iEvaluacionId,
                iYAcadId: this._ConstantesService.iYAcadId,
                iPreguntaId: alternativa.iPreguntaId,
                iCursoNivelGradId: this.iCursoNivelGradId,
                iMarcado: alternativa.iMarcado,
            },
            alternativa: alternativa,
        }
        this.getInformation(params, params.data.opcion)
    }*/

  /*preguntarTerminarExamen() {
        const cantidadPreguntasPendientes = this.calcularPreguntasPendientes()
        let mensaje = ''
        switch (cantidadPreguntasPendientes) {
            case 0:
                mensaje = 'El examen se dará por terminado. ¿Desea continuar?'
                break
            case 1:
                mensaje =
                    'Hay 1 pregunta pendiente de responder. ¿Desea continuar?'
                break
            default:
                mensaje =
                    'Hay ' +
                    cantidadPreguntasPendientes +
                    ' preguntas pendientes de responder. ¿Desea continuar?'
                break
        }
        this._ConfirmationModalService.openConfirm({
            header: mensaje,
            accept: () => {
                this.terminarExamen()
            },
        })
    }*/

  /*terminarExamen() {
        const params = {
            petition: 'post',
            group: 'ere',
            prefix: 'resultados',
            ruta: 'terminarExamenxiEstudianteId',
            data: {
                opcion: 'terminarExamenxiEstudianteId',
                iEstudianteId: this._ConstantesService.iEstudianteId,
                iIieeId: this._ConstantesService.iIieeId,
                iEvaluacionId: this.iEvaluacionId,
                iYAcadId: this._ConstantesService.iYAcadId,
                iCursoNivelGradId: this.iCursoNivelGradId,
            },
        }
        this.getInformation(params, params.data.opcion)
    }*/

  getInformation(params, accion) {
    if (!params) {
      console.error('Params is null or undefined when calling getInformation');
      this._MessageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Parámetros requeridos no encontrados',
      });
      return;
    }

    this._GeneralService.getGralPrefix(params).subscribe({
      next: response => {
        this.accionBtnItem({
          accion,
          item: response?.data,
          message: response.message,
        });
      },
      complete: () => {},
      error: error => {
        this._MessageService.add({
          severity: 'error',
          summary: 'Problema encontrado',
          detail: error.error.message,
        });
        if (params.data.opcion == 'guardarResultadosxiEstudianteIdxiResultadoRptaEstudiante') {
          //Si hubo un error al guardar la respuesta, revertimos el marcado
          params.alternativa.iMarcado = !params.alternativa.iMarcado;
        }
      },
    });
  }

  /*timeEvent($event) {
        if (this.evaluacion == null) {
            return
        }
        const { accion } = $event
        switch (accion) {
            case 'tiempo-finalizado':
                this.finalizado = true
                break
            case 'tiempo-1-minuto-restante':
                this._MessageService.add({
                    severity: 'warn',
                    detail: 'Queda 1 minuto para finalizar la evaluación',
                })
                break
        }
    }*/

  finalizado: boolean = false;
  accionBtnItem(elemento): void {
    if (!elemento) {
      console.error('Elemento is null or undefined');
      return;
    }

    const { accion } = elemento;
    const { item } = elemento;
    const { message } = elemento;

    if (!accion) {
      console.error('Accion is required');
      return;
    }

    switch (accion) {
      case 'CONSULTARxiEvaluacionIdxiCursoNivelGradIdxiIieeId':
        if (item && Array.isArray(item)) {
          this.evaluacion = item.length ? item[0] : null;

          if (this.evaluacion) {
            /*this.tiempoActual = new Date(
                            this.evaluacion.dtHoraActual
                        )
                        this.tiempoFin = new Date(
                            this.evaluacion.dtExamenFechaFin
                        )*/
            this.breadCrumbItems = [
              {
                label: 'Evaluación ERE',
                routerLink: '/ere/evaluacion/areas',
              },
              {
                label: this.evaluacion.cEvaluacionNombre || 'Sin nombre',
              },
              {
                label:
                  (this.evaluacion.cGradoAbreviacion || '') +
                  ' ' +
                  (this.evaluacion.cCursoNombre || '') +
                  ' ' +
                  (this.evaluacion.cNivelTipoNombre || ''),
              },
              {
                label: 'Rendir',
                routerLink: `/ere/evaluaciones/${this.iEvaluacionId}/areas/${this.iCursoNivelGradId}/rendir`,
              },
              { label: 'Iniciar evaluación' },
            ];
            this.breadCrumbHome = {
              icon: 'pi pi-home',
              routerLink: '/',
            };
          }
        } /* else {
                    console.warn(
                        'Item is not a valid array for CONSULTARxiEvaluacionIdxiCursoNivelGradIdxiIieeId'
                    )
                }*/
        break;

      case 'ConsultarPreguntasxiEvaluacionIdxiCursoNivelGradIdxiEstudianteId':
        this.finalizado = false;

        if (!item || !Array.isArray(item)) {
          console.warn(
            'Item is not a valid array for ConsultarPreguntasxiEvaluacionIdxiCursoNivelGradIdxiEstudianteId'
          );
          return;
        }

        if (item.length && item[item.length - 1] && item[item.length - 1]['iFinalizado'] === '0') {
          this.finalizado = true;
          return;
        }

        const evaluaciones = item;

        if (!this.preguntas) {
          this.preguntas = [];
        } else {
          this.preguntas = [];
        }

        for (const key in evaluaciones) {
          if (evaluaciones[key]) {
            const itemSinEncabezado = evaluaciones.filter(
              i => i && !i.iEncabPregId && i.iPreguntaId === evaluaciones[key]['iPreguntaId']
            );

            if (itemSinEncabezado && itemSinEncabezado.length) {
              this.preguntas.push({
                pregunta: itemSinEncabezado,
                iEncabPregId: null,
              });
            }

            const itemConEncabezado = evaluaciones.filter(
              i => i && i.iEncabPregId && i.iEncabPregId === evaluaciones[key]['iEncabPregId']
            );

            if (itemConEncabezado && itemConEncabezado.length) {
              this.preguntas.push({
                pregunta: itemConEncabezado,
                title: 'Pregunta múltiple',
                iEncabPregId: evaluaciones[key]['iEncabPregId'],
              });
            }
          }
        }

        if (this.preguntas && Array.isArray(this.preguntas)) {
          this.preguntas = this.preguntas.filter((value, index, self) => {
            if (!value) return false;
            return (
              value.iEncabPregId === null ||
              index === self.findIndex(t => t && t.iEncabPregId === value.iEncabPregId)
            );
          });
        }

        this.totalPregunta = 0;

        if (this.preguntas && Array.isArray(this.preguntas)) {
          this.preguntas.forEach(pregunta => {
            if (pregunta && pregunta.pregunta && Array.isArray(pregunta.pregunta)) {
              if (pregunta.pregunta.length) {
                let iMarcado = 0;
                pregunta.pregunta.forEach(item => {
                  if (item) {
                    this.totalPregunta = this.totalPregunta + 1;
                    item.title = 'Pregunta #' + this.totalPregunta;

                    if (item.alternativas) {
                      try {
                        item.alternativas =
                          typeof item.alternativas === 'string'
                            ? JSON.parse(item.alternativas)
                            : item.alternativas;
                      } catch (e) {
                        console.error('Error parsing alternativas:', e);
                        item.alternativas = [];
                      }
                    } else {
                      item.alternativas = [];
                    }

                    if (this._DomSanitizer) {
                      item.cPregunta = item.cPregunta
                        ? this._DomSanitizer.bypassSecurityTrustHtml(item.cPregunta)
                        : '';
                      item.cEncabPregContenido = item.cEncabPregContenido
                        ? this._DomSanitizer.bypassSecurityTrustHtml(item.cEncabPregContenido)
                        : '';
                    }

                    if (item.alternativas && Array.isArray(item.alternativas)) {
                      const alternativaMarcada = item.alternativas.find(
                        alternativa => alternativa && Number(alternativa.iMarcado) === 1
                      );
                      iMarcado = alternativaMarcada ? 1 : 0;
                    }
                  }
                });
                pregunta.iMarcado = iMarcado;
              }

              if (pregunta.pregunta.length > 1) {
                const primeraPregunta = pregunta.pregunta[0];
                if (primeraPregunta) {
                  pregunta['iEncabPregId'] = primeraPregunta['iEncabPregId'];
                  pregunta['cEncabPregContenido'] = primeraPregunta['cEncabPregContenido'];
                  pregunta['cPregunta'] = primeraPregunta['cPregunta'];
                }
              } else if (
                pregunta.pregunta.length === 1 &&
                pregunta.pregunta[0] &&
                pregunta.pregunta[0].iEncabPregId != null
              ) {
                pregunta['iEncabPregId'] = pregunta.pregunta[0]['iEncabPregId'];
                pregunta['cEncabPregContenido'] = pregunta.pregunta[0]['cEncabPregContenido'];
                pregunta['cPregunta'] = pregunta.pregunta[0]['cPregunta'];
              } else if (pregunta.pregunta[0]) {
                pregunta.title = pregunta.pregunta[0]?.title || '';
              }
            }
          });
        }
        break;

      case 'guardarResultadosxiEstudianteIdxiResultadoRptaEstudiante':
        if (this._MessageService && message) {
          this._MessageService.add({
            severity: 'success',
            detail: message,
          });
        }
        break;

      case 'terminarExamenxiEstudianteId':
        this.finalizado = false;
        if (
          item &&
          Array.isArray(item) &&
          item.length &&
          item[item.length - 1] &&
          item[item.length - 1]['iFinalizado'] === '0'
        ) {
          this.finalizado = true;
        }
        break;

      case 'close-modal':
        this.showModalPreview = false;
        break;

      default:
        console.warn(`Acción no reconocida: ${accion}`);
        break;
    }
  }
  updateUrl(item) {
    item.cAlternativaImagen = 'users/no-image.png';
  }

  onImageClick(event: MouseEvent) {
    const target = event.target as HTMLImageElement;

    // Verifica si el clic fue en una imagen
    if (target.tagName.toLowerCase() === 'img') {
      this.previewImage = target.src; // Asigna la URL de la imagen al preview
      this.showModalPreview = true;
    }
  }
}
