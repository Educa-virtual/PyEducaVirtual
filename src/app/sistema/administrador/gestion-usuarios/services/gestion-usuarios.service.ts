import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '@/environments/environment'

@Injectable({
    providedIn: 'root',
})
export class GestionUsuariosService {
    private urlBackendApi = environment.backendApi
    private urlBackend = environment.backend
    private http = inject(HttpClient)
    constructor() {}

    obtenerListaUsuarios(params: any) {
        return this.http.get(`${this.urlBackendApi}/seg/usuarios`, {
            params,
        })
    }

    obtenerPerfilesUsuario(iCredId: any) {
        return this.http.get(
            `${this.urlBackendApi}/seg/usuarios/${iCredId}/perfiles`
        )
    }

    cambiarEstadoUsuario(iCredId: number, activo: string) {
        return this.http.patch(
            `${this.urlBackendApi}/seg/usuarios/${iCredId}/estado`,
            { iCredEstado: activo }
        )
    }

    restablecerClaveUsuario(iCredId: number) {
        return this.http.patch(
            `${this.urlBackendApi}/seg/usuarios/${iCredId}/password`,
            null
        )
    }

    eliminarPerfilUsuario(iCredId: number, iCredEntPerfId: number) {
        return this.http.delete(
            `${this.urlBackendApi}/seg/usuarios/${iCredId}/perfiles/${iCredEntPerfId}`
        )
    }

    //Debe moverse a otro servicio
    obtenerInstitucionesEducativas() {
        return this.http.get(
            `${this.urlBackendApi}/acad/instituciones-educativas`
        )
    }

    obtenerModulosAdministrativos() {
        return this.http.get(
            `${this.urlBackendApi}/seg/modulos-administrativos`
        )
    }

    obtenerCursos() {
        return this.http.get(`${this.urlBackendApi}/acad/cursos?nivel=0`)
    }

    obtenerUgeles() {
        return this.http.get(`${this.urlBackendApi}/ere/Ugeles/obtenerUgeles`)
    }

    registrarPerfil(iCredId: number, data: any) {
        return this.http.post(
            `${this.urlBackendApi}/seg/usuarios/${iCredId}/perfiles`,
            data
        )
    }

    obtenerSedesInstitucionEducativa(iIieeId: number) {
        return this.http.get(
            `${this.urlBackendApi}/acad/instituciones-educativas/${iIieeId}/sedes`
        )
    }

    obtenerPerfilesPorTipo(tipo: string) {
        return this.http.get(`${this.urlBackendApi}/seg/perfiles?tipo=${tipo}`)
    }

    registrarUsuario(data: any) {
        return this.http.post(`${this.urlBackendApi}/seg/usuarios`, data)
    }

    buscarPersonaPorDocumento(tipoDocumento, nroDocumento) {
        return this.http.get(
            `${this.urlBackendApi}/seg/personas?iTipoIdentId=${tipoDocumento}&cPersDocumento=${nroDocumento}`
        )
    }

    actualizarFechaVigencia(iCredId: number, dtCredCaduca: Date) {
        return this.http.patch(
            `${this.urlBackendApi}/seg/usuarios/${iCredId}/fecha-vigencia`,
            { dtCredCaduca: dtCredCaduca }
        )
    }
}
