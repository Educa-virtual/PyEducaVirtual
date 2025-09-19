import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PersonasService {
  baseUrl = environment.backendApi;

  constructor(private http: HttpClient) {}

  obtenerPersonasxiPersId(params): Observable<any> {
    const headers = new HttpHeaders().set('x-cache', 'true').set('x-cache-duration', '3600000'); // 60 minutos
    return this.http.get(`${this.baseUrl}/grl/personas/obtenerPersonasxiPersId`, {
      params,
      headers,
    });
  }

  actualizarDatosPersonales(formulario: any) {
    return this.http.patch(`${this.baseUrl}/grl/personas/datos-personales`, formulario);
  }
}
