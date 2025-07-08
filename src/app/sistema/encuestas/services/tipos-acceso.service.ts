import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '@/environments/environment'

@Injectable({
    providedIn: 'root',
})
export class TiposAccesoService {
    constructor(private http: HttpClient) {}

    obtenerTiposAcceso() {
        return this.http.get(`${environment.backendApi}/enc/tipos-acceso`)
    }
}
