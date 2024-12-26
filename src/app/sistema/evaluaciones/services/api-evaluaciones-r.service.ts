import { inject, Injectable } from '@angular/core'
import { environment } from '@/environments/environment.template'
import { HttpClient } from '@angular/common/http'
import { catchError, map, Observable, tap, throwError } from 'rxjs'
import { mapData } from '../sub-evaluaciones/banco-preguntas/models/pregunta-data-transformer'

@Injectable({
    providedIn: 'root',
})
export class ApiEvaluacionesRService {
    private baseUrl = environment.backendApi
    private baseUrlBackend = environment.backend
    private http = inject(HttpClient)
    constructor() {}

    obtenerEvaluacion(params) {
        return this.http
            .get(`${this.baseUrl}/ere/Evaluaciones/ereObtenerEvaluacion`, {
                params,
            })
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

    obtenerTipoPreguntas() {
        return this.http
            .get(
                `${this.baseUrl}/evaluaciones/tipo-preguntas/obtenerTipoPreguntas`
            )
            .pipe(map((resp) => resp['data']))
    }

    obtenerUgeles(params) {
        return this.http.get(`${this.baseUrl}/ere/Ugeles/obtenerUgeles`, {
            params,
        })
    }
    obtenerIE(params) {
        return this.http.get(`${this.baseUrl}/ere/ie/obtenerIE`, { params })
    }

    obtenerNivelTipo(params) {
        return this.http.get(`${this.baseUrl}/ere/nivelTipo/obtenerNivelTipo`, {
            params,
        })
    }
    //Tengo estos cursos en el backend
    obtenerCursos(params) {
        return this.http.post(
            `${this.baseUrl}/ere/Evaluaciones/obtenerCursos`,
            {
                params,
            }
        )
    }
    //Tengo estos cursos seleccionados del backend
    obtenerCursosEvaluacion(iEvaluacionId: number): Observable<any> {
        return this.http.get(
            `${this.baseUrl}/ere/Evaluaciones/evaluaciones/${iEvaluacionId}/cursos`
        )
    }
    //Insertar cursos
    insertarCursos(data: {
        iEvaluacionId: number
        selectedCursos: { iCursoNivelGradId: number }[]
    }): Observable<any> {
        return this.http.post(
            `${this.baseUrl}/ere/Evaluaciones/insertarCursos`,
            data
        )
    }
    eliminarCursos(data: {
        iEvaluacionId: number
        selectedCursos: { iCursoNivelGradId: number }[]
    }): Observable<any> {
        return this.http.delete(
            `${this.baseUrl}/ere/Evaluaciones/eliminarCursos`,
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

        return this.http.put(this.baseUrl, body)
    }
    obtenerEvaluacionesCopia(params) {
        return this.http.get(
            `${this.baseUrl}/ere/Evaluaciones/obtenerEvaluacionCopia2`,
            {
                params,
            }
        )
    }
    obtenerTipoEvaluacion(params) {
        return this.http.get(
            `${this.baseUrl}/ere/tipoEvaluacion/obtenerTipoEvaluacion`,
            { params }
        )
    }
    obtenerNivelEvaluacion(params) {
        return this.http.get(
            `${this.baseUrl}/ere/nivelEvaluacion/obtenerNivelEvaluacion`,
            { params }
        )
    }
    // insert_Code_New
    guardarEvaluacion(data: any) {
        return this.http.post(`${this.baseUrl}/ere/Evaluaciones/guardar`, data)
    }
    // Método para actualizar una evaluación
    actualizarEvaluacion(data: any) {
        return this.http.put(
            `${this.baseUrl}/ere/Evaluaciones/actualizar/${data.iEvaluacionId}`,
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
            `${this.baseUrl}/ere/Evaluaciones/obtenerParticipaciones/${iEvaluacionId}`
        )
    }
    //!
    guardarActualizarPreguntaConAlternativas(data) {
        return this.http.post(
            `${this.baseUrl}/ere/preguntas/guardarActualizarPreguntaConAlternativas`,
            data
        )
    }
    guardarParticipacion(data) {
        return this.http.post(
            `${this.baseUrl}/ere/Evaluaciones/guardarParticipacion`,
            data
        )
    }

    eliminarParticipacion(participaciones: any[]): Observable<any> {
        return this.http.delete(
            `${this.baseUrl}/ere/Evaluaciones/eliminarParticipacion`,
            { body: { participaciones: participaciones } } // Enviamos un array de objetos con iIieeId e iEvaluacionId
        )
    }
    IEparticipanall(data) {
        return this.http.post(
            `${this.baseUrl}/ere/Evaluaciones/IEparticipanall`,
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
            `${this.baseUrl}/ere/Evaluaciones/actualizarCursos`,
            data
        )
    }
    //!Agregando Copiar ActualizarEvaluacion
    copiarEvaluacion(iEvaluacionId: number) {
        return this.http.post(
            `${this.baseUrl}/ere/Evaluaciones/copiarEvaluacion`,
            { iEvaluacionIdOriginal: iEvaluacionId }
        )
    }
    //!MatrizCompetencias
    obtenerMatrizCompetencias(params) {
        return this.http.get(
            `${this.baseUrl}/ere/Evaluaciones/obtenerMatrizCompetencias`,
            { params }
        )
    }
    //!Matriz Capacidades
    obtenerMatrizCapacidades(params) {
        return this.http.get(
            `${this.baseUrl}/ere/Evaluaciones/obtenerMatrizCapacidades`,
            { params }
        )
    }
    //!Matriz Desempeno
    insertarMatrizDesempeno(datapayload: any) {
        return this.http.post(
            `${this.baseUrl}/ere/Evaluaciones/insertarMatrizDesempeno`,
            datapayload
        )
    }
    generarPdfMatrizbyEvaluacionId(baseParams): Observable<any> {
        console.log('Parámetros enviados al backend:', baseParams)
        return this.http.get(
            `${this.baseUrl}/ere/Evaluaciones/generarPdfMatrizbyEvaluacionId`,
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
            `${this.baseUrl}/ere/Evaluaciones/obtenerEspDremCurso`,
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
            `${this.baseUrl}/ere/Evaluaciones/obtenerConteoPorCurso`,
            data
        )
    }
    //!
    insertarPreguntaSeleccionada(data) {
        return this.http.post(
            `${this.baseUrl}/ere/Evaluaciones/insertarPreguntaSeleccionada`,
            data
        )
    }
    obtenerPreguntaSeleccionada(iEvaluacionId: number) {
        return this.http.get(
            `${this.baseUrl}/ere/Evaluaciones/obtenerPreguntaSeleccionada`,
            {
                params: {
                    iEvaluacionId: iEvaluacionId.toString(), // Convertir a cadena si es necesario
                },
            }
        )
    }
    obtenerPreguntaInformacion(iEvaluacionId: number, iPreguntaIds: string) {
        return this.http.get(
            `${this.baseUrl}/ere/Evaluaciones/obtenerPreguntaInformacion`,
            {
                params: {
                    iEvaluacionId: iEvaluacionId.toString(), // Convertir a cadena si es necesario
                    iPreguntaIds: iPreguntaIds.toString(), // Convertir a cadena si es necesario
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
        const url = `${this.baseUrl}/ere/Evaluaciones/guardarInicioFinalExmAreas` // Endpoint de Laravel
        return this.http.post<any>(url, datos)
    }

    //Banco de Preguntas no tocar ->
    generarWordByPreguntasIds(baseParams) {
        const url = `${this.baseUrlBackend}/generarWordBancoPreguntasSeleccionadas`
        const params = new URLSearchParams({ ...baseParams })
        const fullUrl = `${url}?${params.toString()}`
        window.open(fullUrl, '_blank')
    }

    eliminarPreguntaById(id) {
        return this.http.delete(
            `${this.baseUrl}/ere/preguntas/eliminarBancoPreguntasById/${id}`
        )
    }

    actualizarBancoPreguntas(data) {
        return this.http.patch(
            `${this.baseUrl}/ere/preguntas/actualizarBancoPreguntas`,
            data
        )
    }

    guardarActualizarAlternativa(data) {
        return this.http.post(
            `${this.baseUrl}/ere/alternativas/guardarActualizarAlternativa`,
            data
        )
    }

    eliminarAlternativaById(id) {
        return this.http.delete(
            `${this.baseUrl}/ere/alternativas/eliminarAlternativaById/${id}`
        )
    }

    obtenerAlternativaByPreguntaId(id) {
        return this.http
            .get(
                `${this.baseUrl}/ere/alternativas/obtenerAlternativaByPreguntaId/${id}`
            )
            .pipe(map((resp) => resp['data']))
    }

    // encabezados preguntas

    guardarActualizarPreguntas(data) {
        return this.http.post(
            `${this.baseUrl}/ere/encabezado-preguntas/guardarActualizarEncabezadoPregunta`,
            data
        )
    }

    obtenerEncabezadosPreguntas(params) {
        return this.http
            .get(`${this.baseUrl}/ere/preguntas/obtenerEncabezadosPreguntas`, {
                params,
            })
            .pipe(map((resp) => resp['data']))
    }

    eliminarEncabezadoPreguntaById(id) {
        return this.http.delete(
            `${this.baseUrl}/ere/encabezado-preguntas/eliminarEncabezadoPreguntaById/${id}`
        )
    }

    actualizarMatrizPreguntas(data) {
        return this.http.patch(
            `${this.baseUrl}/ere/preguntas/actualizarMatrizPreguntas`,
            data
        )
    }

    obtenerBancoPreguntas(params) {
        return this.http
            .get(`${this.baseUrl}/ere/preguntas/obtenerBancoPreguntas`, {
                params,
            })
            .pipe(
                map((resp) => resp['data']),
                map((data) => mapData(data))
            )
    }

    obtenerCompetencias(params) {
        return this.http
            .get(`${this.baseUrl}/ere/competencias/obtenerCompetencias`, {
                params,
            })
            .pipe(map((resp) => resp['data']))
    }

    obtenerCapacidades(params) {
        return this.http.get(
            `${this.baseUrl}/ere/capacidades/obtenerCapacidades`,
            { params }
        )
    }

    obtenerDesempenos(params) {
        return this.http
            .get(`${this.baseUrl}/ere/desempenos/obtenerDesempenos`, { params })
            .pipe(map((resp) => resp['data']))
    }

    generarWordEvaluacionByIds(baseParams) {
        const url = `${this.baseUrlBackend}/generarWordEvaluacionByIds`
        const params = new URLSearchParams({ ...baseParams })
        const fullUrl = `${url}?${params.toString()}`
        window.open(fullUrl, '_blank')
    }
}
