import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '@/environments/environment'
import { Observable } from 'rxjs'

const baseUrl = environment.backendApi

@Injectable({
    providedIn: 'root',
})
export class AulaVirtualService {
    constructor(private http: HttpClient) {}

    guardarRespuestaEstudiante(
        iCuestionarioId: string | number,
        iEstudianteId: string | number,
        params
    ): Observable<any> {
        // http://127.0.0.1:8000/api/aula-virtual/pregunta-alternativas-respuestas/cuestionario/{{iCuestionarioId}}/estudiante/{{iEstudianteId}}
        return this.http.put(
            `${baseUrl}/aula-virtual/pregunta-alternativas-respuestas/cuestionario/${iCuestionarioId}/estudiante/${iEstudianteId}`,
            params
        )
    }
}
