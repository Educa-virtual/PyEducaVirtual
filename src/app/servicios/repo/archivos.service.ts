import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ArchivosService {
  private baseUrlApi = environment.backendApi;
  private _http = inject(HttpClient);

  guardarArchivo(formData: FormData) {
    return this._http.post<any>(`${this.baseUrlApi}/repo/archivos`, formData);
  }

  descargarArchivo(iArchivoId: number) {
    return this._http.get(`${this.baseUrlApi}/repo/archivos/descargar/${iArchivoId}`);
  }

  eliminarArchivo(iArchivoId, params) {
    return this._http.delete<any>(`${this.baseUrlApi}/repo/archivos/${iArchivoId}`, {
      params,
    });
  }
}
