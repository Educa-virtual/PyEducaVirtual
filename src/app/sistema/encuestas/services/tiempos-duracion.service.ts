import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '@/environments/environment'

@Injectable({
    providedIn: 'root',
})
export class TiemposDuracionService {
    constructor(private http: HttpClient) {}

    obtenerTiemposDuracion() {
        return this.http.get(`${environment.backendApi}/enc/tiempos-duracion`)
    }
}
