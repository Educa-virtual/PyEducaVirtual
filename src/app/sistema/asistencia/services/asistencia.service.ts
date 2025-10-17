import { Injectable } from '@angular/core';
import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AsistenciaService {
  private urlBackendApi = environment.backendApi;

  constructor(private http: HttpClient) {}

  obtenerAsistenciaGeneralEstudiante(anio, mes) {
    return this.http.get(`${this.urlBackendApi}/asi/asistencia/general/${anio}/${mes}/estudiante`);
  }

  obtenerAsistenciaGeneralEstudianteApoderado(anio, mes, iMatrId) {
    return this.http.get(
      `${this.urlBackendApi}/asi/asistencia/general/${anio}/${mes}/apoderado/estudiante/${iMatrId}`
    );
  }

  obtenerAsistenciaControlEstudiante(fecha) {
    return this.http.get(`${this.urlBackendApi}/asi/asistencia/control/${fecha}/estudiante`);
  }
}
