import { ApiResponse } from '@/app/shared/interfaces/api-response.model';
import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import {
  mapData,
  mapItemsBancoToEre,
} from '../../evaluaciones/sub-evaluaciones/banco-preguntas/models/pregunta-data-transformer';
import { httpService } from '@/app/servicios/httpService';

@Injectable({
  providedIn: 'root',
})
export class ApiEvaluacionesService {
  private baseUrlApi = environment.backendApi;
  private baseUrl = environment.backend;
  private http = inject(HttpClient);
  constructor(private http2: httpService) {}

  obtenerTipoEvaluaciones() {
    return this.http
      .get<any>(`${this.baseUrlApi}/evaluaciones/evaluacion/`)
      .pipe(map(resp => resp.data));
  }
  // evaluacion contenido aula

  guardarActualizarEvaluacion(data) {
    return this.http
      .post<any>(`${this.baseUrlApi}/evaluaciones/evaluacion/guardarActualizarEvaluacion`, data)
      .pipe(map(resp => resp.data));
  }

  async actualizarRubricaEvaluacion(data) {
    const res: any = this.http2.postData(
      'evaluaciones/evaluacion/actualizarRubricaEvaluacion',
      data
    );
    return res?.data;
  }

  guardarActualizarPreguntasEvaluacion(data) {
    return this.http.post<any>(
      `${this.baseUrlApi}/evaluaciones/evaluacion/guardarActualizarPreguntasEvaluacion`,
      data
    );
  }

  quitarPreguntaEvaluacion(ids) {
    return this.http.delete<any>(
      `${this.baseUrlApi}/evaluaciones/evaluacion/eliminarPreguntaEvulacion/${ids}`
    );
  }

  // Rubricas

  obtenerRubricas(params) {
    console.log('solicitando rubricas');
    console.log(params);
    return this.http
      .get<ApiResponse>(`${this.baseUrlApi}/evaluaciones/instrumento-evaluaciones/rubrica`, {
        params,
      })
      .pipe(map(resp => resp.data));
  }

  obtenerRubricaEvaluacion(params) {
    return this.http
      .post<ApiResponse>(
        `${this.baseUrlApi}/evaluaciones/instrumento-evaluaciones/obtenerRubricaEvaluacion`,
        { params }
      )
      .pipe(map(resp => resp.data));
  }

  guardarCalificacionRubricaEvaluacion(params) {
    return this.http
      .post<ApiResponse>(
        `${this.baseUrlApi}/evaluaciones/evaluacion/guardarActualizarCalificacionRubricaEvaluacion`,
        params
      )
      .pipe(map(resp => resp.data));
  }

  deleteRubricaEvaluacion(params) {
    return this.http
      .post<ApiResponse>(
        `${this.baseUrlApi}/evaluaciones/evaluacion/deleteRubricaEvaluacion`,
        params
      )
      .pipe(map(resp => resp.data));
  }

  obtenerRubrica(params) {
    console.log('solicitando rubrica');
    console.log(params);
    return this.http
      .get<ApiResponse>(`${this.baseUrlApi}/evaluaciones/instrumento-evaluaciones/obtenerRubrica`, {
        params,
      })
      .pipe(map(resp => resp.data));
  }

  obtenerRubricasConFiltro(params) {
    console.log('solicitando rubricas');
    console.log(params);
    return this.http
      .get<ApiResponse>(
        `${this.baseUrlApi}/evaluaciones/instrumento-evaluaciones/obtenerRubricas`,
        { params }
      )
      .pipe(map(resp => resp.data));
  }

  // guardarActualizarRubrica(data) {
  //     return this.http
  //         .post<ApiResponse>(
  //             `${this.baseUrlApi}/evaluaciones/instrumento-evaluaciones/rubrica`,
  //             data
  //         )
  //         .pipe(map((resp) => resp.data))
  // }

  async guardarActualizarRubrica(data) {
    const res: any = await this.http2.postData(
      'evaluaciones/instrumento-evaluaciones/rubrica',
      data
    );
    return res?.data;
  }

