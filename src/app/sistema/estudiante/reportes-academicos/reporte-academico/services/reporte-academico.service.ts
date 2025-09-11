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

  obtenerCursosPorMatricula(iYAcadId: number) {
    return this.http.get(
      `${this.urlBackendApi}/acad/estudiantes/matriculas/anio-academico/${iYAcadId}/cursos`
    );
  }

  obtenerResultadosPorCurso(iYAcadId: number, iIeCursoId: any) {
    return this.http.get(
      `${this.urlBackendApi}/acad/estudiantes/matriculas/anio-academico/${iYAcadId}/cursos/${iIeCursoId}/resultados`
    );
  }
}
