import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApoderadoService {
  private urlBackendApi = environment.backendApi;
  private http = inject(HttpClient);

  constructor() {}

  obtenerEstudiantesApoderado() {
    return this.http.get(`${this.urlBackendApi}/apo/estudiantes`);
  }

  obtenerMatriculasEstudiante(iEstudianteId: any, anio: any) {
    return this.http.get(
      `${this.urlBackendApi}/acad/estudiantes/${iEstudianteId}/matriculas?anio=${anio}`
    );
  }
}
