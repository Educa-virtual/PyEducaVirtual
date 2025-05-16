import { environment } from '@/environments/environment'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
// import { MessageService } from 'primeng/api'
import { firstValueFrom } from 'rxjs'
import { ErrorHandler } from './error.handler'
// import { DynamicToastService } from '@/app/servicios/dynamicToast.service'

@Injectable({
    providedIn: 'root',
})
export class httpService {
    apiURL = environment.backendApi

    constructor(
        private http: HttpClient,
        // private messageService: MessageService,
        // private dynamicToastService: DynamicToastService,
        private errorHandler: ErrorHandler
    ) {
        // this.dynamicToastService.createToast()
    }

    async getData(
        endpoint: string,
        params?: { [key: string]: any }
    ): Promise<any> {
        try {
            // Si los parámetros se pasan como objeto, los convertimos en una cadena de consulta

            return await firstValueFrom(
                this.http.post(`${this.apiURL}/${endpoint}`, params, {
                    headers: new HttpHeaders({
                        'Content-Type': 'application/json',
                    }),
                })
            )
        } catch (error) {
            this.errorHandler.handleHttpError(error) // Delegar el manejo de errores al ErrorHandler
            return undefined
        }
    }

    getDataObs(endpoint: string, params?: { [key: string]: any }) {
        return this.http.post(`${this.apiURL}/${endpoint}`, params, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        })
    }

    async postData(endpoint: string, data: any) {
        try {
            if (data instanceof FormData) {
                return await firstValueFrom(
                    this.http.post(`${this.apiURL}/${endpoint}`, data)
                )
            } else {
                return await firstValueFrom(
                    this.http.post(`${this.apiURL}/${endpoint}`, data, {
                        headers: new HttpHeaders({
                            'Content-Type': 'application/json',
                        }),
                    })
                )
            }
        } catch (error) {
            this.errorHandler.handleHttpError(error) // Delegar el manejo de errores al ErrorHandler
            return undefined
        }
    }

    postDataObs(endpoint: string, data: any) {
        return this.http.post(`${this.apiURL}/${endpoint}`, data)
    }

    async putData(endpoint: string, data: any) {
        try {
            // Determinamos si los datos son FormData o JSON
            if (data instanceof FormData) {
                // Si los datos son FormData, no se debe establecer el encabezado Content-Type
                // porque el navegador lo maneja automáticamente.
                data.append('_method', 'PUT')
                return await firstValueFrom(
                    this.http.post(`${this.apiURL}/${endpoint}`, data)
                )
            } else {
                // Si no es FormData, lo tratamos como JSON
                return await firstValueFrom(
                    this.http.put(`${this.apiURL}/${endpoint}`, data, {
                        headers: new HttpHeaders({
                            'Content-Type': 'application/json',
                        }),
                    })
                )
            }
        } catch (error) {
            this.errorHandler.handleHttpError(error) // Delegar el manejo de errores al ErrorHandler
            return undefined
        }
    }

    async deleteData(endpoint: string, data: any) {
        try {
            return await firstValueFrom(
                this.http.post(`${this.apiURL}/${endpoint}`, {
                    headers: new HttpHeaders({
                        'Content-Type': 'application/json',
                    }),
                    body: data,
                })
            )
        } catch (error) {
            this.errorHandler.handleHttpError(error) // Delegar el manejo de errores al ErrorHandler
            return undefined
        }
    }
}
