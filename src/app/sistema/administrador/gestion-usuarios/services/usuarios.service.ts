import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '@/environments/environment'

@Injectable({
    providedIn: 'root',
})
export class UsuariosService {
    private urlBackendApi = environment.backendApi
    private urlBackend = environment.backend
    private http = inject(HttpClient)
    constructor() {}

    obtenerListaUsuarios(params: any) {
        return this.http.get(`${this.urlBackendApi}/seg/usuarios/perfiles`, {
            params,
        })
    }

    obtenerPerfilesUsuario(iCredId: any) {
        return this.http.get(
            `${this.urlBackendApi}/seg/usuarios/${iCredId}/perfiles`
        )
    }

    cambiarEstadoUsuario(id: number, activo: number) {
        return this.http.patch(
            `${this.urlBackendApi}/seg/usuarios/${id}/estado`,
            { iCredEstado: activo }
        )
    }
}
