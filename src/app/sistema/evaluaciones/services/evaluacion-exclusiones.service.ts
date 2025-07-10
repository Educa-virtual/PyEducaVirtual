import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '@/environments/environment'
import { LocalStoreService } from '@/app/servicios/local-store.service'

const baseUrl = environment.backendApi

@Injectable({
    providedIn: 'root',
})
export class EvaluacionExclusionesService {
    constructor(
        private http: HttpClient,
        private store: LocalStoreService
    ) {}

    perfil = this.store.getItem('dremoPerfil')
    iYAcadId = this.store.getItem('dremoiYAcadId')

    verEvaluacion(iEvaluacionId: any) {
        return this.http.get(`${baseUrl}/ere/evaluaciones/${iEvaluacionId}`)
    }

    verExclusiones(data: any) {
        return this.http.post(
            `${baseUrl}/ere/Evaluaciones/verExclusiones`,
            data
        )
    }

    guardarExclusion(data: any) {
        return this.http.post(
            `${baseUrl}/ere/Evaluaciones/guardarExclusion`,
            data
        )
    }

    actualizarExclusion(data: any) {
        return this.http.post(
            `${baseUrl}/ere/Evaluaciones/actualizarExclusion`,
            data
        )
    }

    verExclusion(data: any) {
        return this.http.post(`${baseUrl}/ere/Evaluaciones/verExclusion`, data)
    }

    eliminarExclusion(data: any) {
        return this.http.post(
            `${baseUrl}/ere/Evaluaciones/eliminarExclusion`,
            data
        )
    }
}
