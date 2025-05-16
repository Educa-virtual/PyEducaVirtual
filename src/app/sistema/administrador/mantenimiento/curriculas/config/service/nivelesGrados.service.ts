import { ApiService } from '@/app/servicios/api.service'
import { environment } from '@/environments/environment'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'

const baseUrl = environment.backendApi

@Injectable({
    providedIn: 'root',
})
export class NivelGradosService {
    endPoint: string = `${baseUrl}/administrador`

    constructor(
        private http: HttpClient,
        private apiService: ApiService
    ) {}

    getNivelGrados() {
        return this.apiService.getDataObs({
            esquema: 'acad',
            tabla: 'V_NivelesTiposGrados',
            campos: '*',
            where:
                'iNivelTipoId IS NULL OR iNivelTipoId = ' +
                JSON.parse(localStorage.getItem('dremoPerfil')).iNivelTipoId,
        })
    }
}
