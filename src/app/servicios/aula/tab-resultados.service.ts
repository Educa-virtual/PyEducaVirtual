import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';
import { Observable } from 'rxjs';

const baseUrl = environment.backendApi;

@Injectable({
  providedIn: 'root',
})
export class TabResultadosService {
  private cacheAnuncios: any[] | null = null;
  constructor(private http: HttpClient) {}

  // obtenerAlumnos(params: {datos}, forzarRecarga = false): Observable<any> {
  //     if (!forzarRecarga && this.cacheAnuncios) {
  //       return of({
  //         validated: true,
  //         data: this.cacheAnuncios,
  //       });
  //     }
  //     const headers = new HttpHeaders()
  //       .set('x-cache', forzarRecarga ? 'false' : 'true')
  //       .set('x-cache-duration', '3600000');

  //     if (forzarRecarga) {
  //       params = {
  //         ...params,
  //         _ts: Date.now(),
  //       };
  //     }

  //     return this.http
  //       .get(`${baseUrl}/cap/notas`, {
  //         params,
  //         headers,
  //       })
  //       .pipe(
  //         tap((resp: any) => {
  //           if (resp.validated) {
  //             this.cacheAnuncios = resp.data;
  //           }
  //         })
  //       );
  //   }
  obtenerAlumnos(params: { data }) {
    return this.http.get(`${baseUrl}/cap/notas/${params}`);
  }
  guardarDescripcion(data): Observable<any> {
    return this.http.post(`${baseUrl}/cap/notas`, data);
  }
}
