import { Injectable, OnDestroy } from '@angular/core'
import { GeneralService } from '@/app/servicios/general.service'
import { Subject } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { environment } from '@/environments/environment'

const baseUrl = environment.backendApi

@Injectable({
    providedIn: 'root',
})
export class DatosRecordatorioService implements OnDestroy {
    private onDestroy$ = new Subject<boolean>()

    constructor(
        private query: GeneralService,
        private http: HttpClient
    ) {}

    /**
     * Función para obtener las fechas especiales para el usuario segun su perfil
     * @param data { iCredEntPerfId}
     */
    async verFechasEspeciales(data: any): Promise<any> {
        return this.http.post(`${baseUrl}/bienestar/verFechasEspeciales`, data)
    }

    /**
     * Función para obtener la configuración del
     * recordatorio de fechas del usuario segun su perfil
     * @param data { iCredEntPerfId}
     */
    async verConfRecordatorio(data: any): Promise<any> {
        return this.http.post(`${baseUrl}/bienestar/verConfRecordatorio`, data)
    }

    /**
     * Función para actualizar la configuración del
     * recordatorio de fechas del usuario segun su perfil
     * @param data { iCredEntPerfId, bRecordatorio, iTipoRecordatorio}
     *
     */
    async actualizarConfReordatorio(data: any): Promise<any> {
        return this.http.post(
            `${baseUrl}/bienestar/actualizarConfReordatorio`,
            data
        )
    }

    /**
     * Función para destruir observables y subscripciones del servicio
     */
    ngOnDestroy() {
        this.onDestroy$.next(true)
        this.onDestroy$.complete()
    }
}
