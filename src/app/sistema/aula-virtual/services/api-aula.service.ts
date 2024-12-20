import { environment } from '@/environments/environment'
import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { map } from 'rxjs'
import {
    mapData,
    mapItemsBancoToEre,
} from '../../evaluaciones/sub-evaluaciones/banco-preguntas/models/pregunta-data-transformer'
import { ApiResponse } from '@/app/shared/interfaces/api-response.model'

@Injectable({
    providedIn: 'root',
})
export class ApiAulaService {
    private baseUrlApi = environment.backendApi
    private _http = inject(HttpClient)
    constructor() {}

    guardarActividad(data) {
        return this._http.post(
            `${this.baseUrlApi}/aula-virtual/contenidos/actividad/guardarActividad`,
            data
        )
    }
    // Foros
    guardarForo(data) {
        return this._http.post(
            `${this.baseUrlApi}/aula-virtual/contenidos/foro/guardarForo`,
            data
        )
    }
    actualizarForo(data) {
        return this._http.post(
            `${this.baseUrlApi}/aula-virtual/foros/actualizarForo`,
            data
        )
    }

    obtenerCategorias(data) {
        return this._http.post(
            `${this.baseUrlApi}/aula-virtual/contenidos/foro/obtenerCategorias`,
            data
        )
    }
    obtenerCalificacion(data) {
        return this._http.post(
            `${this.baseUrlApi}/aula-virtual/contenidos/foro/obtenerCalificacion`,
            data
        )
    }
    obtenerForo(params: { iActTipoId; ixActivadadId }) {
        return this._http
            .get<any>(
                `${this.baseUrlApi}/aula-virtual/contenidos/foro/obtenerForo`,
                { params }
            )
            .pipe(
                map((resp) => resp.data),
                map((data) => {
                    if (data.iActTipoId == 2) {
                        const preguntas = mapItemsBancoToEre(data.preguntas)
                        data.preguntas = mapData(preguntas)
                    }
                    return data
                })
            )
    }
    guardarRespuesta(data) {
        return this._http.post(
            `${this.baseUrlApi}/aula-virtual/contenidos/foro/guardarRespuesta`,
            data
        )
    }
    guardarComentarioRespuesta(data) {
        return this._http.post(
            `${this.baseUrlApi}/aula-virtual/contenidos/foro/guardarComentarioRespuesta`,
            data
        )
    }
    guardarCalifEstudiante(data) {
        return this._http.post(
            `${this.baseUrlApi}/aula-virtual/Resultado/guardarCalfcEstudiante`,
            data
        )
    }
    obtenerRespuestaForo(params: { iActTipoId; ixActivadadId }) {
        return this._http
            .get<any>(
                `${this.baseUrlApi}/aula-virtual/contenidos/foro/obtenerRespuestaForo`,
                { params }
            )
            .pipe(
                map((resp) => resp.data),
                map((data) => {
                    if (data.iActTipoId == 2) {
                        const preguntas = mapItemsBancoToEre(data.preguntas)
                        data.preguntas = mapData(preguntas)
                    }
                    return data
                })
            )
    }
    obtenerResultados(params: { iEstudianteId; idDocCursoId }) {
        return this._http
            .get<any>(
                `${this.baseUrlApi}/aula-virtual/Resultado/obtenerResultados`,
                { params }
            )
            .pipe(
                map((response) => {
                    if (!response || !response.data) {
                        throw new Error(
                            'La respuesta no contiene datos válidos'
                        )
                    }
                    console.log(response.data)
                    return response.data
                })
                // map((data) => {
                //     if (data.iActTipoId == 2) {
                //         const preguntas = mapItemsBancoToEre(data.preguntas)
                //         data.preguntas = mapData(preguntas)
                //     }
                //     return data
                // })
            )
    }

