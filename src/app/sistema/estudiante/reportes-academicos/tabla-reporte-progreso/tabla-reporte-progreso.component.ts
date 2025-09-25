import { Component, Input, OnChanges } from '@angular/core';
import { ReporteProgresoService } from '../reporte-progreso/services/reporte-progreso.service';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { PrimengModule } from '@/app/primeng.module';

@Component({
  selector: 'app-tabla-reporte-progreso',
  standalone: true,
  imports: [PrimengModule],
  templateUrl: './tabla-reporte-progreso.component.html',
  styleUrl: './tabla-reporte-progreso.component.scss',
})
export class TablaReporteProgresoComponent implements OnChanges {
  expanded: Record<number, boolean> = {};
  singleOpen: boolean = false;
  @Input() courses: any[] = [];
  @Input() iYAcadId: number;
  @Input() vista: string; //estudiante | director

  constructor(
    private reporteProgresoService: ReporteProgresoService,
    private messageService: MessageService
  ) {}

  ngOnChanges(changes) {
    if (changes.courses?.currentValue) {
      this.courses = changes.courses.currentValue;
      this.courses.forEach(c => (this.expanded[c.iIeCursoId] = true));
    }
  }

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

  async descargarReporteEstudiante() {
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
        this.reporteProgresoService.generarReportePdfEstudiante(this.iYAcadId)
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
