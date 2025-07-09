import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';
import { Observable } from 'rxjs';
const baseUrl = environment.backendApi;

@Injectable({
  providedIn: 'root',
})
export class InscripcionesService {
  constructor(private http: HttpClient) {}

  buscarPersonaInscripcionxiCapacitacionId(
    iCapacitacionId: string | number,
    iTipoIdentId: string | number,
    cPersDocumento: string | number,
    params: { iCredId: string | number }
  ): Observable<any> {
    return this.http.get(
      `${baseUrl}/cap/inscripciones/capacitacion/${iCapacitacionId}/tipo/${iTipoIdentId}/documento/${cPersDocumento}`,
      {
        params,
      }
    );
  }

  guardarInscripcion(data): Observable<any> {
    return this.http.post(`${baseUrl}/cap/inscripciones/inscripcion`, data);
  }
}
