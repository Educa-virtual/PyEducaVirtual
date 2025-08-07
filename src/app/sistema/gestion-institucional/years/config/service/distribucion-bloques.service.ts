import { environment } from '@/environments/environment'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { of } from 'rxjs'

export const tiposDistribucion = [
    {
        iTipoDistribucionId: 1,
        cBloqueNombre: 'Semana lectiva',
    },
    {
        iTipoDistribucionId: 2,
        cBloqueNombre: 'Semana de gestión',
    },
]

@Injectable({ providedIn: 'root' })
export class DistribucionBloquesService {
    endPoint = `${environment.backendApi}/acad/distribucion-bloques`
    constructor(private http: HttpClient) {}

    getDistribucionBloques(iYearId?, iDistribucionBloqueId?) {
        if (iDistribucionBloqueId) {
            return this.http.get(
                `${this.endPoint}/getDistribucionBloques/${iYearId}/${iDistribucionBloqueId}`
            )
        }
        return this.http.get(
            `${this.endPoint}/getDistribucionBloques/${iYearId}`
        )
    }

    getTipoDistribucion() {
        const res: any = {
            validated: true,
            message: 'Tipos de distribución de bloque obtenidos correctamente.',
            data: tiposDistribucion,
        }

        return of(res)
    }

    insDistribucionBloques(data) {
        return this.http.post(`${this.endPoint}/insDistribucionBloques`, data)
    }

    updDistribucionBloque(data) {
        return this.http.put(`${this.endPoint}/updDistribucionBloques`, data)
    }

    deleteDistribucionBloque(iDistribucionBloqueId) {
        return this.http.delete(
            `${this.endPoint}/deleteDistribucionBloques/${iDistribucionBloqueId}`
        )
    }
}
