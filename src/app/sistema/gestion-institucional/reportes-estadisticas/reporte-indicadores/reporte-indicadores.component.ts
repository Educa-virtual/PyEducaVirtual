import { Component, OnInit, signal } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { GeneralService } from '@/app/servicios/general.service';
import { ConstantesService } from '@/app/servicios/constantes.service';
import {
  ADMINISTRADOR_DREMO,
  ESPECIALISTA_UGEL,
  ESPECIALISTA_DREMO,
} from '@/app/servicios/seg/perfiles';
import { TabsPrimengComponent } from '@/app/shared/tabs-primeng/tabs-primeng.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component';
import { NoDataComponent } from '@/app/shared/no-data/no-data.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { GestionUsuariosService } from '@/app/sistema/administrador/gestion-usuarios/services/gestion-usuarios.service';

import {
  indicadorBajoRendimiento,
  indicadorDesempeno,
  indicadorDeserciones,
  indicadorFaltasTardanzas,
  indicadorMatriculas,
  reportes,
} from './constantes-indicadores';
import { DatosInformesService } from '@/app/sistema/ere/services/datos-informes.service';
import { CAMPOS_INDICADOR, COLORES_BASE, MAPEO_COLUMNAS } from './indicadores-mapeos';

import * as XLSX from 'xlsx-js-style';

import { ChartOptions } from 'chart.js';
import { MessageService } from 'primeng/api';
import { DatosIndicadoresService } from '../../services/datos-indicadores-service';

@Component({
  selector: 'app-reporte-indicadores',
  standalone: true,
  imports: [PrimengModule, TabsPrimengComponent, TablePrimengComponent, NoDataComponent],
  templateUrl: './reporte-indicadores.component.html',
  styleUrl: './reporte-indicadores.component.scss',
})
export class ReporteIndicadoresComponent implements OnInit {
  nivel_tipos: any[] = [];
  instituciones_educativas: any[] = [];
  sedes: any[] = [];
  sedes_grados_secciones: any[] = [];
  sexos: any[] = [];
  nivel_grados: any[] = [];
  nivel_grados_filtrados: any[] = [];
  secciones: any[] = [];
  secciones_filtradas: any[] = [];

  breadCrumbHome: any = { icon: 'pi pi-home' };
  breadCrumbItems: any[] = [{ label: 'Reportes y estadísticas' }, { label: 'Indicadores' }];

  _total: number = 0;

  _export: string = '';

  selectTab = signal<number>(0);
  tabSeleccionado = signal<string>('resumen-matriculados');

  chartDataPie = signal<any>(null);
  chartOptionsPie = signal<any>(null);

  chartDataBar = signal<any>(null);
  chartOptionsBar = signal<any>(null);

  columnasTabla = signal<any[]>([]);

  detalle = signal<any[]>([]); //Detalle de los indicadores

  data = signal<any[]>([]);
  tabs = signal<any[]>([
    {
      title: 'Matrículados',
      icon: 'pi pi-list',
      tab: 'resumen-matriculados',
      opcion: indicadorMatriculas,
    },
    {
      title: 'Deserciones',
      icon: 'pi pi-user-minus',
      tab: 'resumen-deserciones',
      opcion: indicadorDeserciones,
    },
    {
      title: 'Faltas y tardanzas',
      icon: 'pi pi-calendar',
      tab: 'resumen-asistencia',
      opcion: indicadorFaltasTardanzas,
    },
    {
      title: 'Desempeño',
      icon: 'pi pi-chart-line',
      tab: 'resumen-desempenio',
      opcion: indicadorDesempeno,
    },
    {
      title: 'Bajo Rendimiento',
      icon: 'pi pi-exclamation-triangle',
      tab: 'resumen-bajo-rendimiento',
      opcion: indicadorBajoRendimiento,
    },
  ]);

  perfil: any;
  iYAcadId: number;
  esAdminDremo: boolean = false;
  reportes = signal<any>(reportes);

  formIndicadores: FormGroup;

