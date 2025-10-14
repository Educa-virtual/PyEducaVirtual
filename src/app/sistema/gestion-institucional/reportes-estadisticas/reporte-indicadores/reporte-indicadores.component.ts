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
import { GestionUsuariosService } from '@/app/sistema/administrador/gestion-usuarios/services/gestion-usuarios.service';
import {
  columnasAdminIndicadorAsistencia,
  columnasAdminIndicadorBajoRendimiento,
  columnasAdminIndicadorDesempeno,
  columnasAdminIndicadorDeserciones,
  columnasAdminIndicadorMatriculas,
  columnasDirectorIndicadorAsistencia,
  columnasDirectorIndicadorBajoRendimiento,
  columnasDirectorIndicadorDesempeno,
  columnasDirectorIndicadorDeserciones,
  columnasDirectorIndicadorMatriculas,
  columnasIndicadorDesercionesxiNivelGradoId,
  columnasIndicadorMatriculadosxiNivelGradoId,
  indicadorBajoRendimiento,
  indicadorDesempeno,
  indicadorDeserciones,
  indicadorFaltasTardanzas,
  indicadorMatriculas,
  reportes,
} from './constantes-indicadores';

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
  private _GestionUsuariosService = inject(GestionUsuariosService);

  isAdminDremo = signal<boolean>(this._ConstantesService.iPerfilId === ADMINISTRADOR_DREMO);
  instituciones = signal<any[]>([]);
  sedes = signal<any[]>([]);
  gradosSecciones = signal<any[]>([]);
  grados = signal<any[]>([]);
  secciones = signal<any[]>([]);

  selectTab = signal<number>(0);
  tabSeleccionado = signal<string>('resumen-matriculados');

  chartDataPie = signal<any>(null);
  chartOptionsPie = signal<any>(null);

  chartDataBar = signal<any>(null);
  chartOptionsBar = signal<any>(null);

  columnasTabla = signal<any[]>([]);

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
      title: 'Asistencia',
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

  reportes = signal<any>(reportes);

  perfil = this._LocalStoreService.getItem('dremoPerfil');

  formIndicadores = this._FormBuilder.nonNullable.group({
    iCredEntPerfId: [this.perfil?.iCredEntPerfId ?? null, Validators.required],
    iYAcadId: [this._ConstantesService.iYAcadId ?? null, Validators.required],
    iIieeId: [null],
    iSedeId: [null],
    iNivelGradoId: [null],
    iSeccionId: [null],
  });

  ngOnInit(): void {
    if (this.isAdminDremo()) {
      this.getIntitucionEducativa();
    } else {
      this.formIndicadores.controls.iSedeId.setValue(this._ConstantesService.iSedeId);
      this.obtenerGradoSeccion();
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
    if (this.formIndicadores.value.iIieeId && !this.formIndicadores.value.iSedeId) {
      this.messageService.add({
        severity: 'error',
        summary: '¡Atención!',
        detail: 'Debe seleccionar la sede',
      });
      return;
    }
    if (opcion) {
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
          },
          error: error => {
            this.messageService.add({
              severity: 'error',
              summary: 'Mensaje',
              detail: 'Error. No se proceso petición ' + error,
            });
          },
        });
    }
  }

  obtenerColumnasTabla() {
    switch (this.obtenerOpcion()) {
      case indicadorMatriculas:
        if (this.formIndicadores.value.iNivelGradoId) {
          this.columnasTabla.set(columnasIndicadorMatriculadosxiNivelGradoId);
        } else {
          this.columnasTabla.set(
            this.isAdminDremo()
              ? this.formIndicadores.value.iSedeId
                ? columnasDirectorIndicadorMatriculas
                : columnasAdminIndicadorMatriculas
              : columnasDirectorIndicadorMatriculas
          );
        }
        break;
      case indicadorDeserciones:
        if (this.formIndicadores.value.iNivelGradoId) {
          this.columnasTabla.set(columnasIndicadorDesercionesxiNivelGradoId);
        } else {
          this.columnasTabla.set(
            this.isAdminDremo()
              ? this.formIndicadores.value.iSedeId
                ? columnasDirectorIndicadorDeserciones
                : columnasAdminIndicadorDeserciones
              : columnasDirectorIndicadorDeserciones
          );
        }
        break;
      case indicadorFaltasTardanzas:
        this.columnasTabla.set(
          this.isAdminDremo()
            ? columnasAdminIndicadorAsistencia
            : columnasDirectorIndicadorAsistencia
        );
        break;
      case indicadorDesempeno:
        this.columnasTabla.set(
          this.isAdminDremo() ? columnasAdminIndicadorDesempeno : columnasDirectorIndicadorDesempeno
        );
        break;
      case indicadorBajoRendimiento:
        this.columnasTabla.set(
          this.isAdminDremo()
            ? columnasAdminIndicadorBajoRendimiento
            : columnasDirectorIndicadorBajoRendimiento
        );
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
            cNombre:
              institucion.cIieeCodigoModular +
              ' - ' +
              institucion.cIieeNombre +
              ' - ' +
              (Number(institucion.iNivelTipoId) === 3 ? 'PRIMARIA' : 'SECUNDARIA'),
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

  obtenerSedesIe() {
    if (!this.formIndicadores.value.iIieeId) return;
    this.formIndicadores.controls.iNivelGradoId.setValue(null);
    this.formIndicadores.controls.iSeccionId.setValue(null);
    this.sedes.set([]);
    this.data.set([]);
    this._GestionUsuariosService
      .obtenerSedesInstitucionEducativa(this.formIndicadores.value.iIieeId)
      .subscribe({
        next: (respuesta: any) => {
          this.sedes.set(
            respuesta.data.map(sede => ({
              value: sede.iSedeId,
              label: sede.cSedeNombre,
            }))
          );
        },
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Problema al obtener sedes',
            detail: error,
          });
        },
      });
  }

  obtenerGradoSeccion() {
    if (!this.formIndicadores.value.iSedeId) return;
    this.formIndicadores.controls.iNivelGradoId.setValue(null);
    this.formIndicadores.controls.iSeccionId.setValue(null);
    this.data.set([]);
    this._GeneralService
      .searchCalendario({
        json: JSON.stringify({
          iSedeId: this.formIndicadores.value.iSedeId,
          iYAcadId: this._ConstantesService.iYAcadId,
        }),
        _opcion: 'getGradoSeccionXiSedeIdXiYAcadId',
      })
      .subscribe({
        next: (data: any) => {
          this.gradosSecciones.set(data.data || []);
          this.grados.set(this.removeDuplicatesByiGradoId(this.gradosSecciones()));
        },
        error: error => {
          this.messageService.add({
            summary: 'Mensaje de sistema',
            detail: 'Error al cargar secciones de IE.' + error.error.message,
            life: 3000,
            severity: 'error',
          });
        },
      });
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

  obtenerSecciones() {
    if (!this.formIndicadores.value.iNivelGradoId) return;
    this.secciones.set(
      this.gradosSecciones().filter(
        item => item.iNivelGradoId === this.formIndicadores.value.iNivelGradoId
      )
    );
  }

  generarGraficoDinamicoPie() {
    const data = this.data();
    if (!data || data.length === 0) return;

    let campoLabel = 'Detalle';
    if (
      this.obtenerOpcion() === indicadorMatriculas ||
      this.obtenerOpcion() === indicadorDeserciones
    ) {
      campoLabel = data[0].cSeccionNombre ? 'cSeccionNombre' : 'cGradoAbrevNombre';
    }

    const labels = data.map(item => item[campoLabel]);
    const valores = data.map(item => Number(String(item.Porcentaje).replace('%', '')));

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

    this.chartDataPie.set({
      labels,
      datasets: [
        {
          data: valores,
          backgroundColor: colores.slice(0, labels.length),
          hoverBackgroundColor: colores.slice(0, labels.length),
        },
      ],
    });

    this.chartOptionsPie.set({
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#495057' },
        },
        tooltip: {
          callbacks: {
            label: (context: any) => `${context.label}: ${context.raw}%`,
          },
        },
      },
    });
  }

  generarGraficoDinamicoBar() {
    const data = this.data();
    if (!data || data.length === 0) return;

    const opcion = this.obtenerOpcion();

    // 🔹 Definir los campos (series) según el tipo de indicador
    let campos: string[] = [];
    switch (opcion) {
      case indicadorMatriculas:
        campos = ['En proceso', 'Definitivo', 'Traslado', 'Abandono'];
        break;
      case indicadorDeserciones:
        campos = ['Otro', 'Definitiva', 'Temporal'];
        break;
      case indicadorFaltasTardanzas:
        campos = ['Asistencia', 'Tardanza', 'Inasistencia'];
        break;
      case indicadorDesempeno:
        campos = ['Excelente', 'Bueno', 'Regular'];
        break;
      case indicadorBajoRendimiento:
        campos = ['Excelente', 'Bueno', 'Regular', 'Deficiente'];
        break;
    }

    // 🔹 Determinar qué columna usar como label del eje X
    let campoLabel = 'Detalle';
    if (data[0]?.cSeccionNombre) campoLabel = 'cSeccionNombre';
    else if (data[0]?.cGradoAbrevNombre) campoLabel = 'cGradoAbrevNombre';

    const labels = data.map(item => item[campoLabel]);

    // 🔹 Paleta de colores (una por dataset)
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

    // 🔹 Crear datasets dinámicos (uno por campo)
    const datasets = campos.map((campo, i) => ({
      label: campo,
      data: data.map(item => Number(item[campo]) || 0), // Tomamos el valor numérico
      backgroundColor: colores[i % colores.length],
      borderColor: '#333',
      borderWidth: 1,
    }));

    // 🔹 Asignar datos al gráfico
    this.chartDataBar.set({
      labels,
      datasets,
    });

    // 🔹 Opciones del gráfico
    this.chartOptionsBar.set({
      indexAxis: 'x', // barras verticales
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#495057',
          },
        },
        tooltip: {
          callbacks: {
            label: (context: any) => `${context.dataset.label}: ${context.raw}`,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: '#495057',
          },
          grid: {
            color: '#ebedef',
          },
        },
        x: {
          ticks: { color: '#495057' },
          grid: { color: '#ebedef' },
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

  showGrafica() {
    const { iIieeId, iSedeId } = this.formIndicadores.value;

    return this.isAdminDremo() ? !!(iIieeId && iSedeId) : !!iSedeId;
  }
}
