import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PeriodoEvaluacionesService {
  endPoint = `${environment.backendApi}/acad/periodo-evaluaciones`;
  constructor(private http: HttpClient) {}

  getPeriodosEvaluaciones() {
    return this.http.get(`${this.endPoint}/getPeriodoEvaluaciones`);
  }

  processConfigCalendario(data) {
    return this.http.post(`${this.endPoint}/processConfigCalendario`, data);
  }
}
