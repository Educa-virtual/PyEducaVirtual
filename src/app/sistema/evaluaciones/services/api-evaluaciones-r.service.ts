import { inject, Injectable } from '@angular/core'
import { environment } from '@/environments/environment.template'
import { HttpClient } from '@angular/common/http'
import { map, Observable, catchError, tap, throwError } from 'rxjs' //catchError, , tap, throwError
import { mapData } from '../sub-evaluaciones/banco-preguntas/models/pregunta-data-transformer'

@Injectable({
    providedIn: 'root',
})
export class ApiEvaluacionesRService {
    private urlBackendAspNet = environment.backendAspNet
    private urlBackendApi = environment.backendApi
    private urlBackend = environment.backend
    private http = inject(HttpClient)
    constructor() {}

    obtenerEvaluacion(params) {
        return this.http
            .get(
                `${this.urlBackendApi}/ere/Evaluaciones/ereObtenerEvaluacion`,
                {
                    params,
                }
            )
            .pipe(
                tap((response) =>
                    console.log('Respuesta de la API:', response)
                ), // Verifica lo que devuelve la API
                catchError((error) => {
                    console.error('Error en la solicitud:', error)
                    return throwError(error)
                })
            )
    }

    obtenerEvaluacionNuevo(iEvaluacionId): Observable<any> {
        return this.http
            .get(
                `${this.urlBackendApi}/ere/evaluaciones/obtenerEvaluacion?iEvaluacionId=${iEvaluacionId}`
            )
            .pipe(map((resp) => resp['data']))
    }

    obtenerAreasPorEvaluacionyEspecialista(
        iPersId,
        iEvaluacionId
    ): Observable<any> {
        return this.http
            .get(
                `${this.urlBackendApi}/ere/evaluaciones/obtenerAreasPorEvaluacionyEspecialista?iPersId=${iPersId}&iEvaluacionId=${iEvaluacionId}`
            )
            .pipe(map((resp) => resp['data']))
    }

    obtenerTipoPreguntas() {
        return this.http
            .get(
                `${this.urlBackendApi}/evaluaciones/tipo-preguntas/obtenerTipoPreguntas`
            )
            .pipe(map((resp) => resp['data']))
    }

    obtenerUgeles(params) {
        return this.http.get(`${this.urlBackendApi}/ere/Ugeles/obtenerUgeles`, {
            params,
        })
    }
    obtenerIE(params) {
        return this.http.get(`${this.urlBackendApi}/ere/ie/obtenerIE`, {
            params,
        })
    }

