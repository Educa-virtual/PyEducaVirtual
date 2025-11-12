import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { FormGroup } from '@angular/forms';

const baseUrl = environment.backendApi;

@Injectable({
  providedIn: 'root',
})
export class LogroAlcanzadoService {
  constructor(
    private http: HttpClient,
    private store: LocalStoreService
  ) {}

  perfil = this.store.getItem('dremoPerfil');
  iYAcadId = this.store.getItem('dremoiYAcadId');

  tipos_calificacion: any[] = [];

  public readonly CALIFICACION_CUANTITATIVA = 1;
  public readonly CALIFICACION_EQUIVALENTE = 2;

  listarTiposCalificacion() {
    return this.http.post(`${baseUrl}/evaluaciones/logros/listarTiposCalificacion`, null);
  }

  obtenerEscalasCalificacion(params) {
    return this.http.post(`${baseUrl}/evaluaciones/logros/obtenerEscalasCalificacion`, params);
  }

  actualizarEscalaCalificacion(params) {
    return this.http.post(`${baseUrl}/evaluaciones/logros/actualizarEscalaCalificacion`, params);
  }

  obtenerPeriodosEvaluacionSede(params) {
    return this.http.post(`${baseUrl}/evaluaciones/logros/obtenerPeriodosEvaluacionSede`, params);
  }

  listarCursos(params) {
    return this.http.post(`${baseUrl}/acad/docente/docente_curso`, params);
  }

  obtenerDatosCursoDocente(params) {
    return this.http.post(`${baseUrl}/evaluaciones/logros/obtenerDatosCursoDocente`, params);
  }

  obtenerLogrosEstudiante(params) {
    return this.http.post(`${baseUrl}/evaluaciones/logros/obtenerLogrosEstudiante`, params);
  }

  actualizarLogro(params) {
    return this.http.post(`${baseUrl}/evaluaciones/logros/actualizarLogro`, params);
  }

  getTiposCalificacion() {
    return [
      { label: 'CALIFICACIÓN CUANTITATIVA', value: this.CALIFICACION_CUANTITATIVA },
      { label: 'CALIFICACIÓN EQUILVALENTE NÚMERICO', value: this.CALIFICACION_EQUIVALENTE },
    ];
  }

  formMarkAsDirty(form: FormGroup) {
    if (form) {
      form.markAllAsTouched();
      Object.keys(form.controls).forEach(key => {
        form.get(key)?.markAsDirty();
      });
    }
  }
}
