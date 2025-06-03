import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '@/environments/environment'

const baseUrl = environment.backendApi

@Injectable({
    providedIn: 'root',
})
export class DatosSugerenciaService {
    constructor(private http: HttpClient) {}

    lista: any[] = []

    /**
     * Buscar sugerencias segun criterios de busqueda
     * @param data datos de busqueda
     * @returns Observable<any>
     */
    buscarSugerencias(data: any) {
        return this.http.post(
            `${baseUrl}/acad/estudiante/buscarSugerencias`,
            data
        )
    }

    /**
     * Buscar sugerencia segun criterios de busqueda
     * @param data datos de sugerencia seleccionada
     * @returns Observable<any>
     */
    buscarSugerencia(data: any) {
        return this.http.post(
            `${baseUrl}/acad/estudiante/buscarSugerencia`,
            data
        )
    }

    /**
     * Guardar sugerencia
     * @param data datos de nueva sugerencia
     * @returns Observable<any>
     */
    guardarSugerencia(data: any) {
        return this.http.post(
            `${baseUrl}/acad/estudiante/guardarSugerencia`,
            data
        )
    }

    /**
     * Actualizar sugerencia
     * @param data datos de sugerencia seleccionada
     * @returns Observable<any>
     */
    actualizarSugerencia(data: any) {
        return this.http.put(
            `${baseUrl}/acad/estudiante/actualizarSugerencia`,
            data
        )
    }

    /**
     * Eliminar sugerencia
     * @param data datos de sugerencia seleccionada
     * @returns Observable<any>
     */
    eliminarSugerencia(data: any) {
        return this.http.delete(
            `${baseUrl}/acad/estudiante/eliminarSugerencia`,
            data
        )
    }

    /**
     * Dar seguimiento a sugerencia
     * @param data datos de sugerencia seleccionada
     * @returns Observable<any>
     */
    buscarSugerenciaSeguimiento(data: any) {
        return this.http.post(`${baseUrl}/grl/sugerencias/seguimiento`, data)
    }
}
