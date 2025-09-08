import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@/environments/environment';
import { Observable } from 'rxjs';

const baseUrl = environment.backendApi;

@Injectable({
  providedIn: 'root',
})
export class TurnosService {
  constructor(private http: HttpClient) {}

  obtenerTurnos(params): Observable<any> {
    const headers = new HttpHeaders()
      .set('x-cache', 'true')
      .set('x-cache-duration', (60 * 60 * 1000).toString()); // 60 min
    return this.http.get(`${baseUrl}/acad/turnos`, {
      params,
      headers,
    });
  }
}
