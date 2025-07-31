import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@/environments/environment';
import { Observable } from 'rxjs';

const baseUrl = environment.backendApi;

@Injectable({
  providedIn: 'root',
})
export class EscalaCalificacionesService {
  constructor(private http: HttpClient) {}

  obtenerEscalaCalificaciones(): Observable<any> {
    const headers = new HttpHeaders().set('x-cache', 'true').set('x-cache-duration', '3600000'); // 60 minutos
    return this.http.get(`${baseUrl}/evaluaciones/escala-calificaciones`, {
      headers,
    });
  }
}
