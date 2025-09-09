import { Component, OnInit } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { MenuItem, MessageService } from 'primeng/api';
import { ReporteProgresoService } from './services/reporte-progreso.service';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { firstValueFrom } from 'rxjs';

/*interface Competencia {
    id: number;
    nombre: string;
    notas: string[]; // notas por periodo (periodo1, periodo2, periodo3...)
}*/

/*interface Curso {
    id: number;
    nombre: string;
    periodos: number[]; // resumen por periodo (periodo1, periodo2, periodo3)
    competencias: Competencia[];
}*/

@Component({
  selector: 'app-reporte-progreso',
  standalone: true,
  imports: [PrimengModule],
  templateUrl: './reporte-progreso.component.html',
  styleUrl: './reporte-progreso.component.scss',
})
export class ReporteProgresoComponent implements OnInit {
  breadCrumbItems: MenuItem[];
  breadCrumbHome: MenuItem;
  iYAcadId: number;
  anioEscolar: number;
  //Nuevas var
  courses: any[] = [];

  // Control de filas expandidas (por id de curso)
  expanded: Record<number, boolean> = {};
  singleOpen: boolean = false;

  constructor(
    private reporteProgresoService: ReporteProgresoService,
    private messageService: MessageService,
    private store: LocalStoreService
  ) {}

  toggle(id: number) {
    if (this.singleOpen) {
      // Cierra todos excepto el seleccionado
      Object.keys(this.expanded).forEach(key => {
        const k = Number(key);
        this.expanded[k] = k === id ? !this.expanded[k] : false;
      });
    } else {
      this.expanded[id] = !this.expanded[id];
    }
  }

  /** Helper para mostrar una nota segura (si no existe, devuelve '-') */
  /*nota(c: Competencia, index: number) {
        return c.notas[index] ?? '-';
    }*/

  /** trackBy para optimizar ngFor */
  /*trackByCourse(index: number, curso: Curso) {
        return curso.id;
    }*/

  /** trackBy para competencias */
  /*trackByCompetencia(index: number, comp: Competencia) {
        return comp.id;
    }*/

  ngOnInit() {
    this.iYAcadId = this.store.getItem('dremoiYAcadId');
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

    this.obtenerReporte();
  }

  obtenerReporte() {
    this.reporteProgresoService.obtenerReporte(this.iYAcadId).subscribe({
      next: (response: any) => {
        this.courses = response.data;
        this.courses.forEach(c => (this.expanded[c.iIeCursoId] = true));
      },
      error: err => {
        this.messageService.add({
          severity: 'error',
          summary: 'Problema al obtener reporte',
          detail: err.error.message || 'Error desconocido',
        });
      },
    });
  }

  async descargarReporte() {
    try {
      const respMatricula: any = await firstValueFrom(
        this.reporteProgresoService.existeMatriculaPorAnio(this.iYAcadId)
      );
      if (!respMatricula?.data?.existe) {
        this.messageService.add({
          severity: 'error',
          summary: 'No existe matrícula',
          detail: 'No hay una matrícula registrada para el año seleccionado',
        });
        return;
      }

      const response: Blob = await firstValueFrom(
        this.reporteProgresoService.generarReportePdf(this.iYAcadId)
      );
      const link = document.createElement('a');
      link.href = URL.createObjectURL(response);
      link.download = 'Reporte de progreso.pdf';
      link.click();
    } catch (err: any) {
      this.messageService.add({
        severity: 'error',
        summary: 'Problema al descargar el archivo',
        detail: err?.error?.message || 'Error desconocido',
      });
    }
  }
}
