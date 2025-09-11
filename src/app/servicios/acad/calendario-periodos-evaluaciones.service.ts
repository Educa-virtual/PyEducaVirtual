import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@/environments/environment';
import { Observable } from 'rxjs';

const baseUrl = environment.backendApi;

@Injectable({
  providedIn: 'root',
})
export class CalendarioPeriodosEvalacionesService {
  constructor(private http: HttpClient) {}

  obtenerPeriodosxiYAcadIdxiSedeIdxFaseRegular(iYAcadId, iSedeId, params): Observable<any> {
    const headers = new HttpHeaders().set('x-cache', 'true').set('x-cache-duration', '3600000'); // 60 minutos

    return this.http.get(
      `${baseUrl}/acad/calendario-periodos-evaluaciones/${iYAcadId}/sede/${iSedeId}`,
      {
        params,
        headers,
      }
    );
  }
  guardarCalendarioPeriodosEvalaciones(data: any) {
    return this.http.post(`${baseUrl}/acad/calendario-periodos-evaluaciones`, data);
  }
}
