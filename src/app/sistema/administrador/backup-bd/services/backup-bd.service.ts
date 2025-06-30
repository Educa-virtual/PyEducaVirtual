import { inject, Injectable } from '@angular/core'
import { environment } from '@/environments/environment'
import { HttpClient } from '@angular/common/http'

@Injectable({
    providedIn: 'root',
})
export class BackupBdService {
    private urlBackendApi = environment.backendApi

    private http = inject(HttpClient)
    constructor() {}

    realizarCopiaSeguridad() {
        return this.http.post(`${this.urlBackendApi}/seg/database/backups`, {})
    }

    obtenerHistorialBackups() {
        return this.http.get(`${this.urlBackendApi}/seguridad/database/backups`)
    }
}
