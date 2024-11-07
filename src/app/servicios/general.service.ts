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

    addYear(data) {
        //para almacenar calendario academico
        return this.http.post(
            `${baseUrl}/acad/calendarioAcademico/addCalAcademico`,
            data
        )
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
                json: JSON.stringify({ jmod: 'acad', jtable: 'turnos' }),
                _opcion: 'getConsulta',
            }
        )
    }
    getPeriodos() {
        return this.http.post(
            `${baseUrl}/acad/calendarioAcademico/addCalAcademico`,
            {
                json: JSON.stringify({
                    jmod: 'acad',
                    jtable: 'periodo_evaluaciones',
                }),
                _opcion: 'getConsulta',
            }
        )
    }
    getYearAcademicos() {
        return this.http.post(
            `${baseUrl}/acad/calendarioAcademico/addCalAcademico`,
            {
                json: JSON.stringify({
                    jmod: 'acad',
                    jtable: 'year_academicos',
                }),
                _opcion: 'getConsulta',
            }
        )
    }

    getYear() {
        return this.http.post(
            `${baseUrl}/acad/calendarioAcademico/addCalAcademico`,
            {
                json: JSON.stringify({
                    jmod: 'grl',
                    jtable: 'years',
                }),
                _opcion: 'getConsulta',
            }
        )
    }

    addAno(data: any) {
        return this.http.post(
            `${baseUrl}/acad/calendarioAcademico/addYear`,
            data
        )
    }

    searchCalAcademico(data: any) {
        return this.http.post(
            `${baseUrl}/acad/calendarioAcademico/searchCalAcademico`,
            data
        )
    }
}
