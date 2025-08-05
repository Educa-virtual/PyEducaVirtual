import { Component } from '@angular/core';

import { ChartOptions } from 'chart.js';

import { PrimengModule } from '@/app/primeng.module';
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component';

@Component({
  selector: 'app-dashboard-indicadores',
  standalone: true,
  imports: [PrimengModule, ContainerPageComponent],
  templateUrl: './dashboard-indicadores.component.html',
  styleUrl: './dashboard-indicadores.component.scss',
})
export class DashboardIndicadoresComponent {
  indicadores: {
    titulo: string;
    chartType: 'bar' | 'line' | 'scatter' | 'bubble' | 'pie' | 'doughnut' | 'polarArea' | 'radar';
    chartData: any;
    chartOptions: any;
  }[] = [
    {
      titulo: 'Indicador de Desempeño',
      chartType: 'bar',
      chartData: {
        labels: ['Alto', 'Medio', 'Bajo'],
        datasets: [
          {
            label: 'Estudiantes',
            data: [45, 30, 25],
            backgroundColor: ['#4caf50', '#ffc107', '#f44336'],
          },
        ],
      },
      chartOptions: this.getDefaultOptions('Desempeño Académico'),
    },
    {
      titulo: 'Indicador de Faltas y Tardanzas',
      chartType: 'doughnut',
      chartData: {
        labels: ['Faltas', 'Tardanzas'],
        datasets: [
          {
            data: [70, 30],
            backgroundColor: ['#f44336', '#ff9800'],
          },
        ],
      },
      chartOptions: this.getDefaultOptions('Faltas y Tardanzas'),
    },
    {
      titulo: 'Indicador de Rendimiento',
      chartType: 'line',
      chartData: {
        labels: ['Bimestre 1', 'Bimestre 2', 'Bimestre 3', 'Bimestre 4'],
        datasets: [
          {
            label: 'Promedio General',
            data: [13.5, 14.2, 14.8, 15.1],
            fill: false,
            borderColor: '#42A5F5',
            tension: 0.4,
          },
        ],
      },
      chartOptions: this.getDefaultOptions('Rendimiento Académico'),
    },
    {
      titulo: 'Indicador de Deserción',
      chartType: 'pie',
      chartData: {
        labels: ['Matriculados', 'Desertores'],
        datasets: [
          {
            data: [95, 5],
            backgroundColor: ['#2196f3', '#e91e63'],
          },
        ],
      },
      chartOptions: this.getDefaultOptions('Deserción Escolar'),
    },
    {
      titulo: 'Indicador de Matriculados',
      chartType: 'bar',
      chartData: {
        labels: ['Inicial', 'Primaria', 'Secundaria'],
        datasets: [
          {
            label: 'Estudiantes',
            data: [120, 300, 250],
            backgroundColor: ['#3f51b5', '#009688', '#8bc34a'],
          },
        ],
      },
      chartOptions: this.getDefaultOptions('Estudiantes Matriculados'),
    },
  ];

  getDefaultOptions(title: string): ChartOptions {
    return {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
        title: {
          display: true,
          text: title,
          font: {
            size: 16,
          },
        },
      },
    };
  }
}
