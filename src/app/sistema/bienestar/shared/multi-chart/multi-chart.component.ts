import { PrimengModule } from '@/app/primeng.module';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-multi-chart',
  standalone: true,
  imports: [PrimengModule],
  templateUrl: './multi-chart.component.html',
  styleUrl: './multi-chart.component.scss',
})
export class MultiChartComponent implements OnInit, OnChanges {
  @Input() data_chart: any;
  data_formateada: any;

  formChart: FormGroup;

  GRAFICO_BARRA_VERTICAL: number = 1;
  GRAFICO_BARRA_HORIZONTAL: number = 2;
  GRAFICO_CIRCULAR: number = 3;

  options_bar_vertical: any;
  options_bar_horizontal: any;
  options_pie: any;

  total_cantidad: number = 0;

  tipos_graficos: Array<object> = [
    {
      label: 'BARRAS VERTICALES',
      value: this.GRAFICO_BARRA_VERTICAL,
    },
    {
      label: 'BARRAS HORIZONTALES',
      value: this.GRAFICO_BARRA_HORIZONTAL,
    },
    {
      label: 'GRÁFICO CIRCULAR',
      value: this.GRAFICO_CIRCULAR,
    },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.formChart = this.fb.group({
      iTipoGrafico: [this.GRAFICO_BARRA_HORIZONTAL],
    });

    if (this.data_chart) {
      this.formatearGraficos();
    }
  }

  ngOnChanges(): void {
    if (this.data_chart) {
      this.formatearGraficos();
      this.data_formateada = this.formatearDataPrimeChart(this.data_chart);
    }
  }

  formatearGraficos() {
    /* Si tiene menos de 4 opciones, usar gráfico circular */
    if (this.data_chart.length < 4) {
      this.formChart?.get('iTipoGrafico').setValue(this.GRAFICO_CIRCULAR);
    } else {
      /* Si tiene opciones de menos de 10 caracteres, usar gráfico vertical */
      const opcion_max_length = this.data_chart
        .map((item: any) => item.opcion?.length || item.alternativa?.length)
        .reduce((a: any, b: any) => (a > b ? a : b));
      if (opcion_max_length < 10) {
        this.formChart?.get('iTipoGrafico').setValue(this.GRAFICO_BARRA_VERTICAL);
      }
    }

    this.options_bar_vertical = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            display: true,
            autoSkip: false,
          },
          grid: {
            display: false,
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
          offset: true,
          grid: {
            color: function (context) {
              if (context?.tick && context.tick?.value == 0) {
                return 'rgba(0, 0, 0)';
              }
              return 'rgba(0, 0, 0, 0.1)';
            },
          },
        },
      },
    };
    this.options_bar_horizontal = {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
          offset: true,
          grid: {
            color: function (context) {
              if (context?.tick && context.tick?.value == 0) {
                return 'rgba(0, 0, 0)';
              }
              return 'rgba(0, 0, 0, 0.1)';
            },
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            display: true,
            autoSkip: false,
          },
          min: 0,
          grid: {
            display: false,
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
  }

  formatearDataPrimeChart(resumen: any) {
    const documentStyle = getComputedStyle(document.documentElement);

    const opciones = resumen.map((item: any) => item.opcion || item.alternativa);
    const cantidad = resumen.map((item: any) => item.cantidad);

    this.total_cantidad = resumen.reduce((a: any, b: any) => a + b.cantidad, 0);

    const colorVars = [
      '--red-500',
      '--orange-500',
      '--yellow-500',
      '--green-500',
      '--teal-500',
      '--cyan-500',
      '--blue-500',
      '--indigo-500',
    ];

    const hoverColorVars = [
      '--red-400',
      '--orange-400',
      '--yellow-400',
      '--green-400',
      '--teal-400',
      '--cyan-400',
      '--blue-400',
      '--indigo-400',
    ];

    const cantidad_opciones = opciones.length;
    // Genera el array de colores según la cantidad de opciones
    const backgroundColors = opciones.map((_: any, idx: number) =>
      documentStyle.getPropertyValue(this.getColorIndex(idx, cantidad_opciones, colorVars))
    );
    const hoverBackgroundColors = opciones.map((_: any, idx: number) =>
      documentStyle.getPropertyValue(this.getColorIndex(idx, cantidad_opciones, hoverColorVars))
    );

    return {
      labels: opciones,
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

  getColorIndex(index: number, items: number, array_colores: string[]): string {
    const total_colores = array_colores.length;
    if (items <= total_colores) {
      const posicion = Math.round((index * (total_colores - 1)) / (items - 1));
      return array_colores[posicion];
    } else {
      return array_colores[index % total_colores];
    }
  }

  plugin_pie = [
    {
      beforeDraw: chart => {
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
            // ctx.fillText(
            //     chart.data.labels[index] +
            //         ' (' +
            //         chart.data.datasets[0].data[index] +
            //         ')',
            //     xLine + extraLine + plusFivePx,
            //     yLine
            // )
            const texto: string = chart.data.labels[index];
            const cantidad: string = '(' + chart.data.datasets[0].data[index] + ')';
            const texto_array: Array<string> = texto.split(/[\s-]+/);
            const line_height = 10;
            texto_array.forEach((item: string, index: number) => {
              ctx.fillText(
                index == texto_array.length - 1 ? item + ' ' + cantidad : item,
                xLine + extraLine + plusFivePx,
                yLine + line_height * index
              );
            });
          });
        });
      },
    },
  ];

  plugin_bar_vertical = [
    {
      beforeDraw: chart => {
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
            ctx.fillText(data, bar.x - 5, bar.y - 5);
          });
        });
      },
    },
  ];

  plugin_bar_horizontal = [
    {
      beforeDraw: chart => {
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
            ctx.fillText(data, bar.x + 10, bar.y + 5);
          });
        });
      },
    },
  ];
}
