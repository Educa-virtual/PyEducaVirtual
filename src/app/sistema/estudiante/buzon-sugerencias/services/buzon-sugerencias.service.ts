import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BuzonSugerenciasService {
  private urlBackendApi = environment.backendApi;
  private urlBackend = environment.backend;

  constructor(private http: HttpClient) {}

  registrarSugerencia(data: any) {
    return this.http.post(`${this.urlBackendApi}/acad/estudiantes/buzon-sugerencias`, data);
  }

  obtenerListaSugerencias() {
    return this.http.get(`${this.urlBackendApi}/acad/estudiantes/buzon-sugerencias`);
  }

  obtenerListaArchivosSugerencia(iSugerenciaId: any) {
    return this.http.get(
      `${this.urlBackendApi}/acad/estudiantes/buzon-sugerencias/${iSugerenciaId}/archivos`
    );
  }

  obtenerPrioridades() {
    return this.http.get(`${this.urlBackendApi}/grl/prioridades`);
  }

  eliminarSugerencia(iSugerenciaId: any) {
    return this.http.delete(
      `${this.urlBackendApi}/acad/estudiantes/buzon-sugerencias/${iSugerenciaId}`
    );
  }

  descargarArchivoSugerencia(iSugerenciaId: any, archivo: string) {
    return this.http.get(
      `${this.urlBackendApi}/acad/estudiantes/buzon-sugerencias/${iSugerenciaId}/archivos/${archivo}`,
      {
        responseType: 'blob',
      }
    );
  }

  //lista: any[] = []
  //private iSugerenciaId: string | null = null

  /*clearData() {
        this.iSugerenciaId = null
        localStorage.removeItem('iSugerenciaId')
    }*/

  /*setiSugerenciaId(index: string | null) {
        this.iSugerenciaId = index
        localStorage.setItem('iSugerenciaId', index)
    }*/

  /*getiSugerenciaId(): string | null {
        if (!this.iSugerenciaId) {
            this.iSugerenciaId =
                localStorage.getItem('iSugerenciaId') == 'null'
                    ? null
                    : localStorage.getItem('iSugerenciaId')
        }
        return this.iSugerenciaId
    }*/
}
