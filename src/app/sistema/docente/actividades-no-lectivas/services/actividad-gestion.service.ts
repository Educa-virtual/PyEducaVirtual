import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';

const baseUrl = environment.backendApi;
@Injectable({
  providedIn: 'root',
})
export class ActividadGestionService {
  constructor(private http: HttpClient) {}

  obtenerActividadesGestion(data: any) {
    return this.http.post(`${baseUrl}/docente/carga-no-lectivas/list`, data);
  }

  obtenerTiposActividades() {
    return this.http.post(`${baseUrl}/docente/tipos-carga-no-lectivas/list`, null);
  }

  guardarCargaNoLectivas(data: any) {
    return this.http.post(`${baseUrl}/docente/carga-no-lectivas/store`, data);
  }

  editarDetalleCargaNoLectivas(data: any) {
    return this.http.post(`${baseUrl}/docente/carga-no-lectivas/update`, data);
  }

  eliminarDetalleCargaNoLectivas(data: any) {
    return this.http.post(`${baseUrl}/docente/carga-no-lectivas/delete`, data);
  }

  aprobarCargaNoLectivas(data: any) {
    return this.http.post(`${baseUrl}/docente/carga-no-lectivas/aprobar`, data);
  }

  observacionDetalleCargaNoLectivas(data: any) {
    return this.http.post(`${baseUrl}/docente/carga-no-lectivas/observar`, data);
  }
}
