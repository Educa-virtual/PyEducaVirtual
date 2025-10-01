import { Component, OnInit } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { MenuItem, MessageService } from 'primeng/api';
import { ReporteProgresoService } from './services/reporte-progreso.service';
import { LocalStoreService } from '@/app/servicios/local-store.service';

import { TablaReporteProgresoComponent } from '../tabla-reporte-progreso/tabla-reporte-progreso.component';

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
  anioEscolar: number;
  courses: any[] = [];

  constructor(
    private reporteProgresoService: ReporteProgresoService,
    private messageService: MessageService,
    private store: LocalStoreService
  ) {}

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
    this.reporteProgresoService.obtenerReporteEstudiante(this.iYAcadId).subscribe({
      next: (response: any) => {
        this.courses = response.data;
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
}
