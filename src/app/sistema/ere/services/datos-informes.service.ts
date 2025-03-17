import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '@/environments/environment'

const baseUrl = environment.backendApi

@Injectable({
    providedIn: 'root',
})
export class DatosInformesService {
    constructor(private http: HttpClient) {}

    lista: any[] = []
    sexos: Array<object>

    getSexos() {
        if (!this.sexos) {
            this.sexos = [
                { label: 'MASCULINO', value: 'M' },
                { label: 'FEMENINO', value: 'F' },
            ]
        }
        return this.sexos
    }

    obtenerEvaluacionesCursosIes(data: any) {
        return this.http.post(
            `${baseUrl}/ere/Evaluaciones/obtenerEvaluacionesCursosIes`,
            data
        )
    }

    obtenerInformeResumen(data: any) {
        return this.http.post(
            `${baseUrl}/ere/Evaluaciones/obtenerInformeResumen`,
            data
        )
    }
}
