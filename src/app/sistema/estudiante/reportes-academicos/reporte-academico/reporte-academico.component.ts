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

  coloresPorLetra: Record<string, string> = {
    A: 'rgba(40,167,69,0.6)', // verde claro semitransparente
    B: 'rgba(54,132,235,0.6)', // azul
    C: 'rgba(255,159,64,0.6)', // naranja
    AD: 'rgba(220,53,69,0.6)', // rojo
    DEFAULT: 'rgba(108,117,125,0.6)',
  };

  // Borde (opcional)
  bordePorLetra: Record<string, string> = {
    A: 'rgba(40,167,69,1)',
    B: 'rgba(54,132,235,1)',
    C: 'rgba(255,159,64,1)',
    AD: 'rgba(220,53,69,1)',
    DEFAULT: 'rgba(108,117,125,1)',
  };

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

  letraAOrdinal(letra: string) {
    if (!letra && letra !== '') return 0;
    const l = letra.toString().trim().toUpperCase();
    switch (l) {
      case 'AD':
        return 4;
      case 'A':
        return 3;
      case 'B':
        return 2;
      case 'C':
        return 1;
      default:
        return 0; // valor desconocido -> 0 (no visible dentro de 1..4)
    }
  }

  ordinalALetra(v: number) {
    switch (Number(v)) {
      case 4:
        return 'AD';
      case 3:
        return 'A';
      case 2:
        return 'B';
      case 1:
        return 'C';
      default:
        return '';
    }
  }

  generarReporte() {
    this.reporteService.obtenerResultadosPorCurso(this.iYAcadId, this.iIeCursoId).subscribe({
      next: (response: any) => {
        this.mostrarMensajeSinDatos = true;
        this.graficos = response.data.map((item: any) => {
          const letterValues: string[] = (item.resultado || []).map((s: any) =>
            s == null ? '' : String(s).trim().toUpperCase()
          );

          const ordinalValues = letterValues.map(l => this.letraAOrdinal(l));
          const bgColors = letterValues.map(
            l => this.coloresPorLetra[l] ?? this.coloresPorLetra['DEFAULT']
          );
          const borderColors = letterValues.map(
            l => this.bordePorLetra[l] ?? this.bordePorLetra['DEFAULT']
          );

          return {
            data: {
              labels: item.periodos,
              datasets: [
                {
                  label: item.competencia,
                  data: ordinalValues,
                  backgroundColor: bgColors,
                  borderColor: borderColors,
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
                legend: { display: false },
                datalabels: {
                  anchor: 'end',
                  align: 'end',
                  offset: -6,
                  color: '#000',
                  formatter: (_value: any, context: any) => {
                    const idx = context.dataIndex;
                    const letra = letterValues[idx] ?? '';
                    return letra || '-';
                  },
                },
                tooltip: {
                  callbacks: {
                    label: (context: any) => {
                      const idx = context.dataIndex;
                      const letra = letterValues[idx] ?? '';
                      return letra || 'Sin dato';
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
                  beginAtZero: true,
                  min: 0,
                  max: 4,
                  ticks: {
                    stepSize: 1,
                    color: '#495057',
                    callback: (value: number | string) => {
                      return this.ordinalALetra(Number(value));
                    },
                  },
                  grid: { color: '#ebedef' },
                },
              },
            },
            plugins: [ChartDataLabels],
          };
        });
      },
      error: err => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error en matrícula',
          detail: err.error?.messagr || 'No hay una matrícula registrada para el año seleccionado',
        });
      },
    });
  }
}