    obtenerNivelTipo(params) {
        return this.http.get(
            `${this.urlBackendApi}/ere/nivelTipo/obtenerNivelTipo`,
            {
                params,
            }
        )
    }
    //Tengo estos cursos en el backend
    obtenerCursos(params) {
        return this.http.post(
            `${this.urlBackendApi}/ere/Evaluaciones/obtenerCursos`,
            {
                params,
            }
        )
    }
    //Tengo estos cursos seleccionados del backend
    obtenerCursosEvaluacion(iEvaluacionId: number): Observable<any> {
        return this.http.get(
            `${this.urlBackendApi}/ere/Evaluaciones/evaluaciones/${iEvaluacionId}/cursos`
        )
    }
    //Insertar cursos
    insertarCursos(data: {
        iEvaluacionId: number
        selectedCursos: { iCursoNivelGradId: number }[]
    }): Observable<any> {
        return this.http.post(
            `${this.urlBackendApi}/ere/Evaluaciones/insertarCursos`,
            data
        )
    }
    eliminarCursos(data: {
        iEvaluacionId: number
        selectedCursos: { iCursoNivelGradId: number }[]
    }): Observable<any> {
        return this.http.delete(
            `${this.urlBackendApi}/ere/Evaluaciones/eliminarCursos`,
            { body: data }
        )
    }
    actualizarCursosExamen(
        evaluacionId: number,
        cursos: { id: number; is_selected: boolean }[]
    ): Observable<any> {
        const body = {
            evaluacion_id: evaluacionId,
            cursos: cursos,
        }

        return this.http.put(this.urlBackendApi, body)
    }
    obtenerEvaluacionesCopia(params) {
        return this.http.get(
            `${this.urlBackendApi}/ere/Evaluaciones/obtenerEvaluacionCopia2`,
            {
                params,
            }
        )
    }
    obtenerTipoEvaluacion(params) {
        return this.http.get(
            `${this.urlBackendApi}/ere/tipoEvaluacion/obtenerTipoEvaluacion`,
            { params }
        )
    }
    obtenerNivelEvaluacion(params) {
        return this.http.get(
            `${this.urlBackendApi}/ere/nivelEvaluacion/obtenerNivelEvaluacion`,
            { params }
        )
    }
    // insert_Code_New
    guardarEvaluacion(data: any) {
        return this.http.post(
            `${this.urlBackendApi}/ere/Evaluaciones/guardar`,
            data
        )
    }
    // Método para actualizar una evaluación
    actualizarEvaluacion(data: any) {
        return this.http.put(
            `${this.urlBackendApi}/ere/Evaluaciones/actualizar/${data.iEvaluacionId}`,
            data
        )
    }
    // obtenerParticipaciones(iEvaluacionId: number): Observable<any> {
    //     return this.http.get(
    //         `${this.baseUrl}/ere/Evaluaciones/obtenerParticipaciones?iEvaluacionId=${iEvaluacionId}`
    //     )
    // }
    obtenerParticipaciones(iEvaluacionId: number): Observable<any> {
        return this.http.get(
            //obtenerParticipaciones/{iEvaluacionId}
            `${this.urlBackendApi}/ere/Evaluaciones/obtenerParticipaciones/${iEvaluacionId}`
        )
    }
    //!
    guardarActualizarPreguntaConAlternativas(data) {
        return this.http.post(
            `${this.urlBackendApi}/ere/preguntas/guardarActualizarPreguntaConAlternativas`,
            data
        )
    }
    guardarParticipacion(data) {
        return this.http.post(
            `${this.urlBackendApi}/ere/Evaluaciones/guardarParticipacion`,
            data
        )
    }

    eliminarParticipacion(participaciones: any[]): Observable<any> {
        return this.http.delete(
            `${this.urlBackendApi}/ere/Evaluaciones/eliminarParticipacion`,
            { body: { participaciones: participaciones } } // Enviamos un array de objetos con iIieeId e iEvaluacionId
        )
    }
    IEparticipanall(data) {
        return this.http.post(
            `${this.urlBackendApi}/ere/Evaluaciones/IEparticipanall`,
            data
        )
    }
    //Actualizar Cursos
    actualizarCursos(
        iEvaluacionId: number,
        cursos: { iCursoId: number; isSelected: boolean }[]
    ): Observable<any> {
        const data = {
            iEvaluacionId: iEvaluacionId,
            cursos: cursos,
        }
        return this.http.put(
            `${this.urlBackendApi}/ere/Evaluaciones/actualizarCursos`,
            data
        )
    }
    //!Agregando Copiar ActualizarEvaluacion
    copiarEvaluacion(iEvaluacionId: number) {
        return this.http.post(
            `${this.urlBackendApi}/ere/Evaluaciones/copiarEvaluacion`,
            { iEvaluacionIdOriginal: iEvaluacionId }
        )
    }
    //!MatrizCompetencias
    obtenerMatrizCompetencias(params) {
        return this.http.get(
            `${this.urlBackendApi}/ere/Evaluaciones/obtenerMatrizCompetencias`,
            { params }
        )
    }
    //!Matriz Capacidades
    obtenerMatrizCapacidades(params) {
        return this.http.get(
            `${this.urlBackendApi}/ere/Evaluaciones/obtenerMatrizCapacidades`,
            { params }
        )
    }
    //!Matriz Desempeno
    insertarMatrizDesempeno(datapayload: any) {
        return this.http.post(
            `${this.urlBackendApi}/ere/Evaluaciones/insertarMatrizDesempeno`,
            datapayload
        )
    }
    generarPdfMatrizbyEvaluacionId(baseParams): Observable<any> {
        console.log('Parámetros enviados al backend:', baseParams)
        return this.http.get(
            `${this.urlBackendApi}/ere/Evaluaciones/generarPdfMatrizbyEvaluacionId`,
            {
                params: {
                    ...baseParams,
                },
                responseType: 'blob' as 'json', // Asegúrate de que el responseType esté como 'blob'
            }
        )
    }
    // obtenerEspDrem(params) {
    //     return this.http.get(
    //         `${this.baseUrl}/ere/Evaluaciones/obtenerEspDrem`,

