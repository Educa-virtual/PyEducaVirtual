import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@/environments/environment';
import { map, Observable, of } from 'rxjs';
import { ApiResponse } from '@/app/shared/interfaces/api-response.model';

const baseUrl = environment.backendApi;

@Injectable({
  providedIn: 'root',
})
export class TipoPublicosService {
  private cacheTipoPublicos: any[] | null = null;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista de tipos de público.
   * Si ya está en caché y no se fuerza la recarga, devuelve los datos almacenados.
   * @param forzarRecarga Si es true, ignora el caché y obtiene los datos del backend.
   */
  obtenerTipoPublicos(forzarRecarga = false): Observable<any> {
    if (!forzarRecarga && this.cacheTipoPublicos) {
      return of({
        validated: true,
        data: this.cacheTipoPublicos,
      });
    }

    const headers = new HttpHeaders()
      .set('x-cache', forzarRecarga ? 'false' : 'true')
      .set('x-cache-duration', '3600000');

    return this.http.get<ApiResponse>(`${baseUrl}/cap/tipo-publicos`, { headers }).pipe(
      map(resp => {
        this.cacheTipoPublicos = resp.data;
        return resp;
      })
    );
  }

  /**
   * Guarda un nuevo tipo de público.
   * @param data Datos del tipo de público.
   */
  guardarTipoPublico(data: any) {
    return this.http.post(`${baseUrl}/cap/tipo-publicos`, data);
  }

  /**
   * Actualiza un tipo de público existente.
   * @param data Datos actualizados (debe incluir iTipoPubId).
   */
  actualizarTipoPublico(data: any) {
    return this.http.put(`${baseUrl}/cap/tipo-publicos/${data.iTipoPubId}`, data);
  }

  eliminarTipoPublico(data: any) {
    return this.http.delete(`${baseUrl}/cap/tipo-publicos/${data.iTipoPubId}`, { params: data });
  }
}
