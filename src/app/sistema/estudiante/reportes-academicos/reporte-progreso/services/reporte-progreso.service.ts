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

  generarReportePdfEstudiante(iYAcadId: number) {
    return this.http.get(
      `${this.urlBackendApi}/acad/estudiantes/reportes-academicos/progreso/${iYAcadId.toString()}/pdf`,
      {
        responseType: 'blob',
      }
    );
  }

  generarReportePdfDirector(cPersDocumento, iYAcadId: number) {
    return this.http.get(
      `${this.urlBackendApi}/acad/directores/reportes-academicos/progreso/${iYAcadId.toString()}/estudiante/${cPersDocumento}/pdf`,
      {
        responseType: 'blob',
      }
    );
  }

  generarReportePdfApoderado(iMatrId: string) {
    return this.http.get(
      `${this.urlBackendApi}/acad/apoderados/reportes-academicos/progreso/${iMatrId}/pdf`,
      {
        responseType: 'blob',
      }
    );
  }

  obtenerReporteDirector(cPersDocumento, iYAcadId: number) {
    return this.http.get(
      `${this.urlBackendApi}/acad/directores/reportes-academicos/progreso/${iYAcadId.toString()}/estudiante/${cPersDocumento}`
    );
  }

  obtenerReporteEstudiante(iYAcadId: number) {
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
