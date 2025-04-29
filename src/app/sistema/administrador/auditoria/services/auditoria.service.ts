import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
@Injectable({ providedIn: 'root' })
export class AuditoriaService {
    endpoint: ''
    constructor(private http: HttpClient) {}

    getData(params: any) {
        return this.http.post(`http://localhost:8000/api/${this.endpoint}`, {
            ...params,
        })
    }
}
