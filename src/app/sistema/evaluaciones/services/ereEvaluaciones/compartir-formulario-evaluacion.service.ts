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
    setcEvaluacionNombre(nombre: string) {
        //!Se agrego localStorage para el momento de reinicar la pagina no se pierdan esos datos
        // console.log('Valor recibido en setcEvaluacionNombre:', nombre) // Verifica lo que se recibe
        // this.cEvaluacionNombre = nombre
        // console.log('Nombre guardado en el servicio:', this.cEvaluacionNombre) // Verifica que se guarda correctamente

        this.cEvaluacionNombre = nombre
        // Guardar en el localStorage
        localStorage.setItem('cEvaluacionNombre', nombre)
    }

    getcEvaluacionNombre(): string | null {
        // console.log(
        //     'Nombre obtenido desde el servicio:',
        //     this.cEvaluacionNombre
        // ) // Verifica que se recupera correctamente
        // return this.cEvaluacionNombre

        // Intentar recuperar del localStorage si está vacío
        if (!this.cEvaluacionNombre) {
            this.cEvaluacionNombre = localStorage.getItem('cEvaluacionNombre')
        }
        return this.cEvaluacionNombre
    }

    //!Se agrego datos para pasar de area a banco preguntas
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
    constructor() {}
}
