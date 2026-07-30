import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@/environments/environment';
import { map, Observable, of } from 'rxjs';
import { ApiResponse } from '@/app/shared/interfaces/api-response.model';

const baseUrl = environment.backendApi;

@Injectable({
  providedIn: 'root',
})
export class TipoModalidadService {
  private cacheTipoModalidades: any[] | null = null;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista de tipos de modalidad.
   * Si ya está en caché y no se fuerza la recarga, devuelve los datos almacenados.
   * @param forzarRecarga Si es true, ignora el caché y obtiene los datos del backend.
   */
  obtenerTipoModalidades(forzarRecarga = false): Observable<any> {
    if (!forzarRecarga && this.cacheTipoModalidades) {
      return of({
        validated: true,
        data: this.cacheTipoModalidades,
      });
    }

    const headers = new HttpHeaders()
      .set('x-cache', forzarRecarga ? 'false' : 'true')
      .set('x-cache-duration', '3600000');

    return this.http.get<ApiResponse>(`${baseUrl}/cap/tipo-modalidad`, { headers }).pipe(
      map(resp => {
        this.cacheTipoModalidades = resp.data;
        return resp;
      })
    );
  }
}
