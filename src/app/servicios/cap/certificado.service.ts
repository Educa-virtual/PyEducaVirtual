import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable, switchMap } from 'rxjs';
import { environment } from '@/environments/environment';
const baseUrl = environment.backendApi;

@Injectable({ providedIn: 'root' })
export class CertificadoService {
  constructor(private http: HttpClient) {}

  descargarCertificado(iCapacitacionId: number, iPersId: number): Observable<any> {
    return this.http
      .get(`${baseUrl}/cap/certificado/${iCapacitacionId}/persona/${iPersId}/pdf`, {
        observe: 'response',
        responseType: 'blob',
      })
      .pipe(
        switchMap(resp => {
          const contentType = resp.headers.get('Content-Type');

          if (contentType?.includes('application/json')) {
            // Si es JSON, convertir el blob a objeto
            return from(resp.body.text().then(text => JSON.parse(text)));
          } else {
            // Si es PDF, devolver directamente el blob
            return from(Promise.resolve(resp.body));
          }
        })
      );
  }
}
