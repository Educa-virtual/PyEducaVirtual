import { inject, Injectable } from '@angular/core'
import { environment } from '@/environments/environment'
import { HttpClient } from '@angular/common/http'

@Injectable({
    providedIn: 'root',
})
export class ApiObtenerEuService {
    private baseUrl = environment.backendApi
    private http = inject(HttpClient)
    constructor() {}

    obtenerAutenticacion(params) {
        return this.http.get(
            `${this.baseUrl}/acad/AutenticarU/obtenerAutenticacion`,
            {
                params,
            }
        )
    }
}
