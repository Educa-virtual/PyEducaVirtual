import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';
import { Observable } from 'rxjs';

const baseUrl = environment.backendApi;

@Injectable({
  providedIn: 'root',
})
export class CalendarioAcademicosService {
  constructor(private http: HttpClient) {}

  obtenerCalendarioAcademicosxiSedeIdxiYAcadId(iSedeId, iYAcadId, params): Observable<any> {
    return this.http.get(`${baseUrl}/acad/calendario-academicos/${iYAcadId}/sede/${iSedeId}`, {
      params,
    });
  }

  guardarCalendarioAcademicos(data: any) {
    return this.http.post(`${baseUrl}/acad/calendario-academicos`, data);
  }
}
