import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '@/environments/environment'

const baseUrl = environment.backendApi
const baseUrlPublic = environment.backend
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

    generarPdf(data: any) {
        return this.http.post(
            `${baseUrl}/${data.group}/${data.prefix}/${data.ruta}`,
            data.data,
            {
                responseType: 'blob',
            }
        )
    }

    // Modulo de Gestion
    getDias() {
        return this.http.post(
            `${baseUrl}/acad/calendarioAcademico/searchCalAcademico`,
            {
                esquema: 'grl',
                tabla: 'dias',
                campos: '*',
                condicion: '1 = 1',
            }
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

    addMaestro(data: any) {
        return this.http.post(
            `${baseUrl}/acad/gestionInstitucional/insertMaestro`,
            data
        )
    }

    addMaestroDetalle(data: any) {
        return this.http.post(
            `${baseUrl}/acad/gestionInstitucional/insertMaestroDetalle`,
            data
        )
    }

    addYear(data: any) {
        return this.http.post(
            `${baseUrl}/acad/calendarioAcademico/addYear`,
            data
        )
    }
    updateYear(data: any) {
        return this.http.post(
            `${baseUrl}/acad/calendarioAcademico/updateYear`,
            data
        )
    }

    deleteYear(data: any) {
        return this.http.post(
            `${baseUrl}/acad/calendarioAcademico/deleteYear`,
            data
        )
    }

    addCalAcademico(data: any) {
        return this.http.post(
            `${baseUrl}/acad/calendarioAcademico/addCalAcademico`,
            data
        )
    }

    addAmbienteAcademico(data: any) {
        return this.http.post(
            `${baseUrl}/acad/calendarioAcademico/addAmbiente`,
            data
        )
    }

    updateAcademico(data: any) {
        return this.http.post(
            `${baseUrl}/acad/calendarioAcademico/updateCalendario`,
            data
        )
    }

    deleteAcademico(data: any) {
        return this.http.post(
            `${baseUrl}/acad/calendarioAcademico/deleteCalendario`,
            data
        )
    }
    searchTablaXwhere(data: any) {
        return this.http.post(
            `${baseUrl}/acad/calendarioAcademico/searchCalAcademico`,
            data
        )
    }

    searchCalAcademico(data: any) {
        return this.http.post(
            `${baseUrl}/acad/calendarioAcademico/searchCalAcademico`,
            data
        )
    }

    searchCalendario(data: any) {
        return this.http.post(
            `${baseUrl}/acad/calendarioAcademico/searchAcademico`,
            data
        )
    }

    searchAmbienteAcademico(data: any) {
        return this.http.post(
            `${baseUrl}/acad/calendarioAcademico/searchAmbiente`,
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
    baseUrlPublic() {
        return baseUrlPublic
    }
    searchGradoCiclo(data: any) {
        return this.http.post(
            `${baseUrl}/acad/calendarioAcademico/searchGradoCiclo`,
            data
        )
    }
    searchPersonalIes(data: any) {
        return this.http.post(
            `${baseUrl}/acad/gestionInstitucional/listarPersonalIes`,
            data
        )
    }
}
