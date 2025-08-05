import { Component } from '@angular/core';

import { ChartConfiguration, ChartOptions } from 'chart.js';

import { PrimengModule } from '@/app/primeng.module';

@Component({
  selector: 'app-dashboard-indicadores',
  standalone: true,
  imports: [PrimengModule],
  templateUrl: './dashboard-indicadores.component.html',
  styleUrl: './dashboard-indicadores.component.scss',
})
export class DashboardIndicadoresComponent {
  options_bar: ChartOptions;
  options_pie: any;
  options_wordcloud: any;

  chartType: any = 'bar';

  chartData: ChartConfiguration['data'] = {
    labels: ['Enero', 'Febrero', 'Marzo'],
    datasets: [
      {
        label: 'Ventas 2025',
        data: [150, 200, 170],
        backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726'],
      },
    ],
  };

  chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Ventas por Mes',
      },
    },
  };

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
      layout: {
        padding: 10,
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
}