    //         { params }
    //     )
    // }
    obtenerEspDremCurso(
        iPersId: number,
        iEvaluacionId: number
    ): Observable<any> {
        const params = { iPersId, iEvaluacionId } // Enviar el iPersId como parámetro
        //console.log('Parámetros enviados al backend:', params)
        return this.http.get(
            `${this.urlBackendApi}/ere/Evaluaciones/obtenerEspDremCurso`,
            { params }
        )
    }
    //!
    // obtenerConteoPorCurso(iEvaluacionId: number, iCursosNivelGradId: any[]) {
    //     // Crear parámetros para la solicitud
    //     const params = {
    //         iEvaluacionId: iEvaluacionId,
    //         iCursosNivelGradId: iCursosNivelGradId,
    //     }
    //     // Realiza la solicitud GET con los parámetros
    //     return this.http.post(
    //         `${this.baseUrl}/ere/Evaluaciones/obtenerConteoPorCurso`,
    //         { params }
    //     )
    // }
    obtenerConteoPorCurso(data) {
        return this.http.post(
            `${this.urlBackendApi}/ere/Evaluaciones/obtenerConteoPorCurso`,
            data
        )
    }
    //!
    insertarPreguntaSeleccionada(data) {
        return this.http.post(
            `${this.urlBackendApi}/ere/Evaluaciones/insertarPreguntaSeleccionada`,
            data
        )
    }
    obtenerPreguntaSeleccionada(iEvaluacionId: number) {
        return this.http.get(
            `${this.urlBackendApi}/ere/Evaluaciones/obtenerPreguntaSeleccionada`,
            {
                params: {
                    iEvaluacionId: iEvaluacionId.toString(), // Convertir a cadena si es necesario
                },
            }
        )
    }
    obtenerPreguntaInformacion(iEvaluacionId: number) {
        return this.http.get(
            `${this.urlBackendApi}/ere/Evaluaciones/obtenerPreguntaInformacion`,
            {
                params: {
                    iEvaluacionId: iEvaluacionId.toString(), // Convertir a cadena si es necesario
                    // iPreguntaIds: iPreguntaIds.toString(), // Convertir a cadena si es necesario
                },
            }
        )
    }

    //Servicio Guardar Inicio Final Exm Areas
    // guardarInicioFinalExmAreas(data) {
    //     return this.http.post(
    //         `${this.baseUrl}/ere/Evaluaciones/guardarInicioFinalExmAreas`,
    //         data
    //     )
    // }
    guardarInicioFinalExmAreas(datos: any): Observable<any> {
        const url = `${this.urlBackendApi}/ere/Evaluaciones/guardarInicioFinalExmAreas` // Endpoint de Laravel
        return this.http.post<any>(url, datos)
    }

    //Banco de Preguntas no tocar ->
    generarWordByPreguntasIds(baseParams) {
        const url = `${this.urlBackend}/generarWordBancoPreguntasSeleccionadas`
        const params = new URLSearchParams({ ...baseParams })
        const fullUrl = `${url}?${params.toString()}`
        window.open(fullUrl, '_blank')
    }
    // Banco de Preguntas no tocar ->
    generarWordByEvaluacionId(baseParams) {
        const url = `${this.urlBackend}/generarWordBancoPreguntasSeleccionadas`
        const params = new URLSearchParams({ ...baseParams })
        const fullUrl = `${url}?${params.toString()}`

        window.open(fullUrl, '_blank')
    }

    eliminarPreguntaById(id) {
        return this.http.delete(
            `${this.urlBackendApi}/ere/preguntas/eliminarBancoPreguntasById/${id}`
        )
    }

    actualizarBancoPreguntas(data) {
        return this.http.patch(
            `${this.urlBackendApi}/ere/preguntas/actualizarBancoPreguntas`,
            data
        )
    }

