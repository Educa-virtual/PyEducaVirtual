import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '@/environments/environment'

@Injectable({
    providedIn: 'root',
})
export class BuzonSugerenciasDirectorService {
    private urlBackendApi = environment.backendApi

    constructor(private http: HttpClient) {}

    obtenerListaSugerencias() {
        return this.http.get(
            `${this.urlBackendApi}/acad/directores/buzon-sugerencias`
        )
    }

    responderSugerencia(iSugerenciaId: number, cRespuesta: string) {
        return this.http.post(
            `${this.urlBackendApi}/acad/directores/buzon-sugerencias`,
            { iSugerenciaId, cRespuesta }
        )
    }
}
