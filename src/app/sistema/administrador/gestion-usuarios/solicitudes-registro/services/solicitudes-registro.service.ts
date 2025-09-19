import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SolicitudesRegistroService {
  private urlBackendApi = environment.backendApi;
  private http = inject(HttpClient);
  constructor() {}

  solicitarRegistroUsuario(formulario: any) {
    return this.http.post(`${this.urlBackendApi}/seg/usuarios/solicitudes-registro`, formulario);
  }

  obtenerListaSolicitudes(params: any) {
    return this.http.get(`${this.urlBackendApi}/seg/usuarios`, {
      params,
    });
  }
}
