import { Component, OnInit } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { MenuItem, MessageService } from 'primeng/api';
import { ReporteProgresoService } from './services/reporte-progreso.service';

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

  constructor(
    private reporteProgresoService: ReporteProgresoService,
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
  }

  descargarReporte() {
    this.reporteProgresoService.obtenerReporte().subscribe({
      next: (response: any) => {
        const contentDisposition = response.headers?.get?.('content-disposition');
        let fileName = 'Reporte progreso.pdf';
        if (contentDisposition) {
          const match = contentDisposition.match(/filename="?([^"]+)"?/);
          if (match && match[1]) {
            fileName = match[1];
          }
        }
        const blob = new Blob([response.body ? response.body : response], {
          type: 'application/pdf',
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Problema al descargar el archivo',
          detail: error?.error?.message || 'Error desconocido',
        });
      },
    });
  }
}
