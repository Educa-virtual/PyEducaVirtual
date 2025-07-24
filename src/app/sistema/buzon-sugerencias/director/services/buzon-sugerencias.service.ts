import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '@/environments/environment'

@Injectable({
    providedIn: 'root',
})
export class BuzonSugerenciasService {
    private urlBackendApi = environment.backendApi

    constructor(private http: HttpClient) {}

    obtenerListaSugerencias() {
        return this.http.get(
            `${this.urlBackendApi}/acad/directores/buzon-sugerencias`
        )
    }
}
