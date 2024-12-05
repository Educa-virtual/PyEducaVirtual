import { Injectable } from '@angular/core'
//import { BehaviorSubject } from 'rxjs'

@Injectable({
    providedIn: 'root',
})
export class CompartirFormularioEvaluacionService {
    private cEvaluacionNombre: string | null = null // Nombre de la evaluacion

    setcEvaluacionNombre(nombre: string) {
        console.log('Valor recibido en setcEvaluacionNombre:', nombre) // Verifica lo que se recibe
        this.cEvaluacionNombre = nombre
        console.log('Nombre guardado en el servicio:', this.cEvaluacionNombre) // Verifica que se guarda correctamente
    }

    getcEvaluacionNombre(): string {
        console.log(
            'Nombre obtenido desde el servicio:',
            this.cEvaluacionNombre
        ) // Verifica que se recupera correctamente
        return this.cEvaluacionNombre
    }

    constructor() {}

    // private cEvaluacionNombreSubject = new BehaviorSubject<string>(
    //     'Nueva Evaluación'
    // )
    // public cEvaluacionNombre$ = this.cEvaluacionNombreSubject.asObservable()

    // constructor() {}

    // // Método para obtener el nombre de la evaluación
    // getcEvaluacionNombre(): string {
    //     return this.cEvaluacionNombreSubject.getValue()
    //     console.log(
    //         'Nombre obtenido desde el servicio:',
    //         this.cEvaluacionNombreSubject
    //     )
    // }

    // // Método para actualizar el nombre de la evaluación
    // setcEvaluacionNombre(nombre: string): void {
    //     this.cEvaluacionNombreSubject.next(nombre)
    //     console.log('Nombre guardado en el servicio:', nombre)
    // }
}
