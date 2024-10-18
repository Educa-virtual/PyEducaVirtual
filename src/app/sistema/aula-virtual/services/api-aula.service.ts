import { environment } from '@/environments/environment'
import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { map } from 'rxjs'
import {
    mapData,
    mapItemsBancoToEre,
} from '../../evaluaciones/sub-evaluaciones/banco-preguntas/models/pregunta-data-transformer'

@Injectable({
    providedIn: 'root',
})
export class ApiAulaService {
    private baseUrlApi = environment.backendApi
    private _http = inject(HttpClient)
    constructor() {}

    guardarActividad(data) {
        return this._http.post(
            `${this.baseUrlApi}/aula-virtual/contenidos/actividad/guardarActividad`,
            data
        )
    }
    guardarForo(data) {
        return this._http.post(
            `${this.baseUrlApi}/aula-virtual/contenidos/foro/guardarForo`,
            data
        )
    }

    eliminarActividad(data) {
        return this._http.delete(
            `${this.baseUrlApi}/aula-virtual/contenidos/actividad/eliminarActividad`,
            { params: data }
        )
    }

    contenidoSemanasProgramacionActividades(params) {
        return this._http
            .get<any>(
                `${this.baseUrlApi}/aula-virtual/contenidos/contenidoSemanasProgramacionActividades`,
                { params }
            )
            .pipe(map((resp) => resp.data))
    }

    obtenerActividad(params: { iActTipoId; ixActivadadId }) {
        return this._http
            .get<any>(
                `${this.baseUrlApi}/aula-virtual/contenidos/actividad/obtenerActividad`,
                { params }
            )
            .pipe(
                map((resp) => resp.data),
                map((data) => {
                    if (data.iActTipoId == 3) {
                        const preguntas = mapItemsBancoToEre(data.preguntas)
                        data.preguntas = mapData(preguntas)
                    }
                    return data
                })
            )
    }
}
