import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ResultadosEreService {
  private urlBackendApi = environment.backendApi;
  private http = inject(HttpClient);

  constructor() {}

  obtenerEvaluacionesPorEstudiante() {
    return this.http.get(`${this.urlBackendApi}/ere/Evaluaciones/estudiante`);
  }

  obtenerAreasPorEvaluacionEstudiante(iEvaluacionId: any) {
    return this.http.get(
      `${this.urlBackendApi}/ere/evaluaciones/${iEvaluacionId}/estudiante/areas`
    );
  }

  obtenerResultadoEvaluacionEstudiante(iEvaluacionId: any, iCursoId: any) {
    return this.http.get(
      `${this.urlBackendApi}/ere/evaluaciones/${iEvaluacionId}/estudiante/areas/${iCursoId}/resultado`
    );
  }
}
