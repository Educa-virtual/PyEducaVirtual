import { PrimengModule } from '@/app/primeng.module';
import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { ResultadosEreService } from './services/resultados-ere.service';

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
  evaluaciones: any;
  evaluacionSeleccionada: any = null;
  areas: any;
  areaSeleccionada: any = null;
  resultado: any = null;
  constructor(
    private resultadosEreService: ResultadosEreService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
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
    this.obtenerEvaluacionesPorEstudiante();
  }

  obtenerEvaluacionesPorEstudiante() {
    this.resultadosEreService.obtenerEvaluacionesPorEstudiante().subscribe({
      next: (response: any) => {
        this.evaluaciones = response.data;
        this.areaSeleccionada = null;
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

  obtenerAreasPorEvaluacionEstudiante() {
    this.resultadosEreService
      .obtenerAreasPorEvaluacionEstudiante(this.evaluacionSeleccionada)
      .subscribe({
        next: (response: any) => {
          this.areas = response.data;
        },
        error: err => {
          this.messageService.add({
            severity: 'error',
            summary: 'Problema al obtener áreas',
            detail: err.error.message || 'Error desconocido',
          });
        },
      });
  }

  generarReporte() {
    if (this.evaluacionSeleccionada == null) {
      alert('Seleccione una evaluación');
      return;
    }
    if (this.areaSeleccionada == null) {
      alert('Seleccione un área');
      return;
    }
    console.log(this.areaSeleccionada);
    this.resultadosEreService
      .obtenerResultadoEvaluacionEstudiante(this.evaluacionSeleccionada, this.areaSeleccionada)
      .subscribe({
        next: (response: any) => {
          this.resultado = response.data;
        },
        error: err => {
          this.messageService.add({
            severity: 'error',
            summary: 'Problema al obtener resultado',
            detail: err.error.message || 'Error desconocido',
          });
        },
      });
  }
}
