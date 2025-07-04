import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '@/environments/environment'
import { Observable } from 'rxjs'

const baseUrl = environment.backendApi

@Injectable({
    providedIn: 'root',
})
export class TiposIdentificacionesService {
    constructor(private http: HttpClient) {}

    obtenerTipoIdentificaciones(): Observable<any[]> {
        return this.http.post<any[]>(
            `${baseUrl}/grl/listTipoIdentificaciones`,
            null
        )
    }
}
