import { PrimengModule } from '@/app/primeng.module';
import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { ResultadosEreService } from './services/resultados-ere.service';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { ChartOptions } from 'chart.js';
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

  areaSeleccionada: any = null;
  anioEscolar: number;
  resultado: any = [];
  evaluaciones: any = [];
  evaluacionSeleccionada: any = null;
  chartPlugins = [ChartDataLabels];
  rindioEvaluaciones: boolean = null;

  data_bar: any;
  options_bar: ChartOptions;

  barPlugin = [
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
        label: 'Resultados ERE',
        active: true,
      },
    ];
    this.obtenerEvaluacionesEstudiantePorAnio();
  }

  obtenerEvaluacionesEstudiantePorAnio() {
    this.resultadosEreService.obtenerEvaluacionesEstudiantePorAnio(this.anioEscolar).subscribe({
      next: (response: any) => {
        this.evaluaciones = response.data;
        this.rindioEvaluaciones = this.evaluaciones.length > 0;
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
          this.mostrarEstadisticaCursos();
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

  mostrarEstadisticaCursos() {
    if (this.resultado.length == 0) {
      return;
    }

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    const areas = [];
    const aciertos = [];
    const desaciertos = [];
    const blancos = [];
    this.resultado.forEach((item: any) => {
      areas.push(item['cCursoNombre']);
      aciertos.push(item['iCantidadCorrectas']);
      desaciertos.push(item['iCantidadIncorrectas']);
      blancos.push(item['iEnBlanco']);
    });

    this.data_bar = {
      labels: areas,
      datasets: [
        {
          label: 'ACIERTOS',
          backgroundColor: documentStyle.getPropertyValue('--blue-500'),
          hoverBackgroundColor: documentStyle.getPropertyValue('--blue-400'),
          data: aciertos,
        },
        {
          label: 'DESACIERTOS',
          backgroundColor: documentStyle.getPropertyValue('--red-500'),
          hoverBackgrounfColor: documentStyle.getPropertyValue('--red-400'),
          data: desaciertos,
        },
        {
          label: 'EN BLANCO',
          backgroundColor: documentStyle.getPropertyValue('--yellow-500'),
          hoverBackgroundColor: documentStyle.getPropertyValue('--yellow-400'),
          data: blancos,
        },
      ],
    };

    this.options_bar = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            stepSize: 1,
          },
        },
      },
    };
  }
}
