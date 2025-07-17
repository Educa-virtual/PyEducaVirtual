import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@/environments/environment';
import { Observable } from 'rxjs';

const baseUrl = environment.backendApi;

@Injectable({
  providedIn: 'root',
})
export class ContenidoSemanasService {
  constructor(private http: HttpClient) {}

  obtenerContenidoSemanasxiSilaboId(
    iSilaboId,
    params = {},
    forzarRecarga = false
  ): Observable<any> {
    const headers = new HttpHeaders()
      .set('x-cache', forzarRecarga ? 'false' : 'true')
      .set('x-cache-duration', '3600000');

    // Agregar timestamp si es recarga forzada para evitar cache del navegador
    if (forzarRecarga) {
      params = {
        ...params,
        _ts: Date.now(), // valor dinámico
      };
    }

    return this.http.get(`${baseUrl}/acad/contenido-semanas/silabo/${iSilaboId}`, {
      params,
      headers,
    });
  }
}
