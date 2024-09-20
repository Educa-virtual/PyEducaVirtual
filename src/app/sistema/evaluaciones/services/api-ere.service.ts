import { inject, Injectable } from '@angular/core'
import { environment } from '@/environments/environment'
import { HttpClient } from '@angular/common/http'

@Injectable({
    providedIn: 'root',
})
export class ApiEreService {
    private baseUrl = environment.backendApi
    private http = inject(HttpClient)
    constructor() {}

    actualizarMatrizPreguntas(data) {
        return this.http.patch(
            `${this.baseUrl}/ere/banco-preguntas/actualizarMatrizPreguntas`,
            data
        )
    }
}
