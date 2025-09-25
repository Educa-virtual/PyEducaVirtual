import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReporteProgresoService {
  private urlBackendApi = environment.backendApi;
  private http = inject(HttpClient);

  constructor() {}

  generarReportePdf(iYAcadId: number) {
    return this.http.get(
      `${this.urlBackendApi}/acad/estudiantes/reportes-academicos/progreso/${iYAcadId.toString()}/pdf`,
      {
        responseType: 'blob',
      }
    );
  }

  obtenerReporte(iYAcadId: number) {
    return this.http.get(
      `${this.urlBackendApi}/acad/estudiantes/reportes-academicos/progreso/${iYAcadId.toString()}`
    );
  }

  existeMatriculaPorAnio(iYAcadId: number) {
    return this.http.get(
      `${this.urlBackendApi}/acad/estudiantes/matriculas/anio-academico/${iYAcadId.toString()}/existe`
    );
  }
}
