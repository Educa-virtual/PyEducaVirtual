import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@/environments/environment';
import { Observable } from 'rxjs';

const baseUrl = environment.backendApi;

@Injectable({
  providedIn: 'root',
})
export class TipoExperienciaAprendizajeService {
  constructor(private http: HttpClient) {}

  obtenerTipoExperienciaAprendizaje(params): Observable<any> {
    const headers = new HttpHeaders().set('x-cache', 'true').set('x-cache-duration', '300000'); // 5 minutos

    return this.http.get(`${baseUrl}/aula-virtual/tipo-experiencia-aprendizaje`, {
      params,
      headers,
    });
  }
}