    calificarForoDocente(data) {
        return this._http.post(
            `${this.baseUrlApi}/aula-virtual/contenidos/foro/calificarForoDocente`,
            data
        )
    }
    // guardar la calificación de la unidad
    guardarCalificacionEstudiante(
        esquema: string,
        tabla: string,
        where: any,
        datos: any
    ) {
        return this._http
            .post<any>(
                `${this.baseUrlApi}/aula-virtual/Resultado/guardarCalfcEstudiante`,
                {
                    esquema,
                    tabla,
                    where,
                    datos,
                }
            )
            .pipe(
                map((response) => {
                    if (!response || !response.data) {
                        throw new Error(
                            'La respuesta no contiene datos válidos'
                        )
                    }
                    return response.data
                }),
                map((data) => {
                    if (data.iActTipoId == 2) {
                        const preguntas = mapItemsBancoToEre(data.preguntas)
                        data.preguntas = mapData(preguntas)
                    }
                    return data
                })
            )
    }
    // fin de foro guardarCalifEstudiante
    eliminarActividad(data) {
        return this._http.delete(
            `${this.baseUrlApi}/aula-virtual/contenidos/actividad/eliminarActividad`,
            { params: data }
        )
    }
    eliminarRespuesta(data) {
        return this._http.delete(
            `${this.baseUrlApi}/aula-virtual/contenidos/foro/eliminarRptEstudiante`,
            { params: data }
        )
    }

    contenidoSemanasProgramacionActividades(params) {
        return this._http
            .get<any>(
                `${this.baseUrlApi}/aula-virtual/contenidos/contenidoSemanasProgramacionActividades`,
                { params }
            )
            .pipe(map((resp) => resp.data))
    }

    obtenerActividad(params: { iActTipoId; ixActivadadId }) {
        return this._http
            .get<any>(
                `${this.baseUrlApi}/aula-virtual/contenidos/actividad/obtenerActividad`,
                { params }
            )
            .pipe(
                map((resp) => resp.data),
                map((data) => {
                    if (data.iActTipoId == 3) {
                        const preguntas = mapItemsBancoToEre(data.preguntas)
                        data.preguntas = mapData(preguntas)
                    }
                    return data
                })
            )
    }
    habilitarCalificacion(data) {
        return this._http.post(
            `${this.baseUrlApi}/aula-virtual/Resultado/habilitarCalificacion`,
            data
        )
        // .pipe(
        //     map((resp) => {
        //         console.log('Respuesta completa:', resp);
        //         return resp?.data; // Usa el operador de encadenamiento opcional
        //     }),
        //     map((data) => {
        //         if (data?.iActTipoId === 2) { // Verifica si `data` es válido
        //             const preguntas = mapItemsBancoToEre(data.preguntas);
        //             data.preguntas = mapData(preguntas);
        //         }
        //         return data;
        //     })
        // );
    }
    obtenerEstudiantesMatricula(params: { iCurrId; iSemAcadId; iYAcadId }) {
        return this._http.get<any>(
            `${this.baseUrlApi}/aula-virtual/contenidos/foro/obtenerEstudiantesMatricula`,
            { params }
        )
    }
    obtenerTipoActividades() {
        return this._http
            .get<ApiResponse>(
                `${this.baseUrlApi}/aula-virtual/contenidos/tipo-actividad`
            )
            .pipe(map((resp) => resp.data))
    }
    obtenerReporteFinalDeNotas(params: { iIeCursoId }) {
        return this._http.get(
            `${this.baseUrlApi}/aula-virtual/Resultado/obtenerReporteFinalNotas`,
            {
                params,
            }
        )
        //.pipe(map((resp) => resp.data))
    }
    generarReporteDeLogrosPdf(params: { iIeCursoId; idDocCursoId }) {
        return this._http.get(
            `${this.baseUrlApi}/aula-virtual/Resultado/reporteDeLogros`,
            {
                params, // Enviar los datos como parámetros
                responseType: 'blob', // Indicar que la respuesta será un archivo Blob
            } // Asegúrate de que el responseType esté como 'blob'
        )
    }
    generarReporteDeLogroFinalDeYear(params: { iSedeId }) {
        return this._http.get(
            `${this.baseUrlApi}/aula-virtual/Resultado/reporteDeLogroFinalXYear`,
            {
                params, // Enviar los datos como parámetros
            }
        )
    }
    generarReporteDeLogrosAlcanzadosXYear(params: { iSedeId }) {
        return this._http.get(
            `${this.baseUrlApi}/aula-virtual/Resultado/generarReporteDeLogrosAlcanzadosXYear`,
            {
                params, // Enviar los datos como parámetros
                responseType: 'blob', // Indicar que la respuesta será un archivo Blob
            }
        )
    }
}