  constructor(
    private _GeneralService: GeneralService,
    private _ConstantesService: ConstantesService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private store: LocalStoreService,
    private usuarioService: GestionUsuariosService,
    private informeService: DatosInformesService,
    private messageService: MessageService,
    private indicadorService: DatosIndicadoresService
  ) {
    this.iYAcadId = this.store.getItem('dremoiYAcadId');
    this.perfil = this.store.getItem('dremoPerfil');
    this.esAdminDremo = [ADMINISTRADOR_DREMO, ESPECIALISTA_DREMO, ESPECIALISTA_UGEL].includes(
      Number(this.perfil.iPerfilId)
    );
    this.route.queryParams.subscribe(params => {
      const tabParam = params['tab'];
      if (tabParam) {
        this.tabSeleccionado.set(tabParam);
        const index = this.tabs().findIndex(t => t.tab === this.tabSeleccionado());
        this.selectTab.set(index !== -1 ? index : 0);
      }
    });
  }

  ngOnInit(): void {
    try {
      this.formIndicadores = this.fb.nonNullable.group({
        iCredEntPerfId: [this.perfil?.iCredEntPerfId ?? null, Validators.required],
        iYAcadId: [this._ConstantesService.iYAcadId ?? null, Validators.required],
        iNivelTipoId: [null],
        iIieeId: [null],
        iSedeId: [null],
        iNivelGradoId: [null],
        iSeccionId: [null],
        cSexo: [null],
      });
    } catch (error) {
      console.error(error, 'Error de formulario');
    }
    this.indicadorService
      .crearIndicadores({
        iYAcadId: this.iYAcadId,
      })
      .subscribe((data: any) => {
        this.nivel_tipos = this.indicadorService.getNivelTipos(data?.nivel_tipos);
        this.sedes_grados_secciones = this.indicadorService.getSedeGradoSeccion(
          data?.sedes_grados_secciones
        );
        this.nivel_grados = this.indicadorService.getNivelGrados(data?.nivel_grados);
        this.secciones = this.indicadorService.getSecciones(data?.secciones);
        this.sexos = this.indicadorService.getSexos(data?.sexos);
        this.mapearGradosSecciones();
        this.filterIes();
      });
  }

  mapearGradosSecciones() {
    this.sedes_grados_secciones.forEach(ie => {
      ie.sedes.forEach(sede => {
        sede.grados.forEach(grado => {
          const gradoInfo = this.nivel_grados.find(x => Number(x.value) === grado.iNivelGradoId);
          grado.cGradoAbreviacionNombre = gradoInfo?.label;
          grado.secciones.forEach(sec => {
            const secInfo = this.secciones.find(x => Number(x.value) === sec.iSeccionId);
            sec.cSeccionNombre = secInfo?.label ?? '';
          });
        });
      });
    });
    if (this.nivel_tipos.length === 1) {
      this.formIndicadores.patchValue({ iNivelTipoId: this.nivel_tipos[0].value });
      this.filterIes();
    }
  }

  filterIes() {
    this.formIndicadores.patchValue({
      iIieeId: null,
      iSedeId: null,
      iNivelGradoId: null,
      iSeccionId: null,
    });
    const iNivelTipoId = Number(this.formIndicadores.value.iNivelTipoId);
    let data = this.sedes_grados_secciones;
    if (iNivelTipoId) {
      data = data.filter(item => Number(item.iNivelTipoId) === iNivelTipoId);
    }
    this.instituciones_educativas = data.map(item => ({
      value: Number(item.iIieeId),
      label: item.cIieeCodigoModular + ' - ' + item.cIieeNombre,
    }));
    if (this.instituciones_educativas.length === 1) {
      this.formIndicadores.patchValue({ iIieeId: this.instituciones_educativas[0].value });
      this.filterSede();
    }
  }

