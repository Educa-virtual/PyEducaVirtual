import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private urlBackendApi = environment.backendApi;
  private urlBackend = environment.backend;
  private http = inject(HttpClient);
  constructor() {}

  cambiarContrasena(contrasenaActual: string, contrasenaNueva: string) {
    return this.http.patch(`${this.urlBackendApi}/usuarios/mi-contrasena`, {
      contrasenaActual: contrasenaActual,
      contrasenaNueva: contrasenaNueva,
    });
  }
}
