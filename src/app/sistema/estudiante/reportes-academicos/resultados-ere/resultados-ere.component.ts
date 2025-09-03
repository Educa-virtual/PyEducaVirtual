import { PrimengModule } from '@/app/primeng.module';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { ResultadosEreService } from './services/resultados-ere.service';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { UIChart } from 'primeng/chart';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-resultados-ere',
  standalone: true,
  imports: [PrimengModule],
  templateUrl: './resultados-ere.component.html',
  styleUrl: './resultados-ere.component.scss',
})
export class ResultadosEreComponent implements OnInit {
  breadCrumbItems: MenuItem[];
  breadCrumbHome: MenuItem;
  //resultadoAreas: any = [];
  //dropdownOptions: Array<{ label: string; value: CourseRow }> = [];
  //selectedCourse: CourseRow | null = null;
  areaSeleccionada: any = null;
  anioEscolar: number;
  resultado: any = [];
  evaluaciones: any = [];
  evaluacionSeleccionada: any = null;
  chartPlugins = [ChartDataLabels];

  @ViewChild('uiChart') uiChart?: UIChart;

  chartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
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

  constructor(
    private resultadosEreService: ResultadosEreService,
    private messageService: MessageService,
    private store: LocalStoreService
  ) {}

  ngOnInit() {
    this.anioEscolar = this.store.getItem('dremoYear');
    this.breadCrumbHome = {
      icon: 'pi pi-home',
      routerLink: '/',
    };
    this.breadCrumbItems = [
      {
        label: 'Reportes académicos',
      },
      {
        label: 'Progreso',
      },
    ];
    this.obtenerEvaluacionesEstudiantePorAnio();
  }

  obtenerEvaluacionesEstudiantePorAnio() {
    this.resultadosEreService.obtenerEvaluacionesEstudiantePorAnio(this.anioEscolar).subscribe({
      next: (response: any) => {
        this.evaluaciones = response.data;
        //this.evaluaciones = this.transform(response.data);
        //this.dropdownOptions = this.resultadoAreas.map(t => ({ label: t.curso, value: t }));
      },
      error: err => {
        this.messageService.add({
          severity: 'error',
          summary: 'Problema al obtener evaluaciones',
          detail: err.error.message || 'Error desconocido',
        });
      },
    });
  }

  obtenerResultadosEstudiantePorEvaluacion() {
    this.resultadosEreService
      .obtenerResultadosEstudiantePorEvaluacion(this.evaluacionSeleccionada)
      .subscribe({
        next: (response: any) => {
          this.resultado = response.data;
          //this.dropdownOptions = this.resultadoAreas.map(t => ({ label: t.curso, value: t }));
        },
        error: err => {
          this.messageService.add({
            severity: 'error',
            summary: 'Problema al obtener resultados',
            detail: err.error.message || 'Error desconocido',
          });
        },
      });
  }

  onCourseChange(): void {
    const cursoSeleccionado = this.resultado.find(
      (curso: any) => curso.iCursosNivelGradId === this.areaSeleccionada
    );
    if (!cursoSeleccionado) {
      this.clearChart();
      return;
    }
    this.buildChartData(cursoSeleccionado);
    setTimeout(() => this.uiChart?.refresh(), 0);
  }

  private buildChartData(curso: any) {
    const labels = ['Aciertos', 'Desaciertos', 'En blanco'];
    const correctas = [curso?.iCantidadCorrectas, curso?.iCantidadIncorrectas, curso?.iEnBlanco];

    this.chartData = {
      labels,
      datasets: [
        {
          label: 'Correctas',
          data: correctas,
          backgroundColor: [
            'rgba(220, 20, 60, 0.6)', // rojo suave
            'rgba(30, 144, 255, 0.6)', // azul suave
            'rgba(255, 165, 0, 0.6)', // naranja suave
          ],
          borderColor: ['rgba(220, 20, 60, 1)', 'rgba(30, 144, 255, 1)', 'rgba(255, 165, 0, 1)'],
          borderWidth: 1,
        },
      ],
    };
  }

  private clearChart() {
    this.chartData = { labels: [], datasets: [] };
  }
}
