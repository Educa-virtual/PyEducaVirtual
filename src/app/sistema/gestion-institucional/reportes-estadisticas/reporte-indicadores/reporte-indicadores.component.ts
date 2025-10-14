import { Component, inject, OnInit, signal } from '@angular/core';
import { ToolbarPrimengComponent } from '@/app/shared/toolbar-primeng/toolbar-primeng.component';
import { PrimengModule } from '@/app/primeng.module';
import { MostrarErrorComponent } from '@/app/shared/components/mostrar-error/mostrar-error.component';
import { GeneralService } from '@/app/servicios/general.service';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { ADMINISTRADOR_DREMO } from '@/app/servicios/seg/perfiles';
import { TabsPrimengComponent } from '@/app/shared/tabs-primeng/tabs-primeng.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component';
import { NoDataComponent } from '@/app/shared/no-data/no-data.component';
import { FormBuilder, Validators } from '@angular/forms';
import { LocalStoreService } from '@/app/servicios/local-store.service';

@Component({
  selector: 'app-reporte-indicadores',
  standalone: true,
  imports: [
    ToolbarPrimengComponent,
    PrimengModule,
    TabsPrimengComponent,
    TablePrimengComponent,
    NoDataComponent,
  ],
  templateUrl: './reporte-indicadores.component.html',
  styleUrl: './reporte-indicadores.component.scss',
})
export class ReporteIndicadoresComponent extends MostrarErrorComponent implements OnInit {
  private _GeneralService = inject(GeneralService);
  private _ConstantesService = inject(ConstantesService);
  private _Router = inject(Router);
  private _ActivatedRoute = inject(ActivatedRoute);
  private _FormBuilder = inject(FormBuilder);
  private _LocalStoreService = inject(LocalStoreService);

  isAdminDremo = signal<boolean>(this._ConstantesService.iPerfilId === ADMINISTRADOR_DREMO);
  instituciones = signal<any[]>([]);
  selectTab = signal<number>(0);
  tabSeleccionado = signal<string>('resumen-indicadores');
  aniosDesde = signal<{ label: string; value: number }[]>([]);
  aniosHasta = signal<{ label: string; value: number }[]>([]);
  chartData = signal<any>(null);
  chartOptions = signal<any>(null);
  columnasTabla = signal<any[]>([]);

  data = signal<any[]>([]);
  tabs = signal<any[]>([
    {
      title: 'Resumen',
      icon: 'pi pi-home',
      tab: 'resumen-indicadores',
      opcion: '',
    },
    {
      title: 'Matrículados',
      icon: 'pi pi-list',
      tab: 'resumen-matriculados',
      opcion: 'indicadorMatriculas',
    },
    {
      title: 'Deserciones',
      icon: 'pi pi-user-minus',
      tab: 'resumen-deserciones',
      opcion: 'indicadorDeserciones',
    },
    {
      title: 'Asistencia',
      icon: 'pi pi-calendar',
      tab: 'resumen-asistencia',
      opcion: '',
    },
    {
      title: 'Desempeño',
      icon: 'pi pi-chart-line',
      tab: 'resumen-desempenio',
      opcion: 'indicadorDesempeno',
    },
    {
      title: 'Bajo Rendimiento',
      icon: 'pi pi-exclamation-triangle',
      tab: 'resumen-bajo-rendimiento',
      opcion: '',
    },
  ]);

  reportes = signal<any>([
    {
      key: 'resumen-matriculados',
      titulo: 'REPORTE DE MATRICULADOS',
      color: '#e30052',
    },
    {
      key: 'resumen-deserciones',
      titulo: 'REPORTE DE DESERCIONES',
      color: '#e53935',
    },
    {
      key: 'resumen-asistencia',
      titulo: 'REPORTE DE ASISTENCIA',
      color: '#1e88e5',
    },
    {
      key: 'resumen-desempenio',
      titulo: 'REPORTE DE DESEMPEÑO',
      color: '#43a047',
    },
    {
      key: 'resumen-bajo-rendimiento',
      titulo: 'REPORTE DE BAJO RENDIMIENTO',
      color: '#fbc02d',
    },
  ]);

  perfil = this._LocalStoreService.getItem('dremoPerfil');
  formIndicadores = this._FormBuilder.nonNullable.group({
    iCredEntPerfId: [this.perfil?.iCredEntPerfId ?? null, Validators.required],
    iYAcadId: [this._ConstantesService.iYAcadId ?? null, Validators.required],
  });

  ngOnInit(): void {
    const anioActual = new Date().getFullYear();
    const listaAnios = Array.from({ length: anioActual - 2020 + 1 }, (_, i) => {
      const anio = 2020 + i;
      return { label: anio.toString(), value: anio };
    });

    this.aniosDesde.set(listaAnios);
    this.aniosHasta.set(listaAnios);

    if (this.isAdminDremo()) {
      this.getIntitucionEducativa();
    }
    this._ActivatedRoute.queryParams.subscribe(params => {
      const tabParam = params['tab'];

      if (tabParam) {
        this.tabSeleccionado.set(tabParam);
        const index = this.tabs().findIndex(t => t.tab === this.tabSeleccionado());

        this.selectTab.set(index !== -1 ? index : 0);
      }
    });

    this.obtenerResultadosxIndicador();
  }

