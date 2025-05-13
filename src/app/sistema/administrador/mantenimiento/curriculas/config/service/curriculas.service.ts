import { ApiService } from '@/app/servicios/api.service'
import { environment } from '@/environments/environment'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'

const baseUrl = environment.backendApi

@Injectable({
    providedIn: 'root',
})
export class CurriculasService {
    endPoint: string = `${baseUrl}/administrador/addCurriculas`

    constructor(
        private http: HttpClient,
        private apiService: ApiService
    ) {}

    getCurriculas() {
        return this.apiService.getDataObs({
            esquema: 'acad',
            tabla: 'curriculas',
            campos: '*',
            where: '1=1',
        })
    }

    insCurriculas(data) {
        return this.http.post(this.endPoint, {
            json: data,
            opcion: 'addCurriculas',
        })
    }
}
