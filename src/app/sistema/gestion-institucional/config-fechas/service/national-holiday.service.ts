import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { MessageService } from 'primeng/api'
import { Observable } from 'rxjs'
import { environment } from '@/environments/environment'

const baseUrl = environment.backendApi

@Injectable({
    providedIn: 'root',
})
export class nationalHolidayService {
    importEndPoint = `${baseUrl}`
    endPoint = `${baseUrl}/grl/feriados-nacionales`
    constructor(
        public http: HttpClient,
        private messageService: MessageService
    ) {}

    importDataCollection(data: any): Observable<any> {
        return this.http.post(`${baseUrl}/${this.importEndPoint}`, {
            SpecialsDates: data,
        })
    }

    downloadTemplate() {
        this.http
            .get(`${baseUrl}/file/import`, {
                params: {
                    template: 'plantilla-feriados-nacionales',
                },
                responseType: 'blob',
            })
            .subscribe((blob: Blob) => {
                const url = window.URL.createObjectURL(blob)

                const a = document.createElement('a')
                a.href = url
                a.download = 'feriados-nacionales-template.xlsx'
                a.target = '_self'
                a.click()

                window.URL.revokeObjectURL(url)
            })
    }

    getFeriadosNacionales() {
        const iYearId = JSON.parse(localStorage.getItem('dremoYear'))

        return this.http.get(
            `${this.endPoint}/getFeriadosNacionales/${iYearId}`
        )
    }

    insFeriadosNacionales(data) {
        return this.http.post(`${this.endPoint}/insFeriadosNacionales`, data)
    }

    insFeriadosNacionalesMasivo(data) {
        return this.http.post(
            `${this.endPoint}/insFeriadosNacionalesMasivo`,
            data
        )
    }

    updFeriadosNacionales(data) {
        return this.http.put(`${this.endPoint}/updFeriadosNacionales`, data)
    }

    deleteFeriadosNacionalesXiFeriadoId(data) {
        return this.http.delete(
            `${this.endPoint}/deleteFeriadosNacionales/${data.iFeriadoId}`
        )
    }
    syncFeriadosNacionales() {
        const iYearId = JSON.parse(localStorage.getItem('dremoYear'))

        return this.http.put(`${this.endPoint}/syncFeriadosNacionales`, {
            iYearId: iYearId,
        })
    }
}
