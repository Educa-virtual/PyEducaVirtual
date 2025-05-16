import { ApiService } from '@/app/servicios/api.service'
import { environment } from '@/environments/environment'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'

const baseUrl = environment.backendApi

@Injectable({
    providedIn: 'root',
})
export class CursosService {
    endPoint: string = `${baseUrl}/administrador/addCurriculas`

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

    insCursos(data) {
        return this.http.post(this.endPoint, {
            json: JSON.stringify(data),
            opcion: 'addCursos',
        })
    }
}
