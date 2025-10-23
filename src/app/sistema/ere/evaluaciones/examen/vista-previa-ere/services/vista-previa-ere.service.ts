import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VistaPreviaEreService {
  private urlBackendApi = environment.backendApi;

  constructor(private http: HttpClient) {}

  obtenerVistaPrevia(iEvaluacionId, iCursosNivelGradId) {
    return this.http.get(
      `${this.urlBackendApi}/ere/evaluaciones/${iEvaluacionId}/areas/${iCursosNivelGradId}/vista-previa`
    );
  }
}
