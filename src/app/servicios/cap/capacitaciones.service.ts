import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

// import { map } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class CapacitacionesService {
  private baseUrlApi = environment.backendApi;
  private _http = inject(HttpClient);

  listarInscripcionxcurso(data) {
    return this._http.post(`${this.baseUrlApi}/cap/inscripciones/inscripciones`, data);
  }

  guardarCapacitacion(data) {
    return this._http.post(`${this.baseUrlApi}/cap/capacitaciones`, data);
  }
  eliminarCapacitacion(data) {
    return this._http.delete(`${this.baseUrlApi}/cap/capacitaciones/${data.iCapacitacionId}`, data);
  }
  actualizarCapacitacion(data) {
    return this._http.put(`${this.baseUrlApi}/cap/capacitaciones/${data.iCapacitacionId}`, data);
  }
  obtenerCapacitacion(params) {
    return this._http.get(`${this.baseUrlApi}/cap/capacitaciones`, {
      params,
    });
  }
  actualizarEstadoCapacitacion(data) {
    return this._http.put(
      `${this.baseUrlApi}/cap/capacitaciones/${data.iCapacitacionId}/estado`,
      data
    );
  }
  obtenerCapacitacionxiCredId(cPerfil, iCredId) {
    return this._http.get(`${this.baseUrlApi}/cap/capacitaciones/${cPerfil}/${iCredId}`, {});
  }
}
