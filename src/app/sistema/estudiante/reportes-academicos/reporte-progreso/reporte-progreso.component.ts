import { Component, OnInit } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { MenuItem, MessageService } from 'primeng/api';
import { ReporteProgresoService } from './services/reporte-progreso.service';
import { LocalStoreService } from '@/app/servicios/local-store.service';

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
  }

  descargarReporte() {
    this.reporteProgresoService.obtenerReporte(this.iYAcadId).subscribe({
      next: (response: any) => {
        const blob = new Blob([response], {
          type: 'application/pdf',
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.click();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Problema al descargar el archivo',
          detail: 'Error desconocido',
        });
      },
    });
  }
}
