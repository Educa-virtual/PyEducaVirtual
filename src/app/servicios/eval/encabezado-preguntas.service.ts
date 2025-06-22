import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '@/environments/environment'
import { Observable } from 'rxjs'

const baseUrl = environment.backendApi

@Injectable({
    providedIn: 'root',
})
export class EncabezadoPreguntasService {
    constructor(private http: HttpClient) {}

    guardarEncabezadoPreguntas(data): Observable<any> {
        return this.http.post(
            `${baseUrl}/evaluaciones/encabezado-preguntas`,
            data
        )
    }

    actualizarEncabezadoPreguntas(
        idEncabPregId: string | number,
        params
    ): Observable<any> {
        return this.http.put(
            `${baseUrl}/evaluaciones/encabezado-preguntas/${idEncabPregId}`,
            params
        )
    }

    eliminarEncabezadoPreguntasxidEncabPregId(
        idEncabPregId: string | number,
        params
    ): Observable<any> {
        return this.http.delete(
            `${baseUrl}/evaluaciones/encabezado-preguntas/${idEncabPregId}`,
            {
                params,
            }
        )
    }
}
