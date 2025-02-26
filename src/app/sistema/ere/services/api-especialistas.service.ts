import { inject, Injectable } from '@angular/core'
import { environment } from '@/environments/environment.template'
import { HttpClient } from '@angular/common/http'
import { map, Observable } from 'rxjs' //catchError, , tap, throwError
// import { AdministradorModule } from '../../administrador/administrador.module'
//import { mapData } from '../sub-evaluaciones/banco-preguntas/models/pregunta-data-transformer'

@Injectable({
    providedIn: 'root',
})
export class ApiEspecialistasService {
    private urlBackendApi = environment.backendApi
    private urlBackend = environment.backend
    private http = inject(HttpClient)
    constructor() {}

    obtenerAreasPorEvaluacionyEspecialista(
        iEvaluacionId,
        iEspecialistaId
    ): Observable<any> {
        return this.http
            .get(
                `${this.urlBackendApi}/ere/evaluaciones/${iEvaluacionId}/especialistas/${iEspecialistaId}/areas`
            )
            .pipe(map((resp) => resp['data']))
    }

    listarEspecialista(
        iPersId: number,
        iDocenteId: number,
        cPersDocumento: string,
        cPersNombre: string,
        cPersPaterno: string,
        cPersMaterno: string,
        iPerfilId: number,
        cPerfilNombre: string,
        iCredId: number
    ): Observable<any> {
        let url = `${this.urlBackendApi}/acad/especialistas-dremo?` // Usa la URL base proporcionada
        if (iPersId) url += `iPersId=${iPersId}&`
        if (iDocenteId) url += `iDocenteId=${iDocenteId}&`
        if (cPersDocumento) url += `cPersDocumento=${cPersDocumento}&`
        if (cPersNombre) url += `cPersNombre=${cPersNombre}&`
        if (cPersPaterno) url += `cPersPaterno=${cPersPaterno}&`
        if (cPersMaterno) url += `cPersMaterno=${cPersMaterno}&`
        if (iPerfilId) url += `iPerfilId=${iPerfilId}&`
        if (cPerfilNombre) url += `cPerfilNombre=${cPerfilNombre}&`
        if (iCredId) url += `iCredId=${iCredId}&`

        // Elimina el último '&' si hay parámetros
        if (url.endsWith('&')) {
            url = url.slice(0, -1)
        }

        return this.http.get(url).pipe(map((resp: any) => resp['data']))
    }

    obtenerEspecialistasDremo(): Observable<any> {
        return this.http
            .get(`${this.urlBackendApi}/acad/especialistas-dremo`)
            .pipe(map((resp) => resp['data']))
    }

    obtenerCursosxNivel(nivel: number): Observable<any> {
        let url = `${this.urlBackendApi}/acad/cursos?`
        if (nivel) url += `nivel=${nivel}`
        return this.http.get(url).pipe(map((resp: any) => resp['data']))
    }

    obtenerAreasPorEspecialista(iDocenteId: string): Observable<any> {
        const url = `${this.urlBackendApi}/acad/especialistas-dremo/${iDocenteId}/areas`
        return this.http.get(url).pipe(map((resp: any) => resp['data']))
    }

    asignarAreaEspecialista(iDocenteId: string, data): Observable<any> {
        const url = `${this.urlBackendApi}/acad/especialistas-dremo/${iDocenteId}/areas`
        return this.http.post(url, data).pipe(map((resp: any) => resp))
    }

    eliminarAreaEspecialista(iDocenteId: string, data: any): Observable<any> {
        const url = `${this.urlBackendApi}/acad/especialistas-dremo/${iDocenteId}/areas`

        return this.http.delete<void>(url, { body: data })
    }
}
