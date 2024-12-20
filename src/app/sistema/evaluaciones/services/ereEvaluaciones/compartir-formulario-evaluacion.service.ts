import { Injectable } from '@angular/core'

//import { BehaviorSubject } from 'rxjs'

@Injectable({
    providedIn: 'root',
})
export class CompartirFormularioEvaluacionService {
    private cEvaluacionNombre: string | null = null // Nombre de la evaluacion
    private grado: string | null = null
    private nivel: string | null = null
    private seccion: string | null = null
    private areas: any[] = [] // Lista de áreas procesadas

    private areasIdNivelGradoString: string | null = null
    setcEvaluacionNombre(nombre: string) {
        this.cEvaluacionNombre = nombre
        // Guardar en el localStorage
        localStorage.setItem('cEvaluacionNombre', nombre)
    }

    getcEvaluacionNombre(): string | null {
        // Intentar recuperar del localStorage si está vacío
        if (!this.cEvaluacionNombre) {
            this.cEvaluacionNombre = localStorage.getItem('cEvaluacionNombre')
        }
        return this.cEvaluacionNombre
    }

    setGrado(grado: string) {
        this.grado = grado
        localStorage.setItem('grado', grado)
    }

    getGrado(): string | null {
        if (!this.grado) {
            this.grado = localStorage.getItem('grado')
        }
        return this.grado
    }

    setNivel(nivel: string) {
        this.nivel = nivel
        localStorage.setItem('nivel', nivel)
    }

    getNivel(): string | null {
        if (!this.nivel) {
            this.nivel = localStorage.getItem('nivel')
        }
        return this.nivel
    }
    setSeccion(seccion: string) {
        this.seccion = seccion
        localStorage.setItem('seccion', seccion)
    }

    getSeccion(): string | null {
        if (!this.seccion) {
            this.seccion = localStorage.getItem('seccion')
        }
        return this.seccion
    }

    // MÉTODO PARA GUARDAR ÁREAS
    setAreas(areas: any[]): void {
        this.areas = areas
        // Guardar en localStorage como string JSON
        localStorage.setItem('areas', JSON.stringify(areas))
    }

    // MÉTODO PARA OBTENER ÁREAS
    getAreas(): any[] {
        // Si las áreas no están en memoria, intentar recuperarlas del localStorage
        if (!this.areas || this.areas.length === 0) {
            const storedAreas = localStorage.getItem('areas')
            this.areas = storedAreas ? JSON.parse(storedAreas) : []
        }
        return this.areas
    }

    //Id Nivel Grado
    setAreasId(areasIdNivelGradoString: string) {
        this.areasIdNivelGradoString = areasIdNivelGradoString
        localStorage.setItem('areasIdNivelGradoString', areasIdNivelGradoString)
    }

    getAreasId(): string | null {
        if (!this.areasIdNivelGradoString) {
            this.areasIdNivelGradoString = localStorage.getItem(
                'areasIdNivelGradoString'
            )
        }
        return this.areasIdNivelGradoString
    }

    constructor() {}
}
