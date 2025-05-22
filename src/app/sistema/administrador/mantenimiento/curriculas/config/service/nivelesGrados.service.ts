import { ApiService } from '@/app/servicios/api.service'
import { environment } from '@/environments/environment'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'

const baseUrl = environment.backendApi

@Injectable({
    providedIn: 'root',
})
export class CursosNivelesGradosService {
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
            where: '1=1',
        })
    }

    getCursosNivelesGrados(iCurrId, iNivelGradoId) {
        return this.apiService.getDataObs({
            esquema: 'acad',
            tabla: 'V_CursosNivelesGrados',
            campos: '*',
            where: `iCurrId=${iCurrId} AND iNivelGradoId=${iNivelGradoId}`,
        })
    }

    insCursosNivelesGrados(data) {
        return this.http.post(this.endPoint + '/addCurriculas', {
            json: JSON.stringify(data),
            opcion: 'addCursosNivelesGrados',
        })
    }

    updCursosNivelesGrados(data) {
        return this.http.put(this.endPoint + '/updCurriculas', {
            json: JSON.stringify(data),
            opcion: 'updCursosNivelesGrados',
        })
    }
}
