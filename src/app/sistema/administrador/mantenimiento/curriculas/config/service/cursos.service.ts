import { ApiService } from '@/app/servicios/api.service'
import { environment } from '@/environments/environment'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'

const baseUrl = environment.backendApi

@Injectable({
    providedIn: 'root',
})
export class CursosService {
    endPoint: string = `${baseUrl}/administrador`

    constructor(
        private http: HttpClient,
        private apiService: ApiService
    ) {}

    getCursos(iCurrId) {
        return this.apiService.getDataObs({
            esquema: 'acad',
            tabla: 'cursos',
            campos: '*',
            where: 'iCurrId=' + iCurrId,
        })
    }

    getTipoCursos() {
        return this.apiService.getDataObs({
            esquema: 'acad',
            tabla: 'tipo_cursos',
            campos: '*',
            where: '1=1',
        })
    }

    insCursos(data) {
        return this.http.post(this.endPoint + '/addCurriculas', {
            json: JSON.stringify(data),
            opcion: 'addCursos',
        })
    }

    updCursos(data) {
        return this.http.put(this.endPoint + '/updCurriculas', {
            json: JSON.stringify(data),
            opcion: 'updCursos',
        })
    }
}
