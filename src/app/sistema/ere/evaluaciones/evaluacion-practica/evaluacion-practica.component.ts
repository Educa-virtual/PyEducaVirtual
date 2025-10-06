import { PrimengModule } from '@/app/primeng.module';
import { GeneralService } from '@/app/servicios/general.service';
import { Component, inject, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { ProgressBarModule } from 'primeng/progressbar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RemoveHTMLCSSPipe } from '@/app/shared/pipes/remove-html-style.pipe';
import { TruncatePipe } from '@/app/shared/pipes/truncate-text.pipe';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { environment } from '@/environments/environment';
import { ModalEvaluacionFinalizadaComponent } from '../examen/modal-evaluacion-finalizada/modal-evaluacion-finalizada.component';
import { ImagePreviewComponent } from '@/app/shared/image-preview/image-preview.component';
import { TimeComponent } from '@/app/shared/time/time.component';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { EvaluacionPracticaIndicacionesComponent } from './evaluacion-practica-indicaciones/evaluacion-practica-indicaciones.component';

@Component({
  selector: 'app-evaluacion-practica',
  standalone: true,
  templateUrl: './evaluacion-practica.component.html',
  styleUrl: './evaluacion-practica.component.scss',
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
    EvaluacionPracticaIndicacionesComponent,
  ],
})
export class EvaluacionPracticaComponent implements OnInit {
  evaluacion: any;
  tiempoActual = new Date();
  tiempoFin = new Date();
  finalizado: boolean = false;
  mostrarIndicaciones: boolean = true;
  private _GeneralService = inject(GeneralService);
  private _MessageService = inject(MessageService);
  private _DomSanitizer = inject(DomSanitizer);
  private _ConfirmationModalService = inject(ConfirmationModalService);

  totalPregunta: number = 0;

  preguntas = [];

  activeIndex: number = 0;
  seleccion: string | null = null;
  backend = environment.backend;

  breadCrumbItems: MenuItem[];
  breadCrumbHome: MenuItem;

  evaluacionPractica: string = 'Evaluación';

  ngOnInit() {
    this.obtenerEvaluacionxiEvaluacionId();
    this.obtenerPreguntaxiEvaluacionId();
  }

  handleIniciarEvaluacion(valor: boolean) {
    if (valor) {
      this.mostrarIndicaciones = false;
    }
  }

