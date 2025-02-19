import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from '@/environments/environment.template'

const baseUrl = environment.backendApi

@Injectable({
    providedIn: 'root',
})
export class DatosMatriculaService {
    constructor(private http: HttpClient) {}

    lista: any[] = []

    tipos_documentos: Array<object>
    tipos_familiares: Array<object>
    estados_civiles: Array<object>
    sexos: Array<object>
    nacionalidades: Array<object>
    departamentos: Array<object>
    provincias: Array<object>
    distritos: Array<object>
    lenguas: Array<object>
    tipos_contacto: Array<object>
    religiones: Array<object>

    searchGradoSeccionTurno(data: any) {
        return this.http.post(
            `${baseUrl}/acad/matricula/searchGradoSeccionTurnoConf`,
            data
        )
    }

    searchMatriculas(data: any) {
        return this.http.post(
            `${baseUrl}/acad/matricula/searchMatriculas`,
            data
        )
    }

    searchGradoSeccionTurnoConf(data: any) {
        return this.http.post(
            `${baseUrl}/acad/matricula/searchGradoSeccionTurnoConf`,
            data
        )
    }

    guardarMatricula(data: any) {
        return this.http.post(
            `${baseUrl}/acad/matricula/guardarMatricula`,
            data
        )
    }

    updateMatricula(data: any) {
        return this.http.post(`${baseUrl}/acad/matricula/updateMatricula`, data)
    }

    deleteMatricula(data: any) {
        return this.http.post(`${baseUrl}/acad/matricula/deleteMatricula`, data)
    }

    searchNivelGrado(data: any) {
        return this.http.post(
            `${baseUrl}/acad/matricula/searchNivelGrado`,
            data
        )
    }

    subirArchivo(data: any) {
        return this.http.post(
            `${baseUrl}/acad/estudiante/importarEstudiantesPadresExcel`,
            data,
            {
                headers: new HttpHeaders({
                    Accept: 'application/json',
                }),
            }
        )
    }
}
