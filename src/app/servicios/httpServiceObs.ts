import { environment } from '@/environments/environment'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'

@Injectable({
    providedIn: 'root',
})
export class httpServiceObs {
    apiURL = environment.backendApi

    constructor(private http: HttpClient) {}

    getData(endpoint: string, params?: { [key: string]: any }) {
        return this.http
            .get(`${this.apiURL}/${endpoint}`, {
                params: params,
            })
            .pipe
            // Aquí podrías agregar más operadores RxJS si es necesario
            ()
    }

    postData(endpoint: string, data: any) {
        if (data instanceof FormData) {
            return this.http.post(`${this.apiURL}/${endpoint}`, data)
        } else {
            return this.http.post(`${this.apiURL}/${endpoint}`, data, {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                }),
            })
        }
    }

    putData(endpoint: string, data: any) {
        if (data instanceof FormData) {
            // data.append('_method', 'PUT')
            return this.http.put(`${this.apiURL}/${endpoint}`, data)
        } else {
            return this.http.put(`${this.apiURL}/${endpoint}`, data, {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                }),
            })
        }
    }

    deleteData(endpoint: string, data: any) {
        return this.http.delete(`${this.apiURL}/${endpoint}`, data)
    }
}
