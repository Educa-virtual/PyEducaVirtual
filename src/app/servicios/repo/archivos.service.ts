import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ArchivosService {
  private baseUrlApi = environment.backendApi;
  private _http = inject(HttpClient);

  guardarArchivo(data) {
    return this._http.post<any>(`${this.baseUrlApi}/repo/guardarArchivo`, data);
  }

  descargarArchivo(data) {
    return this._http.post(`${this.baseUrlApi}/repo/descargarArchivo`, data);
  }

  eliminarArchivo(data) {
    return this._http.post<any>(`${this.baseUrlApi}/repo/eliminarArchivo`, data);
  }
}
