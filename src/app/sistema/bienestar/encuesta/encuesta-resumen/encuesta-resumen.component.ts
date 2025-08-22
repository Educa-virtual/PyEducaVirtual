import { PrimengModule } from '@/app/primeng.module';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DatosEncuestaService } from '../../services/datos-encuesta.service';
import { FuncionesBienestarService } from '../../services/funciones-bienestar.service';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChartOptions } from 'chart.js';
import { WordcloudChartComponent } from './wordcloud-chart/wordcloud-chart.component';
import { OverlayPanel } from 'primeng/overlaypanel';
import { ESPECIALISTA_DREMO, ESPECIALISTA_UGEL } from '@/app/servicios/seg/perfiles';

@Component({
  selector: 'app-encuesta-resumen',
  standalone: true,
  imports: [PrimengModule, WordcloudChartComponent],
  templateUrl: './encuesta-resumen.component.html',
  styleUrl: './../../gestionar-encuestas/gestionar-encuestas.component.scss',
})
export class EncuestaResumenComponent implements OnInit, AfterViewInit {
  @ViewChild('filtros') filtros: OverlayPanel;
  @ViewChild('overlayAnchor') overlayAnchorRef: ElementRef;

  perfil: any;
  iEncuId: number;
  cEncuNombre: string;
  preguntas: Array<any>;
  tipos_reportes: Array<object>;
  tipos_graficos: Array<object>;
  es_especialista: boolean = false;
  es_especialista_ugel: boolean = false;

  formFiltros: FormGroup;
  nivel_tipos: Array<object>;
  nivel_grados: Array<object>;
  tipo_sectores: Array<object>;
  zonas: Array<object>;
  ugeles: Array<object>;
  distritos: Array<object>;
  ies: Array<object>;
  secciones: Array<object>;
  sexos: Array<object>;
  filtros_aplicados: number = 0;

  formResumen: FormGroup;
  formResumenArray: FormArray;

  options_bar: ChartOptions;
  options_pie: any;
  options_wordcloud: any;

  breadCrumbItems: MenuItem[];
  breadCrumbHome: MenuItem;

  etiquetas: Array<any> = [];

  PREGUNTA_ABIERTA: number = this.datosEncuestas.PREGUNTA_ABIERTA;

  TIPO_REPORTE_LISTA: number = this.datosEncuestas.TIPO_REPORTE_LISTA;
  TIPO_REPORTE_INDIVIDUAL: number = this.datosEncuestas.TIPO_REPORTE_INDIVIDUAL;

  GRAFICO_BARRA: number = this.datosEncuestas.GRAFICO_BARRA;
  GRAFICO_CIRCULAR: number = this.datosEncuestas.GRAFICO_CIRCULAR;

  constructor(
    private datosEncuestas: DatosEncuestaService,
    private funcionesBienestar: FuncionesBienestarService,
    private store: LocalStoreService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private cf: ChangeDetectorRef
  ) {
    this.perfil = this.store.getItem('dremoPerfil');
    this.es_especialista = [ESPECIALISTA_DREMO, ESPECIALISTA_UGEL].includes(
      Number(this.perfil.iPerfilId)
    );
    this.es_especialista_ugel = ESPECIALISTA_UGEL === Number(this.perfil.iPerfilId);
    this.route.paramMap.subscribe((params: any) => {
      this.iEncuId = params.params.id || 0;
    });
    this.breadCrumbItems = [
      {
        label: 'Bienestar social',
      },
      {
        label: 'Gestionar encuestas',
        routerLink: '/bienestar/gestionar-encuestas',
      },
      {
        label: 'Encuesta',
        routerLink: `/bienestar/encuesta/${this.iEncuId}`,
      },
      {
        label: 'Resumen',
      },
    ];
    this.breadCrumbHome = {
      icon: 'pi pi-home',
      routerLink: '/',
    };
  }

