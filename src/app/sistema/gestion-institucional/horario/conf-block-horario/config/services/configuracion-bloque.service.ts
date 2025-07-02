import { environment } from '@/environments/environment'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class ConfiguracionBloquesService {
    endPoint = `${environment.backendApi}/hor/configuracion-bloques`
    constructor(private http: HttpClient) {}

    getConfiguracionBloques(iConfBloqueId?) {
        if (iConfBloqueId) {
            return this.http.get(
                `${this.endPoint}/getConfiguracionBloques/${iConfBloqueId}`
            )
        }

        return this.http.get(`${this.endPoint}/getConfiguracionBloques`)
    }

    insConfiguracionBloque(data) {
        return this.http.post(`${this.endPoint}/insConfiguracionBloque`, data)
    }

    updConfiguracionBloque(data) {
        return this.http.put(`${this.endPoint}/updConfiguracionBloque`, data)
    }

    deleteConfiguracionBloque(iConfBloqueId) {
        return this.http.delete(
            `${this.endPoint}/deleteConfiguracionBloque/${iConfBloqueId}`
        )
    }
}
