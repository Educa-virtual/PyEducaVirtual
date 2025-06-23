import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '@/environments/environment'
import { Observable } from 'rxjs'

const baseUrl = environment.backendApi

@Injectable({
    providedIn: 'root',
})
export class EvaluacionPreguntasService {
    constructor(private http: HttpClient) {}

    guardarEvaluacionPreguntas(data): Observable<any> {
        return this.http.post(
            `${baseUrl}/evaluaciones/evaluacion-preguntas`,
            data
        )
    }

    obtenerEvaluacionPreguntasxiEvaluacionId(
        iEvaluacionId: string | number,
        params
    ): Observable<any> {
        return this.http.get(
            `${baseUrl}/evaluaciones/evaluacion-preguntas/${iEvaluacionId}`,
            {
                params,
            }
        )
    }

    obtenerEvaluacionPreguntasxiEvaluacionIdxiEstudianteId(
        iEvaluacionId: string | number,
        iEstudianteId: string | number,
        params
    ): Observable<any> {
        return this.http.get(
            `${baseUrl}/evaluaciones/evaluacion-preguntas/${iEvaluacionId}/estudiante/${iEstudianteId}`,
            {
                params,
            }
        )
    }

    actualizarEvaluacionPreguntasxiEvalPregId(
        iEvalPregId: string | number,
        params
    ): Observable<any> {
        return this.http.put(
            `${baseUrl}/evaluaciones/evaluacion-preguntas/${iEvalPregId}`,
            params
        )
    }

    eliminarEvaluacionPreguntasxiEvalPregId(
        iEvalPregId: string | number,
        params
    ): Observable<any> {
        return this.http.delete(
            `${baseUrl}/evaluaciones/evaluacion-preguntas/${iEvalPregId}`,
            {
                params,
            }
        )
    }
}