  filterSede() {
    this.formIndicadores.patchValue({
      iSedeId: null,
      iNivelGradoId: null,
      iSeccionId: null,
    });
    this.formIndicadores.get('iSedeId').setValue(null);
    const iIieeId = Number(this.formIndicadores.value.iIieeId);
    const ie = this.sedes_grados_secciones.find(x => Number(x.iIieeId) === iIieeId);
    this.sedes = (ie?.sedes ?? []).map(sede => ({ value: sede.iSedeId, label: sede.cSedeNombre }));
    if (this.sedes.length === 1) {
      this.formIndicadores.patchValue({ iSedeId: this.sedes[0].value });
      this.filterGrados();
    }
  }

  filterGrados() {
    this.formIndicadores.patchValue({
      iNivelGradoId: null,
      iSeccionId: null,
    });
    const ie = this.sedes_grados_secciones.find(
      x => x.iIieeId === Number(this.formIndicadores.value.iIieeId)
    );
    const sede = ie?.sedes?.find(s => s.iSedeId === Number(this.formIndicadores.value.iSedeId));
    this.nivel_grados_filtrados = (sede?.grados ?? []).map(g => ({
      value: g.iNivelGradoId,
      label: g.cGradoAbreviacionNombre,
    }));
    if (this.nivel_grados_filtrados.length === 1) {
      this.formIndicadores.patchValue({ iNivelGradoId: this.nivel_grados_filtrados[0].value });
      this.filterSecciones();
    }
  }

  filterSecciones() {
    this.formIndicadores.get('iSeccionId').setValue(null);
    const ie = this.sedes_grados_secciones.find(
      x => x.iIieeId === Number(this.formIndicadores.value.iIieeId)
    );
    const sede = ie?.sedes?.find(s => s.iSedeId === Number(this.formIndicadores.value.iSedeId));
    const grado = sede?.grados?.find(
      g => g.iNivelGradoId === Number(this.formIndicadores.value.iNivelGradoId)
    );
    this.secciones_filtradas = (grado?.secciones ?? []).map(sec => ({
      value: sec.iSeccionId,
      label: sec.cSeccionNombre,
    }));
    if (this.secciones_filtradas.length === 1) {
      this.formIndicadores.patchValue({ iSeccionId: this.secciones_filtradas[0].value });
    }
  }

  obtenerOpcion() {
    const tab = this.tabs().find(t => t.tab === this.tabSeleccionado());
    return tab ? tab.opcion : '';
  }

  obtenerResultadosxIndicador() {
    const opcion = this.obtenerOpcion();
    const _opcion = String(opcion + 'Detalle');
    if (this.formIndicadores.value.iIieeId && !this.formIndicadores.value.iSedeId) {
      this.messageService.add({
        severity: 'error',
        summary: '¡Atención!',
        detail: 'Debe seleccionar la sede',
      });
      return;
    }
    if (opcion) {
      this.data.set([]);
      this._GeneralService
        .searchCalendario({
          json: JSON.stringify(this.formIndicadores.value),
          _opcion: opcion,
        })
        .subscribe({
          next: (resp: any) => {
            this.obtenerColumnasTabla();
            const data = (resp?.data ?? []).map((item: any) => ({
              ...item,
              Porcentaje: Number(item.Porcentaje) + '%',
            }));
            this.data.set(data);
            this.generarGraficoDinamicoPie();
            this.generarGraficoDinamicoBar();

            const totaltotal = data.reduce((acc: number, item: any) => {
              return acc + Number(item.Cantidad);
            }, 0);
            this._total = totaltotal;
          },
          error: error => {
            this.messageService.add({
              severity: 'error',
              summary: 'Mensaje',
              detail: 'Error. No se proceso petición ' + error,
            });
          },
          complete: () => {
            this.obtenerDetalle(_opcion);
          },
        });
    }
  }

