import { Component, OnInit } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { ProgressBarModule } from 'primeng/progressbar'
import { RadioButtonModule } from 'primeng/radiobutton'

@Component({
    selector: 'app-mostrar-evaluacion',
    standalone: true,
    templateUrl: './mostrar-evaluacion.component.html',
    styleUrls: ['./mostrar-evaluacion.component.scss'],
    imports: [PrimengModule, ProgressBarModule, RadioButtonModule],
})
export class MostrarEvaluacionComponent implements OnInit {
    pregunta = [
        {
            title: 'Pregunta N°1: Si tienes 48 caramelos y regalas 23, ¿Cuántos te quedan?',
            tipo: 'unica',
            opciones: ['Opción A', 'Opción B', 'Opción C'],
        },
        {
            title: 'Pregunta N°2: Si en cada caja hay 5 lápices y tienes 4 cajas, ¿cuántos lápices tienes en total?  ',
            tipo: 'múltiple',
            enunciado:
                'Selecciona las respuestas correctas según el siguiente enunciado:',
            opciones: ['Opción 1', 'Opción 2', 'Opción 3', 'Opción 4'],
        },
        { title: 'Title 3', content: 'Content 3' },
    ]

    subPreguntas = [
        { title: 'pregunta 1' },
        { title: 'pregunta 2' },
        { title: 'pregunta 3' },
    ]
    subAlternativas: string[] = ['23', 'ya 24', '30?', 'N/A']
    alternativas: string[] = ['no se tu dime', 'ya 24', '30?', 'N/A']

    seleccion: string | null = null

    constructor() {}

    ngOnInit() {
        console.log('mostrar nada')
    }
    // meto de al seleccionar una opción
    seleccionarOpcion(opcion: string) {
        this.seleccion = opcion
    }
    // como convertir el (id) en letras y poder listar
    getLetra(index: number): string {
        return String.fromCharCode(65 + index)
        // Convierte 0 → A, 1 → B, 2 → C, etc.
    }
}
