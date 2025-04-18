import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { BehaviorSubject } from 'rxjs'
import { environment } from '@/environments/environment'

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
}
const baseUrl = environment.backendApi

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    public isAuthenticated = new BehaviorSubject<boolean>(false)

    constructor(private http: HttpClient) {}

    refreshToken(token: string) {
        return this.http.post(
            baseUrl + 'refreshtoken',
            {
                refreshToken: token,
            },
            httpOptions
        )
    }

    login(data) {
        return this.http.post(`${baseUrl}/login`, data)
    }
    sendEmail(data) {
        return this.http.post(`${baseUrl}/verificar`, data)
    }
    sendVerify(data) {
        return this.http.post(`${baseUrl}/verificar_codigo`, data)
    }
    obtenerUsuario(data) {
        return this.http.post(`${baseUrl}/obtenerUsuario`, data)
    }
    verificarUsuario(data) {
        return this.http.post(`${baseUrl}/verificarUsuario`, data)
    }
    actualizarUsuario(data) {
        return this.http.post(`${baseUrl}/actualizarUsuario`, data)
    }
}
