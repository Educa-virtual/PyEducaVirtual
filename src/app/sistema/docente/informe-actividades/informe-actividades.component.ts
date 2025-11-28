import { Component, OnInit, inject } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { ToolbarPrimengComponent } from '@/app/shared/toolbar-primeng/toolbar-primeng.component';
import { GeneralService } from '@/app/servicios/general.service';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { MessageService } from 'primeng/api';
import { InformesService } from './service/informes.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-informe-actividades',
  standalone: true,
  imports: [PrimengModule, ToolbarPrimengComponent],
  templateUrl: './informe-actividades.component.html',
  styleUrl: './informe-actividades.component.scss',
})
export class InformeActividadesComponent implements OnInit {
  private conexion = inject(GeneralService);
  private servicioLocal = inject(ConstantesService);

  iSedeId: number;
  iDocenteId: number;
  iYAcadId: number;
  iIieeId: number;
  iPersId: number;
  data: any; // Almacena los datos iniciales de la tabla

  constructor(
    private messageService: MessageService,
    private informesService: InformesService
  ) {
    this.iSedeId = this.servicioLocal.iSedeId;
    this.iDocenteId = this.servicioLocal.iDocenteId;
    this.iYAcadId = this.servicioLocal.iYAcadId;
    this.iIieeId = this.servicioLocal.iIieeId;
    this.iPersId = this.servicioLocal.iPersId;
  }

  ngOnInit(): void {
    this.obtenerSesionesArea();
  }

  // Obtiene una lista de las sesiones por area del docente
  obtenerSesionesArea() {
    const params = {
      petition: 'post',
      group: 'aula-virtual',
      prefix: 'sesiones-aprendizaje',
      ruta: 'sesiones-area',
      data: {
        iDocenteId: this.iDocenteId,
        iYAcadId: this.iYAcadId,
        iSedeId: this.iSedeId,
      },
    };

    this.conexion.getRecibirDatos(params).subscribe({
      next: response => {
        const datos = response.data;
        const ordenarNombre = this.ordenarNombre('cCursoNombre', datos);
        this.data = ordenarNombre;
      },
      error: error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }

  ordenarNombre(campo: any, datos: any) {
    datos.sort((a: any, b: any) => {
      if (a[campo] < b[campo]) return -1;
      if (a[campo] > b[campo]) return 1;

      return 0;
    });
    return datos;
  }
  descargarArchivo(archivo: any) {
    const params = {
      petition: 'post',
      group: 'asi',
      prefix: 'asistencia',
      ruta: 'descargar-justificacion',
      data: {
        cJustificar: archivo,
      },
    };

    this.conexion.getRecibirMultimedia(params).subscribe({
      next: async (response: Blob) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.click();
      },
      error: error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }

  async descargarInforme(item) {
    const params = {
      data: {
        iContenidoSemId: item.iContenidoSemId,
        cContenidoSemTitulo: item.cContenidoSemTitulo,
        cContenidoSemNumero: item.cContenidoSemNumero,
        cCursoNombre: item.cCursoNombre,
        cGradoAbreviacion: item.cGradoAbreviacion,
        cSeccionNombre: item.cSeccionNombre,
        cNumeroPeriodo: item.cNumeroPeriodo,
        iIieeId: this.iIieeId,
        iYAcadId: this.iYAcadId,
        iPersId: this.iPersId,
      },
    };

    try {
      const response: Blob = await firstValueFrom(this.informesService.generarReportePdf(params));
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
