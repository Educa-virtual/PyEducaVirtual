import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InformesService {
  private urlBackendApi = environment.backendApi;
  private http = inject(HttpClient);
  constructor() {}

  generarReportePdf(parametros: any) {
    const datos = parametros.data;
    return this.http.post(
      `${this.urlBackendApi}/aula-virtual/sesiones-aprendizaje/programacion-informacion-area`,
      datos,
      {
        responseType: 'blob',
      }
    );
  }
}