  obtenerEvaluacionxiEvaluacionId() {
    this.accionBtnItem({
      accion: 'CONSULTARxiEvaluacionIdxiCursoNivelGradIdxiIieeId',
      item: [
        {
          dtHoraActual: new Date().toISOString(),
          dtExamenFechaFin: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(), // 1 hora desde ahora
          cEvaluacionNombre: 'Evaluación de Práctica',
          cGradoAbreviacion: '5°',
          cCursoNombre: 'Ciencias Sociales',
          cNivelTipoNombre: 'Secundaria',
        },
      ],
      message: 'Evaluación de práctica cargada correctamente',
    });
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
  tiempoRestante: number = 60;
  getTiempoFormateado(): string {
    const minutos = Math.floor(this.tiempoRestante / 60);
    const segundos = this.tiempoRestante % 60;
    return `${minutos}:${segundos < 10 ? '0' + segundos : segundos}`;
  }

  obtenerPreguntaxiEvaluacionId() {
    this.accionBtnItem({
      accion: 'ConsultarPreguntasxiEvaluacionIdxiCursoNivelGradIdxiEstudianteId',
      item: [
        // PREGUNTA SIMPLE 1: Religión
        {
          iPreguntaId: '1001',
          iEncabPregId: null,
          cPregunta: '<p>¿Cuál es el libro sagrado del cristianismo?</p>',
          cEncabPregContenido: null,
          alternativas: JSON.stringify([
            {
              iAlternativaId: '1001',
              iPreguntaId: '1001',
              cAlternativaDescripcion: 'La Biblia',
              cAlternativaImagen: null,
              iMarcado: 0,
              iResultadoId: '2001',
            },
            {
              iAlternativaId: '1002',
              iPreguntaId: '1001',
              cAlternativaDescripcion: 'El Corán',
              cAlternativaImagen: null,
              iMarcado: 0,
              iResultadoId: '2002',
            },
            {
              iAlternativaId: '1003',
              iPreguntaId: '1001',
              cAlternativaDescripcion: 'La Torá',
              cAlternativaImagen: null,
              iMarcado: 0,
              iResultadoId: '2003',
            },
            {
              iAlternativaId: '1004',
              iPreguntaId: '1001',
              cAlternativaDescripcion: 'El Bhagavad Gita',
              cAlternativaImagen: null,
              iMarcado: 0,
              iResultadoId: '2004',
            },
          ]),
        },

        // PREGUNTA SIMPLE 2: Valores
        {
          iPreguntaId: '1002',
          iEncabPregId: null,
          cPregunta: '<p>¿Cuál de los siguientes es un ejemplo de valor moral?</p>',
          cEncabPregContenido: null,
          alternativas: JSON.stringify([
            {
              iAlternativaId: '1005',
              iPreguntaId: '1002',
              cAlternativaDescripcion: 'Honestidad',
              cAlternativaImagen: null,
              iMarcado: 0,
              iResultadoId: '2005',
            },
            {
              iAlternativaId: '1006',
              iPreguntaId: '1002',
              cAlternativaDescripcion: 'Egoísmo',
              cAlternativaImagen: null,
              iMarcado: 0,
              iResultadoId: '2006',
            },
            {
              iAlternativaId: '1007',
              iPreguntaId: '1002',
              cAlternativaDescripcion: 'Envidia',
              cAlternativaImagen: null,
              iMarcado: 0,
              iResultadoId: '2007',
            },
            {
              iAlternativaId: '1008',
              iPreguntaId: '1002',
              cAlternativaDescripcion: 'Avaricia',
              cAlternativaImagen: null,
              iMarcado: 0,
              iResultadoId: '2008',
            },
          ]),
        },

        // PREGUNTA MÚLTIPLE 1: Parábola del Buen Samaritano - Primera parte
        {
          iPreguntaId: '1003',
          iEncabPregId: '5001',
          cPregunta: '<p>¿Quiénes ignoraron al hombre herido según la parábola?</p>',
          cEncabPregContenido:
            '<p>Lee la siguiente parábola:</p><p>Un hombre bajaba de Jerusalén a Jericó y cayó en manos de unos ladrones. Le quitaron la ropa, lo golpearon y se fueron, dejándolo medio muerto. Un sacerdote pasó por el mismo camino, y al verlo, dio un rodeo y siguió adelante. También un levita pasó por aquel lugar, lo miró y dio un rodeo. Pero un samaritano que iba de viaje, al verlo se compadeció de él. Se acercó, le curó las heridas y lo llevó a una posada para que lo atendieran.</p> <img src="assets/images/tres.jpg" alt="pregunta tres width="300" height="250""> ',
          alternativas: JSON.stringify([
            {
              iAlternativaId: '1009',
              iPreguntaId: '1003',
              cAlternativaDescripcion: 'Un sacerdote y un levita',
              cAlternativaImagen: null,
              iMarcado: 0,
              iResultadoId: '2009',
            },
            {
              iAlternativaId: '1010',
              iPreguntaId: '1003',
              cAlternativaDescripcion: 'Un samaritano y un sacerdote',
              cAlternativaImagen: null,
              iMarcado: 0,
              iResultadoId: '2010',
            },
            {
              iAlternativaId: '1011',
              iPreguntaId: '1003',
              cAlternativaDescripcion: 'Un levita y un samaritano',
              cAlternativaImagen: null,
              iMarcado: 0,
              iResultadoId: '2011',
            },
            {
              iAlternativaId: '1012',
              iPreguntaId: '1003',
              cAlternativaDescripcion: 'Dos samaritanos',
              cAlternativaImagen: null,
              iMarcado: 0,
              iResultadoId: '2012',
            },
          ]),
        },

        // PREGUNTA MÚLTIPLE 1: Parábola del Buen Samaritano - Segunda parte
        {
          iPreguntaId: '1004',
          iEncabPregId: '5001',
          cPregunta: '<p>¿Cuál es el mensaje principal de esta parábola?</p>',
          cEncabPregContenido:
            '<p>Lee la siguiente parábola:</p><p>Un hombre bajaba de Jerusalén a Jericó y cayó en manos de unos ladrones. Le quitaron la ropa, lo golpearon y se fueron, dejándolo medio muerto. Un sacerdote pasó por el mismo camino, y al verlo, dio un rodeo y siguió adelante. También un levita pasó por aquel lugar, lo miró y dio un rodeo. Pero un samaritano que iba de viaje, al verlo se compadeció de él. Se acercó, le curó las heridas y lo llevó a una posada para que lo atendieran.</p>',
          alternativas: JSON.stringify([
            {
              iAlternativaId: '1013',
              iPreguntaId: '1004',
              cAlternativaDescripcion: 'Debemos ayudar a quien lo necesita, sin importar quién sea',
              cAlternativaImagen: null,
              iMarcado: 0,
              iResultadoId: '2013',
            },
            {
              iAlternativaId: '1014',
              iPreguntaId: '1004',
              cAlternativaDescripcion: 'Es peligroso viajar solo',
              cAlternativaImagen: null,
              iMarcado: 0,
              iResultadoId: '2014',
            },
            {
              iAlternativaId: '1015',
              iPreguntaId: '1004',
              cAlternativaDescripcion: 'Los sacerdotes no son buenas personas',
              cAlternativaImagen: null,
              iMarcado: 0,
              iResultadoId: '2015',
            },
            {
              iAlternativaId: '1016',
              iPreguntaId: '1004',
              cAlternativaDescripcion: 'Debemos evitar los caminos peligrosos',
              cAlternativaImagen: null,
              iMarcado: 0,
              iResultadoId: '2016',
            },
          ]),
        },

        // PREGUNTA MÚLTIPLE 2: Los Diez Mandamientos - Primera parte
        {
          iPreguntaId: '1005',
          iEncabPregId: '5002',
          cPregunta: '<p>¿En qué lugar fueron entregados los Diez Mandamientos?</p>',
          cEncabPregContenido:
            '<p>Los Diez Mandamientos son un conjunto de principios éticos y de adoración que, según la Biblia, fueron escritos por Dios en dos tablas de piedra y entregados al profeta Moisés en el monte Sinaí.</p> <img src="assets/images/cuatro.jpg" alt="pregunta tres width="300" height="255" alt="Imagen de familia">',
          alternativas: JSON.stringify([
            {
              iAlternativaId: '1017',
              iPreguntaId: '1005',
              cAlternativaDescripcion: 'Monte Sinaí',
              cAlternativaImagen: null,
              iMarcado: 0,
              iResultadoId: '2017',
            },
            {
              iAlternativaId: '1018',
              iPreguntaId: '1005',
              cAlternativaDescripcion: 'Monte Tabor',
              cAlternativaImagen: null,
              iMarcado: 0,
              iResultadoId: '2018',
            },
            {
              iAlternativaId: '1019',
              iPreguntaId: '1005',
              cAlternativaDescripcion: 'Monte de los Olivos',
              cAlternativaImagen: null,
              iMarcado: 0,
              iResultadoId: '2019',
            },
            {
              iAlternativaId: '1020',
              iPreguntaId: '1005',
              cAlternativaDescripcion: 'Monte Ararat',
              cAlternativaImagen: null,
              iMarcado: 0,
              iResultadoId: '2020',
            },
          ]),
        },

        // PREGUNTA MÚLTIPLE 2: Los Diez Mandamientos - Segunda parte
        {
          iPreguntaId: '1006',
          iEncabPregId: '5002',
          cPregunta: '<p>¿A quién fueron entregados los Diez Mandamientos?</p>',
          cEncabPregContenido:
            '<p>Los Diez Mandamientos son un conjunto de principios éticos y de adoración que, según la Biblia, fueron escritos por Dios en dos tablas de piedra y entregados al profeta Moisés en el monte Sinaí.</p>',
          alternativas: JSON.stringify([
            {
              iAlternativaId: '1021',
              iPreguntaId: '1006',
              cAlternativaDescripcion: 'Moisés',
              cAlternativaImagen: null,
              iMarcado: 0,
              iResultadoId: '2021',
            },
            {
              iAlternativaId: '1022',
              iPreguntaId: '1006',
              cAlternativaDescripcion: 'Abraham',
              cAlternativaImagen: null,
              iMarcado: 0,
              iResultadoId: '2022',
            },
            {
              iAlternativaId: '1023',
              iPreguntaId: '1006',
              cAlternativaDescripcion: 'Noé',
              cAlternativaImagen: null,
              iMarcado: 0,
              iResultadoId: '2023',
            },
            {
              iAlternativaId: '1024',
              iPreguntaId: '1006',
              cAlternativaDescripcion: 'David',
              cAlternativaImagen: null,
              iMarcado: 0,
              iResultadoId: '2024',
            },
          ]),
        },

        // PREGUNTA MÚLTIPLE 3: Valores de la familia - Primera parte
        {
          iPreguntaId: '1007',
          iEncabPregId: '5003',
          cPregunta: '<p>¿Cuál de estos es un ejemplo de respeto en la familia?</p>',
          cEncabPregContenido:
            '<p>La familia es el núcleo fundamental de la sociedad. Es el lugar donde aprendemos valores como el amor, el respeto, la responsabilidad y la solidaridad. Estos valores son esenciales para una convivencia armónica.</p><img src="assets/images/cinco.jpg" alt="pregunta tres width="300" height="290" alt="Imagen de familia">',
          alternativas: JSON.stringify([
            {
              iAlternativaId: '1025',
              iPreguntaId: '1007',
              cAlternativaDescripcion: 'Escuchar atentamente cuando otros hablan',
              cAlternativaImagen: null,
              iMarcado: 0,
              iResultadoId: '2025',
            },
            {
              iAlternativaId: '1026',
              iPreguntaId: '1007',
              cAlternativaDescripcion: 'Interrumpir cuando alguien está hablando',
              cAlternativaImagen: null,
              iMarcado: 0,
              iResultadoId: '2026',
            },
            {
              iAlternativaId: '1027',
              iPreguntaId: '1007',
              cAlternativaDescripcion: 'Ignorar las opiniones de los demás',
              cAlternativaImagen: null,
              iMarcado: 0,
              iResultadoId: '2027',
            },
            {
              iAlternativaId: '1028',
              iPreguntaId: '1007',
              cAlternativaDescripcion: 'Burlarse de las ideas de otros',
              cAlternativaImagen: null,
              iMarcado: 0,
              iResultadoId: '2028',
            },
          ]),
        },

        // PREGUNTA MÚLTIPLE 3: Valores de la familia - Segunda parte
        {
          iPreguntaId: '1008',
          iEncabPregId: '5003',
          cPregunta:
            '<p>¿Qué valor se demuestra cuando compartimos lo que tenemos con los demás miembros de la familia?</p>',
          cEncabPregContenido:
            '<p>La familia es el núcleo fundamental de la sociedad. Es el lugar donde aprendemos valores como el amor, el respeto, la responsabilidad y la solidaridad. Estos valores son esenciales para una convivencia armónica.</p> alt="Imagen de familia">',
          alternativas: JSON.stringify([
            {
              iAlternativaId: '1029',
              iPreguntaId: '1008',
              cAlternativaDescripcion: 'Solidaridad',
              cAlternativaImagen: null,
              iMarcado: 0,
              iResultadoId: '2029',
            },
            {
              iAlternativaId: '1030',
              iPreguntaId: '1008',
              cAlternativaDescripcion: 'Competencia',
              cAlternativaImagen: null,
              iMarcado: 0,
              iResultadoId: '2030',
            },
            {
              iAlternativaId: '1031',
              iPreguntaId: '1008',
              cAlternativaDescripcion: 'Egoísmo',
              cAlternativaImagen: null,
              iMarcado: 0,
              iResultadoId: '2031',
            },
            {
              iAlternativaId: '1032',
              iPreguntaId: '1008',
              cAlternativaDescripcion: 'Indiferencia',
              cAlternativaImagen: null,
              iMarcado: 0,
              iResultadoId: '2032',
            },
          ]),
        },
      ],
      message: 'Preguntas de práctica cargadas correctamente',
    });
  }

  marcarPaginadorPregunta() {
    const cantidadPreguntas = this.preguntas[this.activeIndex].pregunta.length;
    let cantidadPreguntasMarcadas = 0;

    this.preguntas[this.activeIndex].pregunta.forEach(item => {
      item.alternativas.forEach(alter => {
        if (alter.iMarcado == 1) {
          cantidadPreguntasMarcadas++;
        }
      });
    });

    if (cantidadPreguntas == cantidadPreguntasMarcadas) {
      this.preguntas[this.activeIndex].iMarcado = 1;
    } else {
      this.preguntas[this.activeIndex].iMarcado = 0;
    }
  }

  calcularPreguntasPendientes() {
    let cantidadPreguntasPendientes = 0;
    this.preguntas.forEach(pregunta => {
      pregunta.pregunta.forEach(item => {
        let pendienteResponder = true;
        item.alternativas.forEach(alter => {
          if (alter.iMarcado == 1) {
            pendienteResponder = false;
          }
        });
        if (pendienteResponder) {
          cantidadPreguntasPendientes++;
        }
      });
    });
    return cantidadPreguntasPendientes;
  }

  guardarPregunta(alternativas, alternativa, marcado) {
    alternativas.forEach(i => {
      if (i.iAlternativaId !== alternativa.iAlternativaId) {
        i.iMarcado = false;
      }
    });
    alternativa.iMarcado = marcado;

    this.accionBtnItem({
      accion: 'guardarResultadosxiEstudianteIdxiResultadoRptaEstudiante',
      item: null,
      message: 'Respuesta de práctica guardada correctamente',
    });
  }

  preguntarTerminarExamen() {
    const cantidadPreguntasPendientes = this.calcularPreguntasPendientes();
    let mensaje = '';
    switch (cantidadPreguntasPendientes) {
      case 0:
        mensaje = 'El examen se dará por terminado. ¿Desea continuar?';
        break;
      case 1:
        mensaje = 'Hay 1 pregunta pendiente de responder. ¿Desea continuar?';
        break;
      default:
        mensaje =
          'Hay ' +
          cantidadPreguntasPendientes +
          ' preguntas pendientes de responder. ¿Desea continuar?';
        break;
    }
    this._ConfirmationModalService.openConfirm({
      header: mensaje,
      accept: () => {
        this.terminarExamen();
      },
    });
  }

  terminarExamen() {
    this.accionBtnItem({
      accion: 'terminarExamenxiEstudianteId',
      item: [{ iFinalizado: '0' }],
      message: 'Examen de práctica finalizado correctamente',
    });
  }

  getInformation(params, accion) {
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
          detail: error,
        });
      },
    });
  }

  timeEvent($event) {
    if (this.evaluacion == null) {
      return;
    }
    const { accion } = $event;
    switch (accion) {
      case 'tiempo-finalizado':
        this.finalizado = true;
        break;
      case 'tiempo-1-minuto-restante':
        this._MessageService.add({
          severity: 'warn',
          detail: 'Queda 1 minuto para finalizar la evaluación',
        });
        break;
      default:
        break;
    }
  }

  accionBtnItem(elemento): void {
    const { accion } = elemento;
    const { item } = elemento;
    const { message } = elemento;
    switch (accion) {
      case 'CONSULTARxiEvaluacionIdxiCursoNivelGradIdxiIieeId':
        this.evaluacion = item.length ? item[0] : null;
        this.tiempoActual = new Date(this.evaluacion.dtHoraActual);
        this.tiempoFin = new Date(this.evaluacion.dtExamenFechaFin);
        this.breadCrumbItems = [
          {
            label: 'Practicar evaluación ERE',
          },
        ];
        this.breadCrumbHome = {
          icon: 'pi pi-home',
          routerLink: '/',
        };
        break;
      case 'ConsultarPreguntasxiEvaluacionIdxiCursoNivelGradIdxiEstudianteId':
        this.finalizado = false;
        if (item.length && item[item.length - 1]['iFinalizado'] === '0') {
          this.finalizado = true;
          return;
        }

        const evaluaciones = item;
        for (const key in evaluaciones) {
          const itemSinEncabezado = evaluaciones.filter(
            i => !i.iEncabPregId && i.iPreguntaId === evaluaciones[key]['iPreguntaId']
          );
          if (itemSinEncabezado.length) {
            this.preguntas.push({
              pregunta: itemSinEncabezado,
              iEncabPregId: null,
            });
          }
          const itemConEncabezado = evaluaciones.filter(
            i => i.iEncabPregId && i.iEncabPregId === evaluaciones[key]['iEncabPregId']
          );
          if (itemConEncabezado.length) {
            this.preguntas.push({
              pregunta: itemConEncabezado,
              title: 'Pregunta múltiple',
              iEncabPregId: evaluaciones[key]['iEncabPregId'],
            });
          }
        }
        //Agrupar los encabezados
        this.preguntas = this.preguntas.filter(
          (value, index, self) =>
            value.iEncabPregId === null ||
            index === self.findIndex(t => t.iEncabPregId === value.iEncabPregId)
        );
        this.totalPregunta = 0;
        // //console.log(this.preguntas)
        this.preguntas.forEach(pregunta => {
          {
            if (pregunta.pregunta.length) {
              let iMarcado = 0;
              pregunta.pregunta.forEach(item => {
                this.totalPregunta = this.totalPregunta + 1;
                item.title = 'Pregunta ' + this.totalPregunta;
                item.alternativas = item.alternativas
                  ? JSON.parse(item.alternativas)
                  : item.alternativas;
                item.cPregunta = this._DomSanitizer.bypassSecurityTrustHtml(item.cPregunta);
                item.cEncabPregContenido = this._DomSanitizer.bypassSecurityTrustHtml(
                  item.cEncabPregContenido
                );
                iMarcado = item.alternativas.find(alternativa => Number(alternativa.iMarcado) === 1)
                  ? 1
                  : 0;
                // item.alternativas.forEach(alternativa => {
                //         alternativa.iMarcado = alternativa.iMarcado ? true : false
                // });
              });
              pregunta.iMarcado = iMarcado;
            }

            if (pregunta.pregunta.length > 1) {
              pregunta['iEncabPregId'] = pregunta.pregunta[0]['iEncabPregId'];
              pregunta['cEncabPregContenido'] = pregunta.pregunta[0]['cEncabPregContenido'];
              pregunta['cPregunta'] = pregunta.pregunta[0]['cPregunta'];
            } else {
              pregunta.title = pregunta.pregunta[0]?.title || '';
            }
          }
        });
        //console.log(this.preguntas)
        break;
      case 'guardarResultadosxiEstudianteIdxiResultadoRptaEstudiante':
        this._MessageService.add({
          severity: 'success',
          detail: message,
        });
        break;
      case 'terminarExamenxiEstudianteId':
        this.finalizado = false;
        if (item.length && item[item.length - 1]['iFinalizado'] === '0') {
          this.finalizado = true;
          //window.location.reload()
        }

        break;
      case 'close-modal':
        this.showModalPreview = false;
        break;
    }
  }
  updateUrl(item) {
    item.cAlternativaImagen = 'users/no-image.png';
  }

  previewImage: string | null = null;
  showModalPreview: boolean = false;
  onImageClick(event: MouseEvent) {
    const target = event.target as HTMLImageElement;

    // Verifica si el clic fue en una imagen
    if (target.tagName.toLowerCase() === 'img') {
      this.previewImage = target.src; // Asigna la URL de la imagen al preview
      this.showModalPreview = true;
    }
  }
}
