import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from '@/environments/environment'
import { Observable } from 'rxjs'

@Injectable({
    providedIn: 'root',
})
export class httpService {
    apiURL = environment.backendApi

    constructor(private http: HttpClient) {}

    getData(endpoint: string): Observable<any> {
        return this.http.get(`${this.apiURL}/${endpoint}`)
    }

    postData(endpoint: string, data: any): Observable<any> {
        return this.http.post(`${this.apiURL}/${endpoint}`, data, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        })
    }

    putData(endpoint: string, data: any): Observable<any> {
        // Determinamos si los datos son FormData o JSON
        if (data instanceof FormData) {
            // Si los datos son FormData, no se debe establecer el encabezado Content-Type
            // porque el navegador lo maneja automáticamente.
            return this.http.put(`${this.apiURL}/${endpoint}`, data)
        } else {
            // Si no es FormData, lo tratamos como JSON
            return this.http.put(`${this.apiURL}/${endpoint}`, data, {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                }),
            })
        }
    }

    deleteData(endpoint: string, data: any): Observable<any> {
        return this.http.delete(`${this.apiURL}/${endpoint}`, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            body: data, // En el caso de que necesites enviar datos en el cuerpo de la solicitud DELETE
        })
    }
}