  ngOnInit(): void {
    try {
      this.formResumen = this.fb.group({
        iCredEntPerfId: [this.perfil.iCredEntPerfId, Validators.required],
        iEncuId: [this.iEncuId, Validators.required],
        iEncuPregId: [null],
        iTipoGrafico: [this.GRAFICO_BARRA],
        iTipoReporte: [this.TIPO_REPORTE_INDIVIDUAL],
      });
      this.formFiltros = this.fb.group({
        iNivelTipoId: [null],
        iTipoSectorId: [null],
        iZonaId: [null],
        iUgelId: [null],
        iDsttId: [null],
        iIieeId: [null],
        iNivelGradoId: [null],
        iSeccionId: [null],
        cPersSexo: [null],
      });
    } catch (error) {
      console.error('Error creando formulario:', error);
    }

    this.datosEncuestas
      .getEncuestaParametros({
        iCredEntPerfId: this.perfil.iCredEntPerfId,
      })
      .subscribe((data: any) => {
        this.distritos = this.datosEncuestas.getDistritos(data?.distritos);
        this.secciones = this.datosEncuestas.getSecciones(data?.secciones);
        this.zonas = this.datosEncuestas.getZonas(data?.zonas);
        this.tipo_sectores = this.datosEncuestas.getTipoSectores(data?.tipo_sectores);
        this.ugeles = this.datosEncuestas.getUgeles(data?.ugeles);
        this.nivel_tipos = this.datosEncuestas.getNivelesTipos(data?.nivel_tipos);
        this.ies = this.datosEncuestas.getInstitucionesEducativas(data?.instituciones_educativas);
        this.distritos = this.datosEncuestas.getDistritos(data?.distritos);
        this.sexos = this.datosEncuestas.getSexos();
        this.datosEncuestas.getNivelesGrados(data?.nivel_grados);
        if (this.nivel_tipos && this.nivel_tipos.length == 1) {
          const nivel_tipo = this.nivel_tipos[0]['value'];
          this.formFiltros.get('iNivelTipoId')?.setValue(nivel_tipo);
          this.filterNivelesGrados(nivel_tipo);
          this.filterInstitucionesEducativas();
        }
        if (this.ugeles && this.ugeles.length === 1) {
          this.formFiltros.get('iUgelId')?.setValue(this.ugeles[0]['value']);
          this.filterInstitucionesEducativas();
        }
      });

    if (this.iEncuId) {
      this.verEncuesta();
    }

    this.formFiltros.get('iNivelTipoId').valueChanges.subscribe(value => {
      this.formFiltros.get('iNivelGradoId')?.setValue(null);
      this.nivel_grados = null;
      this.filterNivelesGrados(value);
      this.formFiltros.get('iIieeId')?.setValue(null);
      this.filterInstitucionesEducativas();
    });
    this.formFiltros.get('iDsttId').valueChanges.subscribe(() => {
      this.formFiltros.get('iIieeId')?.setValue(null);
      this.filterInstitucionesEducativas();
    });
    this.formFiltros.get('iZonaId').valueChanges.subscribe(() => {
      this.formFiltros.get('iIieeId')?.setValue(null);
      this.filterInstitucionesEducativas();
    });
    this.formFiltros.get('iTipoSectorId').valueChanges.subscribe(() => {
      this.formFiltros.get('iIieeId')?.setValue(null);
      this.filterInstitucionesEducativas();
    });
    this.formFiltros.get('iUgelId').valueChanges.subscribe(value => {
      this.formFiltros.get('iDsttId')?.setValue(null);
      this.formFiltros.get('iIieeId')?.setValue(null);
      this.distritos = null;
      this.filterInstitucionesEducativas();
      this.filterDistritos(value);
    });

    this.tipos_reportes = this.datosEncuestas.getTiposReportes();
    this.tipos_graficos = this.datosEncuestas.getTiposGraficos();

    this.verResumen();
    this.formatearGraficos();
  }

  filterNivelesTipos() {
    this.nivel_tipos = this.datosEncuestas.filterNivelesTipos();
  }

  filterNivelesGrados(iNivelTipoId: number) {
    this.nivel_grados = this.datosEncuestas.filterNivelesGrados(iNivelTipoId);
  }

  filterDistritos(iUgelId: number) {
    this.distritos = this.datosEncuestas.filterDistritos(iUgelId);
  }

