import { environment } from '@/environments/environment'
import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
// import { map } from 'rxjs'

// import { ApiResponse } from '@/app/shared/interfaces/api-response.model'

@Injectable({
    providedIn: 'root',
})
export class CapacitacionesServiceService {
    private baseUrlApi = environment.backendApi
    private _http = inject(HttpClient)

    constructor() {}

    obtenerIntructores(data) {
        return this._http.post(
            `${this.baseUrlApi}/cap/tipo-capacitaciones/listarTipoCapacitaciones`,
            data
        )
    }
}
