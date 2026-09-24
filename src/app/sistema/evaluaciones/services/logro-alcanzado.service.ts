import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';
import { Observable } from 'rxjs';

const baseUrl = environment.backendApi;

@Injectable({
  providedIn: 'root',
})
export class LogroAlcanzadoService {
  constructor(private http: HttpClient) {}

  parametros: any;
  parametros$?: Observable<any>;

  periodos_evaluacion: any[];
  escala_calificacion: any[];

  public readonly REPORTE_BOLETAS = 1;
  public readonly REPORTE_EXCEL = 2;
  public readonly REPORTE_FORMATO_SIAGIE = 3;

  getPeriodosEvaluacion(data: any) {
    if (!this.periodos_evaluacion && data) {
      const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'));
      this.periodos_evaluacion = items.map(item => ({
        value: Number(item.iOrden),
        label: item?.cPeriovoEvalOrden,
        iPeriodoEvalAperId: item?.iPeriodoEvalAperId,
        bHabilitado: item?.bHabilitado,
        dtPeriodoEvalAperInicio: item?.dtPeriodoEvalAperInicio,
        dtPeriodoEvalAperFin: item?.dtPeriodoEvalAperFin,
      }));
      return this.periodos_evaluacion;
    }
    return this.periodos_evaluacion;
  }

  getEscalaCalificacion(data: any) {
    if (!this.escala_calificacion && data) {
      const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'));
      this.escala_calificacion = items.map(item => ({
        value: Number(item?.iEscalaCalifId),
        label: item?.cEscalaCalifLetra,
        nEscalaCalifEquivalente: item?.nEscalaCalifEquivalente,
      }));
      return this.escala_calificacion;
    }
    return this.escala_calificacion;
  }

  listarDocenteCurso(data) {
    return this.http.post(`${baseUrl}/acad/listarDocenteCurso`, data);
  }

  obtenerDatosCursoDocente(params) {
    return this.http.post(`${baseUrl}/evaluaciones/verCursoEstudiantesCompetencias`, params);
  }

  actualizarResultadosCompetencias(data) {
    return this.http.post(`${baseUrl}/evaluaciones/actualizarResultadosCompetencias`, data);
  }

  verResultadosCompetencias(params) {
    return this.http.post(`${baseUrl}/evaluaciones/verResultadosCompetencias`, params);
  }

  listarTipoEscala(params) {
    return this.http.post(`${baseUrl}/evaluaciones/listarTipoEscala`, params);
  }

  guardarTipoEscala(params) {
    return this.http.post(`${baseUrl}/evaluaciones/guardarTipoEscala`, params);
  }

  actualizarTipoEscala(params) {
    return this.http.post(`${baseUrl}/evaluaciones/actualizarTipoEscala`, params);
  }

  verTipoEscala(params) {
    return this.http.post(`${baseUrl}/evaluaciones/verTipoEscala`, params);
  }

  listarEscalaCalificaciones(params) {
    return this.http.post(`${baseUrl}/evaluaciones/listarEscalaCalificaciones`, params);
  }

  guardarEscalaCalificaciones(params) {
    return this.http.post(`${baseUrl}/evaluaciones/guardarEscalaCalificaciones`, params);
  }

  actualizarEscalaCalificaciones(params) {
    return this.http.post(`${baseUrl}/evaluaciones/actualizarEscalaCalificaciones`, params);
  }

  /** Funciones antiguas */

  obtenerPeriodosEvaluacionSede(params) {
    return this.http.post(`${baseUrl}/evaluaciones/logros/obtenerPeriodosEvaluacionSede`, params);
  }

  exportarBoletas(params) {
    return this.http.post(`${baseUrl}/evaluaciones/logros/exportarBoletas`, params, {
      responseType: 'blob',
    });
  }

  exportarExcel(params) {
    return this.http.post(`${baseUrl}/evaluaciones/logros/exportarExcel`, params, {
      responseType: 'blob',
    });
  }

  exportarFormatoSiagie(params) {
    return this.http.post(`${baseUrl}/evaluaciones/logros/exportarFormatoSiagie`, params, {
      responseType: 'blob',
    });
  }
}
