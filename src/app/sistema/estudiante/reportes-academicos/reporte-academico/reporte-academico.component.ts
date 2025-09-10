import { PrimengModule } from '@/app/primeng.module';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { ReporteAcademicoService } from './services/reporte-academico.service';
import { ChartModule } from 'primeng/chart';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-reporte-academico',
  standalone: true,
  imports: [PrimengModule, ChartModule],
  templateUrl: './reporte-academico.component.html',
  styleUrl: './reporte-academico.component.scss',
})
export class ReporteAcademicoComponent implements OnInit {
  breadCrumbItems: MenuItem[];
  breadCrumbHome: MenuItem;
  iYAcadId: number;
  anioEscolar: number;
  iIeCursoId: any;
  cursos: any = [];
  graficos: any[] = [];
  mostrarMensajeSinDatos: boolean = false;

  private colores = [
    'rgba(255, 99, 132, 0.6)',
    'rgba(54, 162, 235, 0.6)',
    'rgba(255, 206, 86, 0.6)',
    'rgba(75, 192, 192, 0.6)',
    'rgba(153, 102, 255, 0.6)',
    'rgba(255, 159, 64, 0.6)',
  ];

  constructor(
    private reporteService: ReporteAcademicoService,
    private messageService: MessageService,
    private store: LocalStoreService
  ) {}

  ngOnInit() {
    this.iYAcadId = this.store.getItem('dremoiYAcadId');
    this.anioEscolar = this.store.getItem('dremoYear');
    this.obtenerCursos();
    this.breadCrumbHome = {
      icon: 'pi pi-home',
      routerLink: '/',
    };
    this.breadCrumbItems = [
      {
        label: 'Reportes académicos',
      },
      {
        label: 'Académico',
      },
    ];
  }

  obtenerCursos() {
    this.reporteService.obtenerCursosPorMatricula(this.iYAcadId).subscribe({
      next: (resp: any) => {
        this.cursos = resp.data;
      },
      error: err => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error en matrícula',
          detail: err.error.messagr || 'No hay una matrícula registrada para el año seleccionado',
        });
      },
    });
  }

  private splitText(text: string, maxLength: number = 40): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    words.forEach(word => {
      if ((currentLine + word).length > maxLength) {
        lines.push(currentLine.trim());
        currentLine = word + ' ';
      } else {
        currentLine += word + ' ';
      }
    });
    if (currentLine) lines.push(currentLine.trim());

    return lines;
  }

  generarReporte() {
    this.reporteService.obtenerResultadosPorCurso(this.iYAcadId, this.iIeCursoId).subscribe({
      next: (response: any) => {
        this.mostrarMensajeSinDatos = true;
        this.graficos = response.data.map((item: any) => {
          const valores = item.resultado.map((n: string) => Number(n));
          return {
            data: {
              labels: item.periodos,
              datasets: [
                {
                  label: item.competencia,
                  data: valores,
                  backgroundColor: valores.map(
                    (_: any, i: number) => this.colores[i % this.colores.length]
                  ),
                  borderColor: valores.map((_: any, i: number) =>
                    this.colores[i % this.colores.length].replace('0.6', '1')
                  ),
                  borderWidth: 1,
                },
              ],
            },
            options: {
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: this.splitText(item.competencia, 40),
                  font: { size: 18 },
                },
                legend: {
                  display: false,
                },
                datalabels: {
                  anchor: 'end',
                  align: 'end',
                  offset: -6,
                  color: '#000',
                  formatter: (value: number) => {
                    return value < 10 ? `0${value}` : value;
                  },
                },
                tooltip: {
                  callbacks: {
                    label: (context: any) => {
                      const value = context.raw;
                      return value.toString().padStart(2, '0');
                    },
                  },
                },
              },
              scales: {
                x: {
                  ticks: { color: '#495057' },
                  grid: { color: '#ebedef' },
                },
                y: {
                  ticks: {
                    color: '#495057',
                    callback: (value: number | string) => {
                      return value.toString().padStart(2, '0');
                    },
                  },
                  grid: { color: '#ebedef' },
                },
              },
            },
            plugins: [ChartDataLabels],
          };
        });
        console.log(this.graficos);
      },
      error: err => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error en matrícula',
          detail: err.error.messagr || 'No hay una matrícula registrada para el año seleccionado',
        });
      },
    });
  }
}
