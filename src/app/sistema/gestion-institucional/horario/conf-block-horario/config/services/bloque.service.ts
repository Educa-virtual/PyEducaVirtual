import { environment } from '@/environments/environment'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class BloqueService {
    endPoint = `${environment.backendApi}/hor/bloques`
    constructor(private http: HttpClient) {}

    getBloques(iConfBloqueId, iDetBloqueId?) {
        if (iDetBloqueId) {
            return this.http.get(
                `${this.endPoint}/getBloques/${iConfBloqueId}/${iDetBloqueId}`
            )
        }

        return this.http.get(`${this.endPoint}/getBloques/${iConfBloqueId}`)
    }

    insBloque(data) {
        return this.http.post(`${this.endPoint}/insBloque`, data)
    }

    updBloque(data) {
        return this.http.put(`${this.endPoint}/updBloque`, data)
    }

    deleteBloque(iDetBloqueId) {
        return this.http.delete(`${this.endPoint}/deleteBloque/${iDetBloqueId}`)
    }
}
