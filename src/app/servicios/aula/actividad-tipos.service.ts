import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@/environments/environment';
import { map } from 'rxjs';
import { ApiResponse } from '@/app/shared/interfaces/api-response.model';

const baseUrl = environment.backendApi;

@Injectable({
  providedIn: 'root',
})
export class ActividadTiposService {
  constructor(private http: HttpClient) {}

  obtenerTipoActividades() {
    const headers = new HttpHeaders().set('x-cache', 'true').set('x-cache-duration', '3600000'); // 60 minutos
    return this.http
      .get<ApiResponse>(`${baseUrl}/aula-virtual/contenidos/tipo-actividad`, { headers })
      .pipe(map(resp => resp.data));
  }
}
