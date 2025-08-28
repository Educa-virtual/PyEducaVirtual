import { Component, OnInit } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { MenuItem, MessageService } from 'primeng/api';
import { ReporteProgresoService } from './services/reporte-progreso.service';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { firstValueFrom } from 'rxjs';

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
        this.reporteProgresoService.obtenerReporte(this.iYAcadId)
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
  /*descargarReporte() {
          this.reporteProgresoService.existeMatriculaPorAnio(this.iYAcadId).subscribe({
              next: (responsex: any) => {
                  if (responsex.data.existe) {
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
                  } else {
                      this.messageService.add({
                          severity: 'error',
                          summary: 'No existe matricula',
                          detail: 'No hay una matricula registrada para el anio seleccionado',
                      });
                  }
              },
              error: (err) => {
                  this.messageService.add({
                      severity: 'error',
                      summary: 'Problema al descargar el archivo',
                      detail: err.error.message || 'Error desconocido',
                  });
              },
          });
      }*/
}