  filterInstitucionesEducativas() {
    this.ies = null;
    const iNivelTipoId = this.formFiltros.get('iNivelTipoId')?.value;
    const iDsttId = this.formFiltros.get('iDsttId')?.value;
    const iZonaId = this.formFiltros.get('iZonaId')?.value;
    const iTipoSectorId = this.formFiltros.get('iTipoSectorId')?.value;
    const iUgelId = this.formFiltros.get('iUgelId')?.value;
    this.ies = this.datosEncuestas.filterInstitucionesEducativas(
      iNivelTipoId,
      iDsttId,
      iZonaId,
      iTipoSectorId,
      iUgelId
    );
    if (this.ies && this.ies.length === 1) {
      this.formFiltros.get('iIieeId')?.setValue(this.ies[0]['value']);
    }
  }

  verResumen() {
    if (this.ugeles && this.ugeles.length === 1) {
      this.formFiltros.get('iUgelId')?.setValue(this.ugeles[0]['value']);
    }
    this.datosEncuestas
      .verResumen({
        iCredEntPerfId: this.perfil.iCredEntPerfId,
        iEncuId: this.iEncuId,
        iTipoReporte: this.TIPO_REPORTE_INDIVIDUAL,
        iNivelTipoId: this.formFiltros.get('iNivelTipoId')?.value,
        iTipoSectorId: this.formFiltros.get('iTipoSectorId')?.value,
        iZonaId: this.formFiltros.get('iZonaId')?.value,
        iUgelId: this.formFiltros.get('iUgelId')?.value,
        iDsttId: this.formFiltros.get('iDsttId')?.value,
        iIieeId: this.formFiltros.get('iIieeId')?.value,
        iNivelGradoId: this.formFiltros.get('iNivelGradoId')?.value,
        iSeccionId: this.formFiltros.get('iSeccionId')?.value,
        cPersSexo: this.formFiltros.get('cPersSexo')?.value,
      })
      .subscribe({
        next: (data: any) => {
          this.contarFiltros();
          if (data.data.length) {
            this.preguntas = data.data;
            this.preguntas.forEach((pregunta: any) => {
              if (!pregunta.resumen) {
                pregunta.resumen = this.formatearDataVacia();
              } else {
                pregunta.resumen = JSON.parse(pregunta.resumen);
                pregunta.resumen_grafico = this.formatearDataPrimeChart(pregunta.resumen);
                pregunta.resumen_wordcloud = this.formatearDataWordcloud(pregunta.resumen);
              }
            });
            this.formResumenArray = this.fb.array(
              this.preguntas.map((pregunta: any) =>
                this.fb.group({
                  iCredEntPerfId: [this.perfil.iCredEntPerfId, Validators.required],
                  iEncuId: [this.iEncuId, Validators.required],
                  iEncuPregId: [pregunta.iEncuPregId],
                  iTipoGrafico: [this.GRAFICO_BARRA], // valor por defecto
                  iTipoReporte: [this.TIPO_REPORTE_INDIVIDUAL], // valor por defecto
                })
              )
            );
          }
        },
        error: error => {
          this.contarFiltros();
          console.error('Error obteniendo encuesta:', error);
        },
      });
  }

  contarFiltros() {
    this.filtros_aplicados = Object.values(this.formFiltros.value).filter(
      (value: any) => value !== null && value !== ''
    ).length;
  }

  ngAfterViewInit() {
    this.cf.detectChanges();
  }

