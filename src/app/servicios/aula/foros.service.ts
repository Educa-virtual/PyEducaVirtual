import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';
import { Observable } from 'rxjs';

const baseUrl = environment.backendApi;

@Injectable({
  providedIn: 'root',
})
export class ForosService {
  constructor(private http: HttpClient) {}

  guardarForos(data): Observable<any> {
    return this.http.post(`${baseUrl}/aula-virtual/foros`, data);
  }

  actualizarForosxiForoId(iForoId: string | number, params): Observable<any> {
    return this.http.put(`${baseUrl}/aula-virtual/foros/${iForoId}`, params);
  }

  obtenerReporteEstudiantesRetroalimentacion(params: {
    iIeCursoId;
    iYAcadId;
    iSedeId;
    iSeccionId;
    iNivelGradoId;
    iForoId;
  }) {
    return this.http.post(
      `${baseUrl}/aula-virtual/foros/obtenerReporteEstudiantesRetroalimentacion`,
      params
    );
  }
}
