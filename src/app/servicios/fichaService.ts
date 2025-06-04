// ficha.service.ts
import { environment } from '@/environments/environment'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'

const baseUrl = environment.backendApi

@Injectable({
    providedIn: 'root',
})
export class FichaService {
    constructor(private http: HttpClient) {}
    downloadFicha(id: number, anio: number) {
        return this.http.get(`${baseUrl}/bienestar/ficha-pdf/${id}/${anio}`, {
            responseType: 'blob',
        })
    }
}
