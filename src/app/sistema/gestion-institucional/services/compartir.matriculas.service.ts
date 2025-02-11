import { Injectable } from '@angular/core'
import { GeneralService } from '@/app/servicios/general.service'

//import { BehaviorSubject } from 'rxjs'

@Injectable({
    providedIn: 'root',
})
export class CompartirMatriculasService {
    lista: any[] = []

    private gradoSeccionNombre: string | null = null
    private iSedeId: number | null = null
    private iNivelGradoId: number | null = null
    private iSeccionId: number | null = null
    private iTurnoId: number | null = null

    setcGradoSeccionNombre(nombre: string) {
        this.gradoSeccionNombre = nombre
        localStorage.setItem('gradoSeccionNombre', nombre)
    }

    getGradoSeccionNombre(): string | null {
        if (!this.gradoSeccionNombre) {
            this.gradoSeccionNombre = localStorage.getItem('gradoSeccionNombre')
        }
        return this.gradoSeccionNombre
    }

    constructor(private query: GeneralService) {}

    setEvaluacionId(data: any): void {
        this.iSedeId = data?.iSedeId
        this.iNivelGradoId = data?.iNivelGradoId
        this.iSeccionId = data?.iSeccionId
        this.iTurnoId = data?.iTurnoId
    }
}
