import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CarpetasService {
  private baseUrlApi = environment.backendApi;
  private _http = inject(HttpClient);

  guardarCarpeta(data) {
    return this._http.post(`${this.baseUrlApi}/repo/carpetas`, data);
  }
  eliminarCarpeta(data) {
    return this._http.delete(`${this.baseUrlApi}/repo/carpetas`, { params: data });
  }
  actualizarCarpeta(data) {
    return this._http.put(`${this.baseUrlApi}/repo/carpetas`, data);
  }
  obtenerCarpetas(params) {
    return this._http.get(`${this.baseUrlApi}/repo/carpetas`, {
      params,
    });
  }
}
