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

  obtenerReporte(iYAcadId: number) {
    return this.http.get(`${this.urlBackendApi}/acad/estudiantes/reportes-academicos/progreso`, {
      params: { iYAcadId: iYAcadId.toString() },
      responseType: 'blob',
    });
  }

  existeMatriculaPorAnio(iYAcadId: number) {
    return this.http.get(
      `${this.urlBackendApi}/acad/estudiantes/matriculas/anio-academico/${iYAcadId.toString()}/existe`
    );
  }
}
