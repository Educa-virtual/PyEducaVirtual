import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

@Injectable({
    providedIn: 'root',
})
export class CompartirSugerenciaService {
    constructor(private http: HttpClient) {}

    lista: any[] = []
    private iSugerenciaId: string | null = null

    clearData() {
        this.iSugerenciaId = null
        localStorage.removeItem('iSugerenciaId')
    }

    setiSugerenciaId(index: string | null) {
        this.iSugerenciaId = index
        localStorage.setItem('iSugerenciaId', index)
    }

    getiSugerenciaId(): string | null {
        if (!this.iSugerenciaId) {
            this.iSugerenciaId =
                localStorage.getItem('iSugerenciaId') == 'null'
                    ? null
                    : localStorage.getItem('iSugerenciaId')
        }
        return this.iSugerenciaId
    }
}
