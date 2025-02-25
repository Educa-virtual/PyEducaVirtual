import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '@/environments/environment.template'

const baseUrl = environment.backendApi

@Injectable({
    providedIn: 'root',
})
export class DatosSugerenciaService {
    constructor(private http: HttpClient) {}

    lista: any[] = []

    buscarSugerencias(data: any) {
        return this.http.post(
            `${baseUrl}/acad/estudiante/buscarSugerencias`,
            data
        )
    }

    buscarSugerencia(data: any) {
        return this.http.post(
            `${baseUrl}/acad/estudiante/buscarSugerencia`,
            data
        )
    }

    guardarSugerencia(data: any) {
        return this.http.post(
            `${baseUrl}/acad/estudiante/guardarSugerencia`,
            data
        )
    }

    actualizarSugerencia(data: any) {
        return this.http.put(
            `${baseUrl}/acad/estudiante/actualizarSugerencia`,
            data
        )
    }

    eliminarSugerencia(data: any) {
        return this.http.delete(
            `${baseUrl}/acad/estudiante/eliminarSugerencia`,
            data
        )
    }
}
