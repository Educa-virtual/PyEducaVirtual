import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from '@/environments/environment.template'

const baseUrl = environment.backendApi

@Injectable({
    providedIn: 'root',
})
export class DatosSugerenciaService {
    constructor(private http: HttpClient) {}

    lista: any[] = []

    subirArchivoSugerencias(data: any) {
        return this.http.post(
            `${baseUrl}/acad/estudiante/guardarSugerencia`,
            data,
            {
                headers: new HttpHeaders({
                    Accept: 'application/json',
                }),
            }
        )
    }
}
