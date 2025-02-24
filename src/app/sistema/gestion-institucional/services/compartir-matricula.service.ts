import { Injectable } from '@angular/core'
import { GeneralService } from '@/app/servicios/general.service'
import { HttpClient } from '@angular/common/http'

@Injectable({
    providedIn: 'root',
})
export class CompartirMatriculaService {
    constructor(
        private query: GeneralService,
        private http: HttpClient
    ) {}

    lista: any[] = []

    private iMatrId: string | null = null

    clearData() {
        this.iMatrId = null
        localStorage.removeItem('iMatrId')
    }

    setiMatrId(index: string | null) {
        this.iMatrId = index
        localStorage.setItem('iMatrId', index)
    }

    getiMatrId(): string | null {
        if (!this.iMatrId) {
            this.iMatrId =
                localStorage.getItem('iMatrId') == 'null'
                    ? null
                    : localStorage.getItem('iMatrId')
        }
        return this.iMatrId
    }
}
