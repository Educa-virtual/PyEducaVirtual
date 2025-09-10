import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@/environments/environment';
import { Observable, of, tap } from 'rxjs';

const baseUrl = environment.backendApi;

@Injectable({
  providedIn: 'root',
})
export class AnunciosService {
  private cacheAnuncios: any[] | null = null;

  constructor(private http: HttpClient) {}

  obtenerAnuncios(params = {}, forzarRecarga = false): Observable<any> {
    if (!forzarRecarga && this.cacheAnuncios) {
      return of({
        validated: true,
        data: this.cacheAnuncios,
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
      .get(`${baseUrl}/aula-virtual/anuncios`, {
        params,
        headers,
      })
      .pipe(
        tap((resp: any) => {
          if (resp.validated) {
            this.cacheAnuncios = resp.data;
          }
        })
      );
  }

  guardarAnuncio(data: any) {
    return this.http.post(`${baseUrl}/aula-virtual/anuncios`, data);
  }

  eliminarAnuncio(data: any) {
    return this.http.delete(`${baseUrl}/aula-virtual/anuncios/${data.iAnuncioId}`, data);
  }

  fijarAnuncio(data: any) {
    return this.http.put(`${baseUrl}/aula-virtual/anuncios/${data.iAnuncioId}/fijar`, data);
  }
}
