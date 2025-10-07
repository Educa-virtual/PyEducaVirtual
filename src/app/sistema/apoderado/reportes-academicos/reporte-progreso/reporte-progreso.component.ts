import { Component, OnInit } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { MenuItem, MessageService } from 'primeng/api';
import { TablaReporteProgresoComponent } from '@/app/sistema/estudiante/reportes-academicos/tabla-reporte-progreso/tabla-reporte-progreso.component';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { ReporteProgresoService } from './services/reporte-progreso.service';

@Component({
  selector: 'app-reporte-progreso',
  standalone: true,
  imports: [PrimengModule, TablaReporteProgresoComponent],
  templateUrl: './reporte-progreso.component.html',
  styleUrl: './reporte-progreso.component.scss',
})
export class ReporteProgresoComponent implements OnInit {
  breadCrumbItems: MenuItem[];
  breadCrumbHome: MenuItem;
  iYAcadId: number;
  courses: any[] = [];

  dataEstudiantes: any[] = [];
  dataMatriculas: any[] = [];
  estudianteSeleccionado: any;
  matriculaSeleccionada: any;

  constructor(
    private reporteProgresoService: ReporteProgresoService,
    private messageService: MessageService,
    private store: LocalStoreService
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

    this.obtenerEstudiantesApoderado();
  }

  obtenerEstudiantesApoderado() {
    this.reporteProgresoService.obtenerEstudiantesApoderado().subscribe({
      next: (response: any) => {
        this.dataEstudiantes = response.data;
      },
      error: err => {
        this.messageService.add({
          severity: 'error',
          summary: 'Problema al obtener estudiantes',
          detail: err.error.message || 'Error desconocido',
        });
      },
    });
  }
  //cGradoAbreviacion, cSeccionNombre, cNivelTipoNombre, cIieeNombre, iYearId
  obtenerMatriculasEstudiante() {
    this.reporteProgresoService.obtenerMatriculasEstudiante(this.estudianteSeleccionado).subscribe({
      next: (response: any) => {
        this.dataMatriculas = response.data.map((matricula: any) => ({
          ...matricula,
          cMatriculaMostrar:
            `${matricula.iYearId} - ${matricula.cGradoAbreviacion} ${matricula.cSeccionNombre} - ${matricula.cNivelTipoNombre.replace('Educación ', '')} - I.E. ${matricula.cIieeNombre}`.trim(),
        }));
      },
      error: err => {
        this.messageService.add({
          severity: 'error',
          summary: 'Problema al obtener matrículas',
          detail: err.error.message || 'Error desconocido',
        });
      },
    });
  }

  obtenerReporteAcademicoEstudiante() {
    this.reporteProgresoService.obtenerReporteProgreso(this.matriculaSeleccionada).subscribe({
      next: (response: any) => {
        this.courses = response.data;
        if (this.courses.length == 0) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Sin datos',
            detail: 'No hay datos para la matrícula seleccionada',
          });
        }
      },
      error: err => {
        this.messageService.add({
          severity: 'error',
          summary: 'Problema al obtener reportes',
          detail: err.error.message || 'Error desconocido',
        });
      },
    });
  }
}
