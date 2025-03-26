import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '@/environments/environment'
import { LocalStoreService } from '@/app/servicios/local-store.service'

const baseUrl = environment.backendApi

@Injectable({
    providedIn: 'root',
})
export class DatosInformesService {
    constructor(
        private http: HttpClient,
        private store: LocalStoreService
    ) {}

    perfil = this.store.getItem('dremoPerfil')

    lista: any[] = []
    sexos: Array<object>

    getSexos() {
        if (!this.sexos) {
            this.sexos = [
                { label: 'MASCULINO', value: 'M' },
                { label: 'FEMENINO', value: 'F' },
            ]
        }
        return this.sexos
    }

    obtenerEvaluacionesCursosIes(data: any) {
        return this.http.post(
            `${baseUrl}/ere/reportes/obtenerEvaluacionesCursosIes`,
            data
        )
    }

    obtenerInformeResumen(data: any) {
        return this.http.post(
            `${baseUrl}/ere/reportes/obtenerInformeResumen`,
            data
        )
    }

    exportarPdf(data: any) {
        return this.http.post(`${baseUrl}/ere/reportes/generarPdf`, data, {
            responseType: 'blob',
        })
    }

    exportarExcel(data: any) {
        return this.http.post(`${baseUrl}/ere/reportes/generarExcel`, data, {
            responseType: 'blob',
        })
    }
}
