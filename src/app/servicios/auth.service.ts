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
        return this.http.post(`${baseUrl}/login?user=123456&pass=123456`, data)
    }
}
