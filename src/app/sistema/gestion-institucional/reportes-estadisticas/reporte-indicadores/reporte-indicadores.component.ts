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
    },
    {
      title: 'Matrículados',
      icon: 'pi pi-list',
      tab: 'resumen-matriculados',
    },
    {
      title: 'Deserciones',
      icon: 'pi pi-user-minus',
      tab: 'resumen-deserciones',
    },
    {
      title: 'Asistencia',
      icon: 'pi pi-calendar',
      tab: 'resumen-asistencia',
    },
    {
      title: 'Desempeño',
      icon: 'pi pi-chart-line',
      tab: 'resumen-desempenio',
    },
    {
      title: 'Bajo Rendimiento',
      icon: 'pi pi-exclamation-triangle',
      tab: 'resumen-bajo-rendimiento',
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

    this.loadIndicadoresDemo();
  }

  updateTab(event): void {
    this.tabSeleccionado.set(event.tab);
    this.selectTab.set(this.tabs().findIndex(t => t.tab === this.tabSeleccionado()));

    this._Router.navigate([], {
      queryParams: { tab: this.tabSeleccionado() },
      queryParamsHandling: 'merge',
    });
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

  loadIndicadoresDemo() {
    const indicadores = [
      { descripcion: 'Aprobados', cantidad: 120 },
      { descripcion: 'Desaprobados', cantidad: 45 },
      { descripcion: 'Retirados', cantidad: 10 },
      { descripcion: 'Sin calificar', cantidad: 25 },
    ];

    this.data.set(indicadores);

    this.chartData.set({
      labels: indicadores.map(i => i.descripcion),
      datasets: [
        {
          data: indicadores.map(i => i.cantidad),
          backgroundColor: ['#4caf50', '#f44336', '#ff9800', '#9e9e9e'],
          hoverBackgroundColor: ['#66bb6a', '#e57373', '#ffb74d', '#bdbdbd'],
        },
      ],
    });

    this.chartOptions.set({
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#495057',
          },
        },
      },
    });

    this.columnasTabla.set([
      {
        type: 'text',
        width: '5rem',
        field: 'descripcion',
        header: 'Descripción',
        text_header: 'left',
        text: 'left',
      },
      {
        type: 'text',
        width: '2rem',
        field: 'cantidad',
        header: 'Cantidad',
        text_header: 'center',
        text: 'center',
      },
      {
        type: 'text',
        width: '2rem',
        field: 'porcentaje',
        header: 'Porcentaje',
        text_header: 'center',
        text: 'center',
        bodyTemplate: (rowData: any) => {
          const total = indicadores.reduce((sum, i) => sum + i.cantidad, 0);
          const porcentaje = ((rowData.cantidad / total) * 100).toFixed(1);
          return `${porcentaje}%`;
        },
      },
    ]);
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
