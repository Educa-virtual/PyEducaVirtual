import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '@/environments/environment'
import { Observable } from 'rxjs'

const baseUrl = environment.backendApi

@Injectable({
    providedIn: 'root',
})
export class DetalleMatriculasService {
    constructor(private http: HttpClient) {}

    guardarConclusionDescriptiva(
        iDetMatrId: string | number,
        params: {
            iEscalaCalifIdPromedio: string | number
            iEstudianteId: string | number
            iMatrId: string | number
            iIeCursoId: string | number
            cDetMatConclusionDescPromedio: string
            iSeccionId: string | number
            idDocCursoId: string | number
            iCredId: string | number
        }
    ): Observable<any> {
        return this.http.put<any>(
            `${baseUrl}/acad/detalle-matriculas/${iDetMatrId}`,
            params
        )
    }
}
