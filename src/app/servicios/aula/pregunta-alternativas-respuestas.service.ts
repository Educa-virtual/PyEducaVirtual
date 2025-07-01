import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '@/environments/environment'
import { Observable } from 'rxjs'

const baseUrl = environment.backendApi

@Injectable({
    providedIn: 'root',
})
export class PreguntaAlternativasRespuestasService {
    constructor(private http: HttpClient) {}

    guardarRespuestaEstudiante(
        iCuestionarioId: string | number,
        iEstudianteId: string | number,
        params
    ): Observable<any> {
        return this.http.put(
            `${baseUrl}/aula-virtual/pregunta-alternativas-respuestas/cuestionario/${iCuestionarioId}/estudiante/${iEstudianteId}`,
            params
        )
    }

    obtenerRespuestas(
        iCuestionarioId: string | number,
        iEstudianteId: string | number,
        params
    ): Observable<any> {
        return this.http.get(
            `${baseUrl}/aula-virtual/pregunta-alternativas-respuestas/cuestionario/${iCuestionarioId}/estudiante/${iEstudianteId}`,
            { params }
        )
    }

    finalizarPreguntaAlternativasRespuestas(
        iCuestionarioId: string | number,
        iEstudianteId: string | number,
        params
    ): Observable<any> {
        return this.http.put(
            `${baseUrl}/aula-virtual/pregunta-alternativas-respuestas/cuestionario/${iCuestionarioId}/estudiante/${iEstudianteId}/finalizado`,
            params
        )
    }

    obtenerResultadosxiCuestionarioId(
        iCuestionarioId: string | number,
        params
    ): Observable<any> {
        return this.http.get(
            `${baseUrl}/aula-virtual/pregunta-alternativas-respuestas/cuestionario/${iCuestionarioId}/resultados`,
            { params }
        )
    }
}
