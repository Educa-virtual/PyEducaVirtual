import { Injectable } from '@angular/core'
import { GeneralService } from '@/app/servicios/general.service'
import { HttpClient } from '@angular/common/http'

@Injectable({
    providedIn: 'root',
})
export class CompartirEstudianteService {
    constructor(
        private query: GeneralService,
        private http: HttpClient
    ) {}

    lista: any[] = []

    tipos_documentos: Array<object>
    tipos_familiares: Array<object>
    estados_civiles: Array<object>
    sexos: Array<object>
    nacionalidades: Array<object>
    departamentos: Array<object>
    provincias: Array<object>
    distritos: Array<object>
    lenguas: Array<object>
    tipos_contacto: Array<object>
    religiones: Array<object>

    private activeIndex: string
    private iEstudianteId: string | null = null
    private iPersId: string | null = null
    private iPersRepresentanteLegalId: string | null = null

    clearData() {
        this.activeIndex = '0'
        this.iEstudianteId = null
        this.iPersId = null
        this.iPersRepresentanteLegalId = null
        localStorage.removeItem('activeIndex')
        localStorage.removeItem('iEstudianteId')
        localStorage.removeItem('iPersId')
        localStorage.removeItem('iPersRepresentanteLegalId')
    }

    setActiveIndex(index: string | null) {
        this.activeIndex = index
        localStorage.setItem('activeIndex', index)
    }

    getActiveIndex(): string | null {
        if (!this.activeIndex) {
            this.activeIndex =
                localStorage.getItem('activeIndex') == 'null'
                    ? null
                    : localStorage.getItem('activeIndex')
        }
        return this.activeIndex
    }

    setiEstudianteId(id: string | null) {
        this.iEstudianteId = id
        localStorage.setItem('iEstudianteId', id)
    }

    getiEstudianteId(): string | null {
        if (!this.iEstudianteId) {
            this.iEstudianteId =
                localStorage.getItem('iEstudianteId') == 'null'
                    ? null
                    : localStorage.getItem('iEstudianteId')
        }
        return this.iEstudianteId
    }

    setiPersId(id: string | null) {
        this.iPersId = id
        localStorage.setItem('iPersId', id)
    }

    getiPersId(): string | null {
        if (!this.iPersId) {
            this.iPersId =
                localStorage.getItem('iPersId') == 'null'
                    ? null
                    : localStorage.getItem('iPersId')
        }
        return this.iPersId
    }

    setiPersRepresentanteLegalId(id: string | null) {
        this.iPersRepresentanteLegalId = id
        localStorage.setItem('iPersRepresentanteLegalId', id)
    }

    getiPersRepresentanteLegalId(): string | null {
        if (!this.iPersRepresentanteLegalId) {
            this.iPersRepresentanteLegalId =
                localStorage.getItem('iPersRepresentanteLegalId') == 'null'
                    ? null
                    : localStorage.getItem('iPersRepresentanteLegalId')
        }
        return this.iPersRepresentanteLegalId
    }
}
