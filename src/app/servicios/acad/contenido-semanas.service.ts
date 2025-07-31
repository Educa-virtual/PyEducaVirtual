import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@/environments/environment';
import { Observable, of, tap } from 'rxjs';

const baseUrl = environment.backendApi;

@Injectable({
  providedIn: 'root',
})
export class ContenidoSemanasService {
  private cacheContenidoSemanas: any[] | null = null;

  constructor(private http: HttpClient) {}

  obtenerContenidoSemanasxidDocCursoIdxiYAcadId(
    idDocCursoId,
    iYAcadId,
    params = {},
    forzarRecarga = false
  ): Observable<any> {
    if (!forzarRecarga && this.cacheContenidoSemanas) {
      return of({
        validated: true,
        data: this.cacheContenidoSemanas,
      });
    }

    const headers = new HttpHeaders()
      .set('x-cache', forzarRecarga ? 'false' : 'true')
      .set('x-cache-duration', '3600000');

    if (forzarRecarga) {
      params = {
        ...params,
        _ts: Date.now(),
      };
    }

    return this.http
      .get(`${baseUrl}/acad/contenido-semanas/curso/${idDocCursoId}/year/${iYAcadId}`, {
        params,
        headers,
      })
      .pipe(
        tap((resp: any) => {
          if (resp.validated) {
            this.cacheContenidoSemanas = resp.data;
          }
        })
      );
  }

  limpiarCache() {
    this.cacheContenidoSemanas = null;
  }

  obtenerActividadesxiContenidoSemId(iContenidoSemId, params) {
    return this.http.get(`${baseUrl}/acad/contenido-semanas/${iContenidoSemId}/actividades`, {
      params,
    });
  }

  guardarSesionDeAprendizaje(data): Observable<any> {
    return this.http.post(`${baseUrl}/acad/contenido-semanas`, data);
  }
}