  obtenerOpcion() {
    const tab = this.tabs().find(t => t.tab === this.tabSeleccionado());
    return tab ? tab.opcion : '';
  }
  obtenerResultadosxIndicador() {
    const opcion = this.obtenerOpcion();
    if (opcion) {
      this._GeneralService
        .searchCalendario({
          json: JSON.stringify(this.formIndicadores.value),
          _opcion: opcion,
        })
        .subscribe({
          next: (data: any) => {
            this.obtenerColumnasTabla();
            this.data.set(data?.data || []);
            this.generarGraficoDinamico();
          },
          error: error => {
            this.messageService.add({
              severity: 'error',
              summary: 'Mensaje',
              detail: 'Error. No se proceso petición ' + error,
            });
          },
          complete: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Mensaje',
              detail: 'Proceso exitoso',
            });
          },
        });
    }
  }

  obtenerColumnasTabla() {
    switch (this.obtenerOpcion()) {
      case 'indicadorMatriculas':
      case 'indicadorDeserciones':
        if (this.isAdminDremo()) {
          this.columnasTabla.set([
            {
              type: 'item',
              width: '0.5rem',
              field: 'index',
              header: 'Nro',
              text_header: 'center',
              text: 'center',
            },
            {
              type: 'text',
              width: '10rem',
              field: 'cIieeCodigoNombre',
              header: 'Institución Educativa',
              text_header: 'left',
              text: 'left',
            },
            {
              type: 'text',
              width: '3rem',
              field: 'Abandono',
              header: 'Abandono',
              text_header: 'center',
              text: 'center',
            },
            {
              type: 'text',
              width: '3rem',
              field: 'Definitivo',
              header: 'Definitivo',
              text_header: 'center',
              text: 'center',
            },
            {
              type: 'text',
              width: '3rem',
              field: 'En proceso',
              header: 'En proceso',
              text_header: 'center',
              text: 'center',
            },
            {
              type: 'text',
              width: '3rem',
              field: 'Porcentaje',
              header: 'Porcentaje',
              text_header: 'center',
              text: 'center',
            },
            {
              type: 'text',
              width: '3rem',
              field: 'Total',
              header: 'Total',
              text_header: 'center',
              text: 'center',
            },
            {
              type: 'text',
              width: '3rem',
              field: 'Traslado',
              header: 'Traslado',
              text_header: 'center',
              text: 'center',
            },
          ]);
        } else {
          this.columnasTabla.set([
            {
              type: 'item',
              width: '0.5rem',
              field: 'index',
              header: 'Nro',
              text_header: 'center',
              text: 'center',
            },
            {
              type: 'text',
              width: '3rem',
              field: 'cGradoAbrevNombre',
              header: 'Grado',
              text_header: 'left',
              text: 'left',
            },
            {
              type: 'text',
              width: '3rem',
              field: 'Abandono',
              header: 'Abandono',
              text_header: 'center',
              text: 'center',
            },
            {
              type: 'text',
              width: '3rem',
              field: 'Definitivo',
              header: 'Definitivo',
              text_header: 'center',
              text: 'center',
            },
            {
              type: 'text',
              width: '3rem',
              field: 'En proceso',
              header: 'En proceso',
              text_header: 'center',
              text: 'center',
            },
            {
              type: 'text',
              width: '3rem',
              field: 'Porcentaje',
              header: 'Porcentaje',
              text_header: 'center',
              text: 'center',
            },
            {
              type: 'text',
              width: '3rem',
              field: 'Total',
              header: 'Total',
              text_header: 'center',
              text: 'center',
            },
            {
              type: 'text',
              width: '3rem',
              field: 'Traslado',
              header: 'Traslado',
              text_header: 'center',
              text: 'center',
            },
          ]);
        }
        break;
    }
  }

  updateTab(event): void {
    this.tabSeleccionado.set(event.tab);
    this.selectTab.set(this.tabs().findIndex(t => t.tab === this.tabSeleccionado()));

    this._Router.navigate([], {
      queryParams: { tab: this.tabSeleccionado() },
      queryParamsHandling: 'merge',
    });
    this.data.set([]);
    this.columnasTabla.set([]);
    this.obtenerResultadosxIndicador();
  }

  getIntitucionEducativa() {
    this._GeneralService
      .searchCalAcademico({
        esquema: 'acad',
        tabla: 'institucion_educativas',
        campos: '*',
        condicion: '1=1',
      })
      .subscribe({
        next: (data: any) => {
          const instituciones = (data.data ?? []).map((institucion: any) => ({
            ...institucion,
            cNombre: `${institucion.cIieeCodigoModular} - ${institucion.cIieeNombre}`,
          }));
          this.instituciones.set(instituciones);
        },
        error: error => {
          console.error('Error fetching Tipo documentos:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Mensaje',
            detail: 'Error en ejecución',
          });
        },
      });
  }

  generarGraficoDinamico() {
    const data = this.data();
    if (!data || data.length === 0) return;

    const keys = Object.keys(data[0]).filter(
      key => key !== 'cIieeCodigoNombre' && key !== 'cGradoAbrevNombre'
    );

    const sumas = keys.map(k => {
      const total = data.reduce((acc, obj) => acc + Number(obj[k] || 0), 0);
      return total;
    });

    const colores = [
      '#42A5F5',
      '#66BB6A',
      '#FFA726',
      '#AB47BC',
      '#FF7043',
      '#26C6DA',
      '#7E57C2',
      '#EC407A',
    ];

    this.chartData.set({
      labels: keys,
      datasets: [
        {
          data: sumas,
          backgroundColor: colores.slice(0, keys.length),
          hoverBackgroundColor: colores.slice(0, keys.length),
        },
      ],
    });

    // 5️⃣ Opciones
    this.chartOptions.set({
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#495057' },
        },
      },
    });
  }

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
}
