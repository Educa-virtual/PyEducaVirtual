import { Injectable } from '@angular/core';
import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CalendarioService {
  private env = environment.backendApi;

  constructor(private http: HttpClient) {}

  obtenerCalendarioAcademico(datos) {
    return this.http.post(`${this.env}/acad/obtenerCalendario`, datos);
  }

  obtenerCurriculaHorario(datos) {
    return this.http.post(`${this.env}/docente/buscar_curso/curriculaHorario`, datos);
  }
}
