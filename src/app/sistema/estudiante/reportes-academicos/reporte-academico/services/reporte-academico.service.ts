import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReporteAcademicoService {
  private urlBackendApi = environment.backendApi;
  private http = inject(HttpClient);

  constructor() {}

  obtenerAreasPorMatricula(iYAcadId: number) {
    return this.http.get(
      `${this.urlBackendApi}/acad/estudiantes/matriculas/anio/${iYAcadId}/areas`
    );
  }
}
