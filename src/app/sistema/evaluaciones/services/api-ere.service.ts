import { inject, Injectable } from '@angular/core'
import { environment } from '@/environments/environment.template'
import { HttpClient } from '@angular/common/http'
import { map } from 'rxjs'

@Injectable({
    providedIn: 'root',
})
export class ApiEreService {
    private baseUrl = environment.backendApi
    private http = inject(HttpClient)
    constructor() {}

    actualizarMatrizPreguntas(data) {
        return this.http.patch(
            `${this.baseUrl}/ere/preguntas/actualizarMatrizPreguntas`,
            data
        )
    }

    obtenerBancoPreguntas(params) {
        return this.http
            .get(`${this.baseUrl}/ere/preguntas/obtenerBancoPreguntas`, {
                params,
            })
            .pipe(
                map((resp) => {
                    return resp['data'].map((item) => {
                        if (item.preguntas != null) {
                            item.preguntas = item.preguntas.map((subItem) => {
                                subItem.time = `${subItem.iHoras}h ${subItem.iMinutos}m ${subItem.iSegundos}s`
                                return subItem
                            })
                        } else {
                            item.time = `${item.iHoras}h ${item.iMinutos}m ${item.iSegundos}s`
                        }
                        return item
                    })
                })
            )
    }

    obtenerCompetencias(params) {
        return this.http
            .get(`${this.baseUrl}/ere/competencias/obtenerCompetencias`, {
                params,
            })
            .pipe(map((resp) => resp['data']))
    }

    obtenerCapacidades(params) {
        return this.http.get(
            `${this.baseUrl}/ere/capacidades/obtenerCapacidades`,
            { params }
        )
    }

    obtenerDesempenos(params) {
        return this.http
            .get(`${this.baseUrl}/ere/desempenos/obtenerDesempenos`, { params })
            .pipe(map((resp) => resp['data']))
    }

    obtenerIE(params) {
        return this.http.get(`${this.baseUrl}/ere/ie/obtenerIE`, { params })
    }
    obtenerNivelTipo(params) {
        return this.http.get(`${this.baseUrl}/ere/ie/obtenerIE`, { params })
    }
}
