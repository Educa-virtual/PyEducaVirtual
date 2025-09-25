import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';
import { Observable } from 'rxjs';

const baseUrl = environment.backendApi;

@Injectable({
  providedIn: 'root',
})
export class EvaluacionRespuestasService {
  constructor(private http: HttpClient) {}

  guardarEvaluacionRespuestasxiEvaluacionIdxiEstudianteId(data): Observable<any> {
    return this.http.post(
      `${baseUrl}/evaluaciones/evaluacion/estudiantes/guardarRespuestaxiEstudianteId`,
      data
    );
  }
}
