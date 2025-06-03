import { ApiService } from '@/app/servicios/api.service'
import { environment } from '@/environments/environment'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'

const baseUrl = environment.backendApi

@Injectable({
    providedIn: 'root',
})
export class ModalidadServicioService {
    endPoint: string = `${baseUrl}/administrador/addCurriculas`

    constructor(
        private http: HttpClient,
        private apiService: ApiService
    ) {}

    getModalidadServicios() {
        return this.apiService.getDataObs({
            esquema: 'acad',
            tabla: 'modalidad_servicios',
            campos: '*',
            where: '1=1',
        })
    }
}
