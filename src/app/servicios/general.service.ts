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
            `${baseUrl}/acad/calendarioAcademico/selDiasLaborales`

            /*
            `${baseUrl}/acad/calendarioAcademico/selCalAcademico`,
            {
                json: JSON.stringify({ jmod: 'grl', jtable: 'dias' }),
                _opcion: 'getConsulta',
            }*/
        )
    }
    

    getModalidad() {
        return this.http.post(
            `${baseUrl}/acad/calendarioAcademico/searchCalAcademico`,
            {
                esquema: 'acad',
                tabla: 'modalidad_servicios',
                campos: '*',
                condicion: '1 = 1',
            }
        )
    }
    getTurno() {
        return this.http.post(
            `${baseUrl}/acad/calendarioAcademico/searchCalAcademico`,
            {
                esquema: 'acad',
                tabla: 'turnos',
                campos: '*',
                condicion: '1 = 1',
            }
        )
    }
    getPeriodos() {
        return this.http.post(
            `${baseUrl}/acad/calendarioAcademico/searchCalAcademico`,
            {
                esquema: 'acad',
                tabla: 'periodo_evaluaciones',
                campos: '*',
                condicion: '1 = 1',
            }
        )
    }
    getYearAcademicos() {
        return this.http.post(
            `${baseUrl}/acad/calendarioAcademico/searchCalAcademico`,
            {
                esquema: 'acad',
                tabla: 'year_academicos',
                campos: '*',
                condicion: '1 = 1',
            }
        )
    }

    getYear() {
        // devuelve informacion en tabla grl.years sin filtro
        return this.http.post(
            `${baseUrl}/acad/calendarioAcademico/searchCalAcademico`,
            {
                esquema: 'grl',
                tabla: 'years',
                campos: '*',
                condicion: '1 = 1',
            }
        )
    }

    addAno(data: any) {
        return this.http.post(
            `${baseUrl}/acad/calendarioAcademico/addYear`,
            data
        )
    }
    addAmbienteAcademico(data: any) {
        return this.http.post(
            `${baseUrl}/acad/calendarioAcademicos/addAmbiente`,
            data
        )
    }

    updateAcademico(data: any) {
        return this.http.post(
            `${baseUrl}/acad/calendarioAcademicos/updateCalendario`,
            data
        )
    }

    deleteAcademico(data: any) {
        return this.http.post(
            `${baseUrl}/acad/calendarioAcademicos/deleteCalendario`,
            data
        )
    }

    searchCalAcademico(data: any) {
        return this.http.post(
            `${baseUrl}/acad/calendarioAcademico/searchCalAcademico`,
            data
        )
    }
    searchAmbienteAcademico(data: any) {
        return this.http.post(
            `${baseUrl}/acad/calendarioAcademicos/searchAmbiente`,
            data
        )
    }
    searchEstadoConfiguracion() {
        return this.http.post(
            `${baseUrl}/acad/calendarioAcademico/searchCalAcademico`,
            {
                esquema: 'acad',
                tabla: 'estado_configuraciones',
                campos: 'iEstadoConfigId, cEstadoConfigNombre',
                condicion: '1 = 1 ',
            }
        )
    }
}
