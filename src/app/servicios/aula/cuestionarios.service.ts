import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';
import { Observable } from 'rxjs';

const baseUrl = environment.backendApi;

@Injectable({
  providedIn: 'root',
})
export class CuestionariosService {
  constructor(private http: HttpClient) {}

  guardarCuestionario(data): Observable<any> {
    return this.http.post(`${baseUrl}/aula-virtual/cuestionarios`, data);
  }

  actualizarCuestionarioxiCuestionarioId(
    iCuestionarioId: string | number,
    params
  ): Observable<any> {
    return this.http.put(`${baseUrl}/aula-virtual/cuestionarios/${iCuestionarioId}`, params);
  }

  obtenerCuestionarioxiCuestionarioId(iCuestionarioId: string | number, params): Observable<any> {
    return this.http.get(`${baseUrl}/aula-virtual/cuestionarios/${iCuestionarioId}`, {
      params,
    });
  }
}
