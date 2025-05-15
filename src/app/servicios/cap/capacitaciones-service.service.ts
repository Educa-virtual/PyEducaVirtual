import { environment } from '@/environments/environment'
import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'

// import { map } from 'rxjs'

@Injectable({
    providedIn: 'root',
})
export class CapacitacionesServiceService {
    private baseUrlApi = environment.backendApi
    private _http = inject(HttpClient)

    constructor() {}

    obtenerIntructores(params) {
        return this._http.get<any>(`${this.baseUrlApi}/cap/instructores`, {
            params,
        })
        // .pipe(
        //     map((resp) => resp.data)
        // )
    }
}