  eliminarRubrica({ id, tipo }: { id: number; tipo: 'INSTRUMENTO' | 'CRITERIO' | 'NIVEL' }) {
    return this.http
      .delete<ApiResponse>(
        `${this.baseUrlApi}/evaluaciones/instrumento-evaluaciones/rubrica/${id}`,
        { params: { cTipo: tipo } }
      )
      .pipe(map(resp => resp.data));
  }

  // escala calificaciones

  obtenerEscalaCalificaciones() {
    return this.http.get<any>(`${this.baseUrlApi}/evaluaciones/escala-calificaciones`).pipe(
      map(resp =>
        resp.data.map(item => {
          item.cEscalaCalifNombreDetalles = `${item.cEscalaCalifNombre ?? ''} ${item.cEscalaCalifDescripcion ?? ''} ${item.nEscalaCalifEquivalente ?? ''}`;
          return item;
        })
      )
    );
  }

  // logros
  obtenerLogros(params) {
    return this.http
      .get<ApiResponse>(`${this.baseUrlApi}/evaluaciones/evaluacion/logros`, { params })
      .pipe(map(resp => resp.data));
  }

  guardarActualizarLogros(data) {
    return this.http
      .post<ApiResponse>(`${this.baseUrlApi}/evaluaciones/evaluacion/logros`, data)
      .pipe(map(resp => resp.data));
  }
  eliminarLogroPregunta(id) {
    return this.http
      .delete<ApiResponse>(`${this.baseUrlApi}/evaluaciones/evaluacion/logros/${id}`)
      .pipe(map(resp => resp.data));
  }

  publicarEvaluacion(data) {
    return this.http.post<ApiResponse>(`${this.baseUrlApi}/evaluaciones/evaluacion/publicar`, data);
  }

  anularPublicacionEvaluacion(data) {
    return this.http.post<ApiResponse>(
      `${this.baseUrlApi}/evaluaciones/evaluacion/anular-publicacion`,
      data
    );
  }

  obtenerEstudiantesEvaluación(params) {
    return this.http
      .get<ApiResponse>(`${this.baseUrlApi}/evaluaciones/evaluacion/estudiantes`, { params })
      .pipe(map(resp => resp.data));
  }

  obtenerEvaluacionRespuestasEstudiante(params) {
    return this.http
      .get<ApiResponse>(
        `${this.baseUrlApi}/evaluaciones/evaluacion/estudiantes/obtenerEvaluacionRespuestasEstudiante`,
        { params }
      )
      .pipe(
        map(resp => resp.data),
        map(data => mapItemsBancoToEre(data)),
        map(data => mapData(data))
      );
  }

  // calificar logros estudiante

  calificarLogros(data) {
    return this.http
      .post<ApiResponse>(
        `${this.baseUrlApi}/evaluaciones/evaluacion/estudiantes/calificarLogros`,
        data
      )
      .pipe(map(resp => resp.data));
  }

  //Generar lista de estudiantes
  generarListaEstudiantesSedeSeccionGrado(params: any) {
    return this.http
      .get<any>(
        `${this.baseUrlApi}/evaluaciones/lista-estudiantes`, // Cambié el endpoint para que coincida con Laravel
        { params }
      )
      .pipe(map(resp => resp.data));
  }

  competenciasXCursoIdXCurricula(params: any) {
    return this.http
      .get<any>(
        `${this.baseUrlApi}/evaluaciones/competenciasXCursoIdXCurricula`, // Cambié el endpoint para que coincida con Laravel
        { params }
      )
      .pipe(map(resp => resp.data));
  }

  getPeriodosEvaluacion() {
    return this.http.get<any>('/api/evaluaciones/periodos-evaluacion');
  }
  obtenerTodasLasCompetencias(params?) {
    return this.http
      .get<ApiResponse>(`${this.baseUrlApi}/evaluaciones/competencias`, { params })
      .pipe(map(resp => resp.data));
  }
}
