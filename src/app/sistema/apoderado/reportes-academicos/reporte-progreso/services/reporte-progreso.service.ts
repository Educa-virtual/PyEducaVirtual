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

  obtenerReporteProgreso(iMatrId) {
    return this.http.get(
      `${this.urlBackendApi}/acad/apoderados/reportes-academicos/progreso/${iMatrId}`
    );
  }
}
