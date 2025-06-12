import { Injectable, OnDestroy } from '@angular/core'
import { of, Subject } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { environment } from '@/environments/environment'

const baseUrl = environment.backendApi

@Injectable({
    providedIn: 'root',
})
export class DatosRecordatorioService implements OnDestroy {
    periodos: Array<object>
    private onDestroy$ = new Subject<boolean>()

    constructor(private http: HttpClient) {}

    verFechasEspeciales(data: any) {
        return this.http.post(`${baseUrl}/bienestar/verFechasEspeciales`, data)
    }

    verConfRecordatorio(data: any) {
        return this.http.post(`${baseUrl}/bienestar/verConfRecordatorio`, data)
    }

    actualizarConfReordatorio(data: any) {
        return this.http.post(
            `${baseUrl}/bienestar/actualizarConfRecordatorio`,
            data
        )
    }

    getPeriodos() {
        this.periodos = [
            { value: 1, label: 'EL MISMO DÍA' },
            { value: 2, label: 'UN DIA ANTES' },
            { value: 3, label: 'UNA SEMANA ANTES' },
            { value: 4, label: 'UN MES ANTES' },
        ]
        return of(this.periodos)
    }

    ngOnDestroy() {
        this.onDestroy$.next(true)
        this.onDestroy$.complete()
    }
}