  obtenerDetalle(_opcion: string) {
    this._export = 'rpt' + _opcion + '.xls';
    this._GeneralService
      .searchCalendario({
        json: JSON.stringify(this.formIndicadores.value),
        _opcion: _opcion,
      })
      .subscribe({
        next: (resp: any) => {
          this.detalle.set(resp.data);
        },
        error: error => {
          let message = error?.error?.message || 'Sin conexión a la bd';
          const match = message.match(/]([^\]]+?)\./);
          if (match && match[1]) {
            message = match[1].trim() + '.';
          }
          message = decodeURIComponent(message);
          this.messageService.add({
            severity: 'error',
            summary: 'Mensaje del sistema',
            detail: message,
          });
        },
      });
  }

  obtenerColumnasTabla() {
    const opcion = this.obtenerOpcion();
    const columnasConfig = MAPEO_COLUMNAS[opcion];
    if (!columnasConfig) return;

    if (this.formIndicadores.value.iNivelGradoId && columnasConfig.nivelGrado) {
      this.columnasTabla.set(columnasConfig.nivelGrado);
      return;
    }

    const esAdmin = this.esAdminDremo;
    const columnas = esAdmin ? columnasConfig.admin : columnasConfig.director;
    this.columnasTabla.set(columnas);
  }

  updateTab(event): void {
    this.tabSeleccionado.set(event.tab);
    this.selectTab.set(this.tabs().findIndex(t => t.tab === this.tabSeleccionado()));

    this.router.navigate([], {
      queryParams: { tab: this.tabSeleccionado() },
      queryParamsHandling: 'merge',
    });
    this.data.set([]);
    this.columnasTabla.set([]);
    this.obtenerResultadosxIndicador();
  }

  removeDuplicatesByiGradoId(array: any[]): any[] {
    const seen = new Set<number>();
    return array.filter(item => {
      if (seen.has(item.iGradoId)) {
        return false;
      }
      seen.add(item.iGradoId);
      return true;
    });
  }

  generarGraficoDinamicoPie() {
    const data = this.data();
    if (!data?.length) return;

    const labels = data.map(d => d.Detalle);
    const valores = data.map(d => Number(String(d.Porcentaje).replace('%', '')));

    this.chartDataPie.set({
      labels,
      datasets: [
        {
          data: valores,
          backgroundColor: COLORES_BASE.slice(0, labels.length),
        },
      ],
    });

    this.chartOptionsPie.set({
      plugins: {
        legend: { position: 'bottom', labels: { color: '#495057' } },
        tooltip: {
          callbacks: { label: (ctx: any) => `${ctx.label}: ${ctx.raw}%` },
        },
        responsive: true,
        maintainAspectRatio: false,

        // 👇👇 ETIQUETAS CON FONDO TIPO BADGE
        // datalabels: {
        //   color: '#000',
        //   anchor: 'center',
        //   align: 'top',
        //   padding: 6,
        //   borderRadius: 10,
        //   borderWidth: 2,
        //   borderColor: '#000',
        //   backgroundColor: '#FFF',
        //   // backgroundColor: (ctx) => {
        //   //   // color de fondo derivado de la barra
        //   //   return ctx.dataset.backgroundColor;
        //   // },
        //   font: {
        //     weight: 'bold',
        //     size: 11,
        //   },
        //   formatter: value => value + '%',
        // },
      },
      layout: {
        padding: 0,
      },
      radius: '90%', // 👈 ACHICA SOLO EL GRÁFICO, NO EL CANVAS
    });
  }

  generarGraficoDinamicoBar() {
    const data = this.data();
    const opcion = this.obtenerOpcion();
    const campos = CAMPOS_INDICADOR[opcion] ?? [];

    if (!data?.length || !campos.length) return;

    const labels = data.map(d => d.Detalle);
    const datasets = campos.map((campo, i) => ({
      label: campo,
      data: data.map(d => Number(d[campo]) || 0),
      backgroundColor: COLORES_BASE[i % COLORES_BASE.length],
    }));

    this.chartDataBar.set({ labels, datasets });

    this.chartOptionsBar.set({
      indexAxis: 'x',
      responsive: true,
      plugins: {
        legend: { position: 'bottom', labels: { color: '#495057' } },
        tooltip: {
          enabled: true, // 🔥 asegura que esté activado
          mode: 'nearest',
          intersect: false,
          callbacks: { label: (ctx: any) => `${ctx.dataset.label}: ${ctx.raw}` },
        },

        // 👇👇 ETIQUETAS CON FONDO TIPO BADGE
        // datalabels: {
        //   color: '#000',
        //   // anchor: 'center',
        //   // align: 'top',
        //   // padding: 6,
        //   // borderRadius: 10,
        //   // borderWidth: 2,
        //   // borderColor: '#000',
        //   backgroundColor: '#FFF',
        //   // // backgroundColor: (ctx) => {
        //   // //   // color de fondo derivado de la barra
        //   // //   return ctx.dataset.backgroundColor;
        //   // // },
        //   font: {
        //     weight: 'bold',
        //     size: 11,
        //   },
        //   formatter: value => value,
        // },
      },
      scales: {
        y: { beginAtZero: true, ticks: { color: '#495057' }, grid: { color: '#ebedef' } },
        x: { ticks: { color: '#495057' }, grid: { color: '#ebedef' } },
      },
    });
    // Registrar el plugin
    // Chart.register(ChartDataLabels);
  }

  //plugin personalizado para total
  centerTextPlugin = {
    id: 'centerTextBar',
    afterDraw: (chart: any) => {
      const { ctx, chartArea } = chart;
      if (!chartArea) return;

      const label = `Total: ${this._total}`;
      ctx.save();
      ctx.font = 'bold 14px sans-serif';

      // Ancho dinámico según el texto
      const textWidth = ctx.measureText(label).width;
      const paddingX = 12;
      //const paddingY = 6;

      // 📌 Posición: superior derecha del chart
      const x = chartArea.right - paddingX;
      const y = chartArea.top + 40;

      const boxWidth = textWidth + paddingX * 2;
      const boxHeight = 28;
      const radius = 10;

      // 🎨 Fondo (badge)
      ctx.fillStyle = '#007bff'; // azul tipo PrimeNG (puedes cambiar)
      ctx.strokeStyle = '#0056b3';
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.roundRect(
        x - boxWidth, // inicio
        y - boxHeight, // posición vertical
        boxWidth,
        boxHeight,
        radius
      );
      ctx.fill();
      ctx.stroke();

      // ✨ Texto dentro del badge
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, x - paddingX, y - boxHeight / 2);

      ctx.restore();
    },
  };
  ///

  chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { stacked: false },
      y: { beginAtZero: true, ticks: { precision: 0 } },
    },
    plugins: {
      title: {
        display: false,
      },
      legend: {
        display: false,
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
        offset: -6,
        color: '#000',
      },
    },
  };

  piePlugin = [
    {
      afterDraw: chart => {
        if (chart.data.datasets[0].data.length == 0) return;
        const {
          ctx,
          chartArea: { width, height },
        } = chart;

        const cx = chart._metasets[0].data[0].x;
        const cy = chart._metasets[0].data[0].y;

        const sum = chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
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
              ((chart.data.datasets[0].data[index] * 100) / sum).toFixed(2) + '%',
              xLine + extraLine + plusFivePx,
              yLine
            );
          });
        });
      },
    },
  ];

  showGrafica() {
    const { iIieeId, iSedeId } = this.formIndicadores.value;

    return this.esAdminDremo ? !!(iIieeId && iSedeId) : !!iSedeId;
  }

  generarExcel() {
    const worksheet = XLSX.utils.json_to_sheet(this.data());
    // Crear un libro de trabajo y añadir la hoja
    const worksheet2 = XLSX.utils.json_to_sheet(this.detalle());
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');

    //Agregar en otra hoja
    XLSX.utils.book_append_sheet(workbook, worksheet2, 'Detalle');

    // Exportar el archivo Excel
    const titulo = this._export;
    XLSX.writeFile(workbook, titulo);
  }

  //colocar hora en tiempo real
  fechaActual: Date = new Date();
}
