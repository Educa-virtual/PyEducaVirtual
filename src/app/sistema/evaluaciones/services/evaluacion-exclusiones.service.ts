import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '@/environments/environment'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { FormGroup } from '@angular/forms'

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

    listarExclusiones(data: any) {
        return this.http.post(
            `${baseUrl}/ere/Evaluaciones/listarExclusiones`,
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

    buscarMatricula(data: any) {
        return this.http.post(`${baseUrl}/acad/matricula/searchMatricula`, data)
    }

    getTiposDocumentos() {
        return this.http.post(`${baseUrl}/grl/listTipoIdentificaciones`, null)
    }

    formMarkAsDirty(form: FormGroup) {
        if (form) {
            form.markAllAsTouched()
            Object.keys(form.controls).forEach((key) => {
                form.get(key)?.markAsDirty()
            })
        }
    }
}
