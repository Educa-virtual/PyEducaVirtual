import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CarpetasService {
  private baseUrlApi = environment.backendApi;
  private http = inject(HttpClient);

  listarCarpetas(data) {
    return this.http.post(`${this.baseUrlApi}/repo/listarCarpetas`, data);
  }

  guardarCarpeta(data) {
    return this.http.post(`${this.baseUrlApi}/repo/guardarCarpeta`, data);
  }

  eliminarCarpeta(data) {
    return this.http.post(`${this.baseUrlApi}/repo/eliminarCarpeta`, data);
  }
  actualizarCarpeta(data) {
    return this.http.post(`${this.baseUrlApi}/repo/actualizarCarpeta`, data);
  }

  formatearTamanio(tamano_en_bytes: number) {
    const tamano = tamano_en_bytes / 1024;
    if (tamano < 1024) {
      return `${tamano.toFixed(2)} KB`;
    } else {
      return `${(tamano / 1024).toFixed(2)} MB`;
    }
  }
}
