import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '@/environments/environment'

const baseUrl = environment.backendApi

@Injectable({
    providedIn: 'root',
})
export class GeneralService {
    constructor(private http: HttpClient) {}
    url
    getGral(data) {
        switch (data.petition) {
            case 'post':
                this.url = this.http.post(`${baseUrl}/` + data.ruta, data.data)
                break
            default:
                break
        }
        return this.url
    }
    getGralPrefix(data) {
        switch (data.petition) {
            case 'post':
                this.url = this.http.post(
                    `${baseUrl}/` +
                        data.group +
                        '/' +
                        data.prefix +
                        '/' +
                        data.ruta,
                    data.data,
                    { params: data.params }
                )

                break
            default:
                break
        }
        return this.url
    }

    getGralReporte(data) {
        switch (data.petition) {
            case 'get':
                window.open(
                    `${baseUrl}/` +
                        `${data.group}/` +
                        `${data.prefix}/` +
                        `${data.ruta}/` +
                        `${data.iSilaboId}`
                )
                break
            default:
                break
        }
    }

    subirArchivo(data: any) {
        return this.http.post(`${baseUrl}/general/subir-archivo`, data)
    }

    getDias() {
        return this.http.get(
            `${baseUrl}/acad/calendarioAcademico/selCalAcademico?json={"jmod": "grl", "jtable": "dias"}&_opcion=getConsulta`

            /*
            `${baseUrl}/acad/calendarioAcademico/selCalAcademico`,
            {
                json: JSON.stringify({ jmod: 'grl', jtable: 'dias' }),
                _opcion: 'getConsulta',
            }*/
        )
    }

    getModalidad() {
        return this.http.get(
            `${baseUrl}/acad/calendarioAcademico/selCalAcademico?json={"jmod": "acad", "jtable": "modalidad_servicios"}&_opcion=getConsulta`
        )
    }

    getTurno() {
        return this.http.post(
            `${baseUrl}/acad/calendarioAcademico/addCalAcademico`,
            {
                json: JSON.stringify({ jmod: 'grl', jtable: 'turno' }),
                _opcion: 'getConsulta',
            }
        )
    }
}
