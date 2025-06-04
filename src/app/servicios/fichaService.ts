// ficha.service.ts
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'

@Injectable({
    providedIn: 'root',
})
export class FichaService {
    constructor(private http: HttpClient) {}
    downloadFicha(id: number, anio: number) {
        const url = `http://localhost:8000/ficha-pdf/${id}/${anio}`
        // const url = `/api/ficha-pdf/${id}/${anio}`;

        return this.http.get(url, { responseType: 'blob' })
    }
}
