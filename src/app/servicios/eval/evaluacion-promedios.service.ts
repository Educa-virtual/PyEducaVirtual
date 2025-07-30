import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';
import { Observable } from 'rxjs';

const baseUrl = environment.backendApi;

@Injectable({
  providedIn: 'root',
})
export class EvaluacionPromediosService {
  constructor(private http: HttpClient) {}

  guardarConclusionxiEvaluacionIdxiEstudianteId(data): Observable<any> {
    return this.http.post(`${baseUrl}/evaluaciones/evaluacion-promedios`, data);
  }
}