  formatearGraficos() {
    this.options_bar = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          grace: 5,
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
        },
      },
    };
    this.options_pie = {
      radius: '50%',
      plugins: {
        legend: {
          display: false,
        },
      },
    };
    this.options_wordcloud = {
      elements: {
        word: {
          size: ctx => {
            const weight = ctx.parsed.y;
            return Math.max(20, weight);
          },
          padding: 5,
          rotate: 0,
        },
      },
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: 10,
      },
      fit: true,
      autoGrow: {
        maxTries: 300,
        scalingFactor: () => 1.5,
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    };
  }

  formatearDataPrimeChart(resumen: any) {
    const documentStyle = getComputedStyle(document.documentElement);
    resumen = resumen.slice(0, 15); // Limitar a 15 palabras

    const alternativas = resumen.map((item: any) => item.alternativa);
    const cantidad = resumen.map((item: any) => item.cantidad);

    const colorVars = ['--red-500', '--yellow-500', '--green-500', '--cyan-500', '--blue-500'];

    const hoverColorVars = ['--red-400', '--yellow-400', '--green-400', '--cyan-400', '--blue-400'];

    // Genera el array de colores según la cantidad de alternativas
    const backgroundColors = alternativas.map((_: any, idx: number) =>
      documentStyle.getPropertyValue(colorVars[idx % colorVars.length])
    );
    const hoverBackgroundColors = alternativas.map((_: any, idx: number) =>
      documentStyle.getPropertyValue(hoverColorVars[idx % colorVars.length])
    );

    return {
      labels: alternativas,
      datasets: [
        {
          label: 'Respuestas',
          backgroundColor: backgroundColors,
          hoverBackgroundColor: hoverBackgroundColors,
          data: cantidad,
        },
      ],
    };
  }

  formatearDataWordcloud(resumen: any) {
    const palabras = resumen.map((item: any) => item.alternativa);
    const cantidad = resumen.map((item: any) => item.cantidad);
    return {
      labels: palabras,
      datasets: [
        {
          label: 'respuestas',
          data: cantidad,
        },
      ],
    };
  }

  formatearDataVacia() {
    return {
      labels: [],
      datasets: [
        {
          label: 'respuestas',
          data: [],
        },
      ],
    };
  }

  getFormResumenPregunta(index: number): FormGroup {
    return this.formResumenArray.at(index) as FormGroup;
  }

  verEncuesta() {
    this.datosEncuestas
      .verEncuesta({
        iCredEntPerfId: this.perfil.iCredEntPerfId,
        iEncuId: this.iEncuId,
      })
      .subscribe({
        next: (data: any) => {
          if (data.data) {
            this.cEncuNombre = data.data.cEncuNombre;
          }
        },
        error: error => {
          console.error('Error obteniendo encuesta:', error);
        },
      });
  }

  plugin_pie = [
    {
      afterDraw: chart => {
        if (chart.data.datasets[0].data.length == 0) return;
        const {
          ctx,
          chartArea: { width, height },
        } = chart;

        const cx = chart._metasets[0].data[0].x;
        const cy = chart._metasets[0].data[0].y;

        chart.data.datasets.forEach((dataset, i) => {
          chart.getDatasetMeta(i).data.forEach((datapoint, index) => {
            const valor = chart.data.datasets[0].data[index];
            const isHidden = chart.legend.legendItems[index].hidden;
            if (valor == 0 || isHidden) return;
            const { x: a, y: b } = datapoint.tooltipPosition();

            const x = 2 * a - cx;
            const y = 2 * b - cy;

            // draw line
            const halfwidth = width / 2;
            const halfheight = height / 2;
            const xLine = x >= halfwidth ? x + 5 : x - 5;
            const yLine = y >= halfheight ? y + 5 : y - 5;
            const extraLine = x >= halfwidth ? 10 : -10;

            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(xLine + extraLine, yLine);
            // ctx.strokeStyle = dataset.backgroundColor[index];
            ctx.strokeStyle = 'black';
            ctx.stroke();

            ctx.font = '12px Arial';
            const textXPosition = x >= halfwidth ? 'left' : 'right';
            const plusFivePx = x >= halfwidth ? 5 : -5;
            ctx.textAlign = textXPosition;
            ctx.textBaseline = 'middle';
            ctx.fillStyle = dataset.backgroundColor[index];
            //ctx.fillStyle = "black";
            ctx.fillText(
              chart.data.labels[index] + ' (' + chart.data.datasets[0].data[index] + ')',
              xLine + extraLine + plusFivePx,
              yLine
            );
          });
        });
      },
    },
  ];

  plugin_bar = [
    {
      afterDraw: chart => {
        const { ctx } = chart;
        chart.data.datasets.forEach((dataset, i) => {
          if (dataset.data.length == 0) return;
          const isHidden = chart.legend.legendItems[i]?.hidden;
          if (isHidden) return;
          chart.getDatasetMeta(i).data.forEach((bar, index) => {
            const data = dataset.data[index];
            if (Number(data) == 0 || isHidden) return;
            ctx.font = '0.75em Arial';
            ctx.fillStyle = dataset.backgroundColor[index];
            ctx.fillText(data, bar.x - 15, bar.y - 5);
          });
        });
      },
    },
  ];
}
