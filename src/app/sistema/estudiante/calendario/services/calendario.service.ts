import { Injectable } from '@angular/core';
import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CalendarioService {
  private urlBackendApi = environment.backendApi;

  constructor(private http: HttpClient) {}

  obtenerTiposFechasImportantes() {
    return this.http.get(`${this.urlBackendApi}/acad/fechas-importantes/tipos`);
  }

  obtenerCalendarioAcademico(iYAcadId: any) {
    return this.http.get(
      `${this.urlBackendApi}/acad/estudiantes/calendario-academico/anio/${iYAcadId}`
    );
  }
}