    guardarActualizarAlternativa(data) {
        return this.http.post(
            `${this.urlBackendApi}/ere/alternativas/guardarActualizarAlternativa`,
            data
        )
    }

    eliminarAlternativaById(id) {
        return this.http.delete(
            `${this.urlBackendApi}/ere/alternativas/eliminarAlternativaById/${id}`
        )
    }

    obtenerAlternativaByPreguntaId(id) {
        return this.http
            .get(
                `${this.urlBackendApi}/ere/alternativas/obtenerAlternativaByPreguntaId/${id}`
            )
            .pipe(map((resp) => resp['data']))
    }
    eliminarPregunta(
        iEvaluacionId: number,
        iPreguntaId: number
    ): Observable<any> {
        return this.http.delete(
            `${this.urlBackendApi}/ere/Evaluaciones/eliminarPregunta`,
            { params: { iEvaluacionId, iPreguntaId } }
        )
    }

    // encabezados preguntas

    guardarActualizarPreguntas(data) {
        return this.http.post(
            `${this.urlBackendApi}/ere/encabezado-preguntas/guardarActualizarEncabezadoPregunta`,
            data
        )
    }

    obtenerEncabezadosPreguntas(params) {
        return this.http
            .get(
                `${this.urlBackendApi}/ere/preguntas/obtenerEncabezadosPreguntas`,
                {
                    params,
                }
            )
            .pipe(map((resp) => resp['data']))
    }

    eliminarEncabezadoPreguntaById(id) {
        return this.http.delete(
            `${this.urlBackendApi}/ere/encabezado-preguntas/eliminarEncabezadoPreguntaById/${id}`
        )
    }

    actualizarMatrizPreguntas(data) {
        return this.http.patch(
            `${this.urlBackendApi}/ere/preguntas/actualizarMatrizPreguntas`,
            data
        )
    }

    obtenerBancoPreguntas(params) {
        return this.http
            .get(`${this.urlBackendApi}/ere/preguntas/obtenerBancoPreguntas`, {
                params,
            })
            .pipe(
                map((resp) => resp['data']),
                map((data) => mapData(data))
            )
    }

    obtenerCompetencias(params) {
        return this.http
            .get(`${this.urlBackendApi}/ere/competencias/obtenerCompetencias`, {
                params,
            })
            .pipe(map((resp) => resp['data']))
    }

    obtenerCapacidades(params) {
        return this.http.get(
            `${this.urlBackendApi}/ere/capacidades/obtenerCapacidades`,
            { params }
        )
    }

    obtenerDesempenos(params) {
        return this.http
            .get(`${this.urlBackendApi}/ere/desempenos/obtenerDesempenos`, {
                params,
            })
            .pipe(map((resp) => resp['data']))
    }

    generarWordEvaluacionByIds(baseParams) {
        const url = `${this.urlBackend}/generarWordEvaluacionByIds`
        const params = new URLSearchParams({ ...baseParams })
        const fullUrl = `${url}?${params.toString()}`
        window.open(fullUrl, '_blank')
    }

    exportarPreguntasPorArea(params) {
        const url = `${this.urlBackendAspNet}/api/ere/evaluaciones/${params.iEvaluacionId}/areas/${params.iCursosNivelGradId}/archivo-preguntas`
        window.open(url, '_blank')
    }

    descargarPreguntasPorArea(params) {
        const url = `${this.urlBackendApi}/ere/evaluaciones/${params.iEvaluacionId}/areas/${params.iCursosNivelGradId}/archivo-preguntas`
        window.open(url, '_blank')
    }

    descargarMatrizPorEvaluacionArea(params) {
        const url = `${this.urlBackendApi}/ere/evaluaciones/${params.iEvaluacionId}/areas/${params.iCursosNivelGradId}/matriz-competencias?docente=${params.iDocenteId}`
        window.open(url, '_blank')
    }

    guardarFechaCantidadExamenCursos(data: {
        iEvaluacionId: number
        iCursoNivelGradId: number | string
        dtExamenFechaInicio
        iExamenCantidadPreguntas: number
    }): Observable<any> {
        return this.http.post(
            `${this.urlBackendApi}/ere/Evaluaciones/guardarFechaCantidadExamenCursos`,
            data
        )
    }
}
