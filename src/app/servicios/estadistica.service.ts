import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

interface AnioAcademico {
    iYAcadId: number
    iYearId: number
}

interface Grado {
    iGradoId: number
    cGradoNombre: string
}

interface EstadisticaResponse {
    anios: AnioAcademico[]
    grados: Grado[]
}

@Injectable({
    providedIn: 'root',
})
export class EstadisticaService {
    private apiUrl = 'http://localhost:8000/api/estadistica/anios-academicos'

    constructor(private http: HttpClient) {}

    obtenerAniosAcademicos(): Observable<EstadisticaResponse> {
        return this.http.get<EstadisticaResponse>(this.apiUrl)
    }
}
