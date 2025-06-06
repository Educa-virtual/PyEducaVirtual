import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '@/environments/environment'
import { map } from 'rxjs'

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
    getGralPrefixx(data) {
        let url = `${baseUrl}/${data.group}/${data.prefix}/`

        if (!data.ruta) {
            url += ``
        } else {
            url += `${data.ruta}`
        }

        switch (data.petition) {
            case 'get':
                return this.http.get(url, { params: data.params })
            case 'post':
                return this.http.post(url, data.data, { params: data.params })
            case 'put':
                return this.http.put(url, data.data, { params: data.params })
            case 'delete':
                return this.http.delete(url, { params: data.params })
            default:
                // return throwError(() => new Error('Tipo de petición no válido'));
                return this.url
        }
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

    updateCalAcademico(data: any) {
        // coleccion de procedimiento para calendario academico y usuarios
        return this.http.post(
            `${baseUrl}/acad/calendarioAcademico/updateCalAcademico`,
            data
        )
    }

    deleteCalAcademico(data: any) {
        // coleccion de procedimiento para calendario academico y usuarios
        return this.http.post(
            `${baseUrl}/acad/calendarioAcademico/deleteCalAcademico`,
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
            `${baseUrl}/acad/calendarioAcademico/searchCalAcademico`, //procedimiento general
            data
        )
    }
    searchCalendario(data: any) {
        return this.http.post(
            `${baseUrl}/acad/calendarioAcademico/searchAcademico`, // acad.SP_SEL_stepCalendarioAcademicoDesdeJsonOpcion
            data
        )
    } //searchAcademico

    searchAmbienteAcademico(data: any) {
        return this.http.post(
            `${baseUrl}/acad/calendarioAcademico/searchAmbiente`, //acad.SP_SEL_stepAmbienteAcademicoDesdeJsonOpcion
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
    searchHorarioIes(data: any) {
        return this.http.post(`${baseUrl}/acad/horario/listarHorarioIes`, data)
    }
    reporteHorasNivelGrado(data: any) {
        return this.http.post(
            `${baseUrl}/acad/gestionInstitucional/reporteHorasNivelGrado`,
            data
        )
    }
    reporteSeccionesNivelGrado(data: any) {
        return this.http.post(
            `${baseUrl}/acad/gestionInstitucional/reporteSeccionesNivelGrado`,
            data
        )
    }

    // Método para obtener datos desde el backend
    getDatos(tabla: string, campos: string, where: any) {
        return this.http
            .post<any>(
                `${baseUrl}/aula-virtual/Resultado/obtenerCalificacionesFinalesReporte`,
                {
                    tabla: 'detalle_matriculas',
                    where,
                    campos,
                }
            )
            .pipe(
                map((response) => {
                    if (!response || !response.data) {
                        throw new Error(
                            'La respuesta no contiene datos válidos'
                        )
                    }
                    return response.data
                })
                // map((data) => {
                //     if (data.iActTipoId == 2) {
                //         const preguntas = mapItemsBancoToEre(data.preguntas)
                //         data.preguntas = mapData(preguntas)
                //     }
                //     return data
                // })
            )
    }

    //GESTION DE TRASLADOS
    searhTipoTraslados() {
        return this.http.post(
            `${baseUrl}/acad/calendarioAcademico/searchCalAcademico`,
            {
                esquema: 'acad',
                tabla: 'tipos_traslado_ies',
                campos: '*',
                condicion: '1=1',
            }
        )
    }
    obtenerInformacionEstudianteDNI(data: any) {
        return this.http.post(
            `${baseUrl}/acad/gestionInstitucional/obtenerInformacionEstudianteDNI`,
            data
        )
    }
    obtenerCredencialesSede(data: any) {
        return this.http.post(
            `${baseUrl}/acad/gestionInstitucional/obtenerCredencialesSede`,
            data
        )
    }
    importarDocente_IE(data: any) {
        return this.http.post(
            `${baseUrl}/acad/gestionInstitucional/importarDocente_IE`,
            data
        )
    }

    importarAmbiente_IE(data: any) {
        return this.http.post(
            `${baseUrl}/acad/gestionInstitucional/importarAmbiente_IE`,
            data
        )
    }

    //Genera credenciales para personal de IE y asignacion de credenciales a IE
    generarCredencialesIE(data: any) {
        return this.http.post(
            `${baseUrl}/acad/gestionInstitucional/generarCredencialesIE`,
            data
        )
    }
    validarPersona(data: any) {
        return this.http.post(`${baseUrl}/grl/validarPersona`, data)
    }

    generarConfiguracionMasivaInicio(data: any) {
        return this.http.post(
            `${baseUrl}/acad/calendarioAcademico/generarConfiguracionMasivaInicio`,
            data
        )
    }

    agregarCurriculas(data: any) {
        return this.http.post(`${baseUrl}/administrador/addCurriculas`, data)
    }
    actualizarCurriculas(data: any) {
        return this.http.post(`${baseUrl}/administrador/updCurriculas`, data)
    }
}
