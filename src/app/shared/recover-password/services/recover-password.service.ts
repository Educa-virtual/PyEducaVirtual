import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RecoverPasswordService {
  private urlBackendApi = environment.backendApi;
  private http = inject(HttpClient);

  constructor() {}

  enviarCodigoRecuperacion(cCredUsuario: string) {
    return this.http.post(
      `${this.urlBackendApi}/seg/usuarios/password-recovery/codigo-recuperacion`,
      { cCredUsuario }
    );
  }

  validarCodigoRecuperacion(cCredUsuario: string, token: string) {
    return this.http.post(
      `${this.urlBackendApi}/seg/usuarios/password-recovery/codigo-recuperacion/validar`,
      { cCredUsuario, token }
    );
  }

  cambiarPassword(formulario: any) {
    return this.http.post(
      `${this.urlBackendApi}/seg/usuarios/password-recovery/reset-password`,
      formulario
    );
  }
}
