import { PrimengModule } from '@/app/primeng.module';
import { Component, inject, Input, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { ProgressBarModule } from 'primeng/progressbar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RemoveHTMLCSSPipe } from '@/app/shared/pipes/remove-html-style.pipe';
import { TruncatePipe } from '@/app/shared/pipes/truncate-text.pipe';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { environment } from '@/environments/environment';
import { ImagePreviewComponent } from '@/app/shared/image-preview/image-preview.component';
import { VistaPreviaEreService } from './services/vista-previa-ere.service';
import { Router } from '@angular/router';

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
    ImagePreviewComponent,
  ],
})
export class VistaPreviaEreComponent implements OnInit {
  @Input() iEvaluacionId: string;
  @Input() iCursoNivelGradId: string;
  evaluacion: any;
  previewImage: string | null = null;
  showModalPreview: boolean = false;
  private _DomSanitizer = inject(DomSanitizer);

  totalPregunta: number = 0;

  preguntas = [];

  activeIndex: number = 0;
  seleccion: string | null = null;
  backend = environment.backend;

  breadCrumbItems: MenuItem[];
  breadCrumbHome: MenuItem;

  constructor(
    private messageService: MessageService,
    private router: Router,
    private vistaPreviaEreService: VistaPreviaEreService
  ) {}

  ngOnInit() {
    this.obtenerVistaPrevia();
  }

  regresar() {
    this.router.navigate([
      `ere/evaluaciones/${this.iEvaluacionId}/areas/${this.iCursoNivelGradId}/preguntas`,
    ]);
    //window.history.back();
  }

  obtenerVistaPrevia() {
    this.vistaPreviaEreService
      .obtenerVistaPrevia(this.iEvaluacionId, this.iCursoNivelGradId)
      .subscribe({
        next: (data: any) => {
          this.evaluacion = data.data.evaluacion;
          this.generarBreadCrumb();
          this.mostrarPreguntas(data.data.preguntas);
        },
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Problema al obtener sugerencias',
            detail: error.error.message,
          });
        },
      });
  }

  mostrarPreguntas(dataPreguntas) {
    this.preguntas = [];
    const evaluaciones = dataPreguntas;
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
  }

  generarBreadCrumb() {
    this.breadCrumbItems = [
      {
        label: 'ERE',
      },
      {
        label: 'Evaluaciones',
        routerLink: '/ere/evaluaciones',
      },
      {
        label: this.evaluacion.cEvaluacionNombre || 'Sin nombre',
      },
      {
        label: 'Lista de áreas',
      },
      {
        label:
          (this.evaluacion.cCursoNombre || '') +
          ' ' +
          (this.evaluacion.cGradoAbreviacion || '') +
          ' ' +
          (this.evaluacion.cNivelTipoNombre || ''),
      },
      {
        label: 'Gestionar preguntas',
        routerLink: `/ere/evaluaciones/${this.iEvaluacionId}/areas/${this.iCursoNivelGradId}/preguntas`,
      },
      { label: 'Vista previa' },
    ];

    this.breadCrumbHome = {
      icon: 'pi pi-home',
      routerLink: '/',
    };
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

  updateUrl(item) {
    item.cAlternativaImagen = 'users/no-image.png';
  }

  onImageClick(event: MouseEvent) {
    const target = event.target as HTMLImageElement;

    if (target.tagName.toLowerCase() === 'img') {
      this.previewImage = target.src;
      this.showModalPreview = true;
    }
  }

  marcarAlternativa(alternativas, alternativa, marcado) {
    alternativas.forEach(i => {
      if (i.iAlternativaId !== alternativa.iAlternativaId) {
        i.iMarcado = false;
      }
    });
    alternativa.iMarcado = marcado;
  }

  cerrarImagePreview() {
    this.showModalPreview = false;
  }
}
