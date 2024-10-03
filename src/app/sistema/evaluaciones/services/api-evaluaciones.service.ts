import { environment } from '@/environments/environment.template'
import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { map } from 'rxjs'

@Injectable({
    providedIn: 'root',
})
export class ApiEvaluacionesService {
    private baseUrlApi = environment.backendApi
    private baseUrl = environment.backend
    private http = inject(HttpClient)
    constructor() {}

    obtenerTipoPreguntas() {
        return this.http
            .get(
                `${this.baseUrlApi}/evaluaciones/tipo-preguntas/obtenerTipoPreguntas`
            )
            .pipe(map((resp) => resp['data']))
    }
}
