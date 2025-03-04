import { environment } from '@/environments/environment'
import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { map, Observable } from 'rxjs'

@Injectable({
    providedIn: 'root',
})
export class ApiEspecialistasUgelService {
    private urlBackendApi = environment.backendApi
    private urlBackend = environment.backend
    private http = inject(HttpClient)
    constructor() {}

    // Metodos Especialista Ugel

    obtenerEspecialistasUgel(): Observable<any> {
        // listo
        const url = `${this.urlBackendApi}/acad/especialistas-ugel`

        return this.http.get(url).pipe(map((resp: any) => resp['data']))
    }

    obtenerUgeles(): Observable<any> {
        //listo
        const url = `${this.urlBackendApi}/acad/ugeles`
        return this.http.get(url).pipe(map((resp: any) => resp['data']))
    }

    // obtenerAreasPorEspecialista terminado a las 4:40PM
    obtenerAreasPorEspecialistaUgel(
        //service listo, falta agregar en el ts y html
        iUgelId: string,
        iDocenteId: string
    ): Observable<any> {
        const url = `${this.urlBackendApi}/acad/ugeles/${iUgelId}/especialistas/${iDocenteId}/areas`
        return this.http.get(url).pipe(map((resp: any) => resp['data']))
    }

    obtenerCursosxNivelUgel(nivel: number): Observable<any> {
        let url = `${this.urlBackendApi}/acad/cursos?`
        if (nivel) url += `nivel=${nivel}`
        return this.http.get(url).pipe(map((resp: any) => resp['data']))
    }

    asignarAreaEspecialistaUgel(
        iUgelId: string,
        iDocenteId: string,
        data
    ): Observable<any> {
        const url = `${this.urlBackendApi}/acad/ugeles/${iUgelId}/especialistas/${iDocenteId}/areas`
        return this.http.post(url, data).pipe(map((resp: any) => resp))
    }

    eliminarAreaEspecialistaUgel(
        iUgelId: string,
        iDocenteId: string,
        data
    ): Observable<any> {
        const url = `${this.urlBackendApi}/acad/ugeles/${iUgelId}/especialistas/${iDocenteId}/areas`

        return this.http.delete<void>(url, { body: data })
    }

    obtenerCursosxNivel(nivel: number): Observable<any> {
        let url = `${this.urlBackendApi}/acad/cursos?`
        if (nivel) url += `nivel=${nivel}`
        return this.http.get(url).pipe(map((resp: any) => resp['data']))
    }
}
