import { Injectable } from '@angular/core';
import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CalendarioService {
  private urlBackendApi = environment.backendApi;

  constructor(private http: HttpClient) {}

  obtenerDiasFestivos() {
    return this.http.post(`${this.urlBackendApi}/docente/asistencia/obtenerFestividad`, {});
  }

  obtenerCalendarioAcademico() {
    return this.http.get(`${this.urlBackendApi}/acad/estudiantes/calendario-academico`);
  }

  /*obtenerAreasCurriculares() {
        return this.http.get(
            `${this.urlBackendApi}/acad/estudiantes/matriculas/cursos`
        )
    }*/
}
