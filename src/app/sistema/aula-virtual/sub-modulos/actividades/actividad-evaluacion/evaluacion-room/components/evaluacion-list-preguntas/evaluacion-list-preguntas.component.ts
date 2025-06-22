import { PrimengModule } from '@/app/primeng.module'
import { NgFor } from '@angular/common'
import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
} from '@angular/core'

@Component({
    selector: 'app-evaluacion-list-preguntas',
    standalone: true,
    imports: [PrimengModule, NgFor],
    templateUrl: './evaluacion-list-preguntas.component.html',
    styleUrl: './evaluacion-list-preguntas.component.scss',
})
export class EvaluacionListPreguntasComponent implements OnChanges {
    @Input() preguntas = []

    @Output() accionBtn = new EventEmitter()

    ngOnChanges(changes) {
        if (changes.preguntas.currentValue) {
            this.preguntas = changes.preguntas.currentValue
            this.preguntas.forEach((pregunta) => {
                // Primero: parsear jsonPreguntas si viene como string
                if (typeof pregunta.jsonPreguntas === 'string') {
                    try {
                        pregunta.jsonPreguntas = JSON.parse(
                            pregunta.jsonPreguntas
                        )
                    } catch (e) {
                        console.error(
                            'Error al parsear jsonPreguntas:',
                            e,
                            pregunta.jsonPreguntas
                        )
                        pregunta.jsonPreguntas = {}
                    }
                }

                // Segundo: parsear jsonAlternativas dentro de jsonPreguntas si viene como string
                if (
                    pregunta.jsonPreguntas &&
                    typeof pregunta.jsonPreguntas.jsonAlternativas === 'string'
                ) {
                    try {
                        pregunta.jsonPreguntas.jsonAlternativas = JSON.parse(
                            pregunta.jsonPreguntas.jsonAlternativas
                        )
                    } catch (e) {
                        console.error(
                            'Error al parsear jsonAlternativas (dentro de jsonPreguntas):',
                            e,
                            pregunta.jsonPreguntas.jsonAlternativas
                        )
                        pregunta.jsonPreguntas.jsonAlternativas = []
                    }
                }
                // Tercero (opcional): parsear también el jsonAlternativas raíz, si existe como string
                if (typeof pregunta.jsonAlternativas === 'string') {
                    try {
                        pregunta.jsonAlternativas = JSON.parse(
                            pregunta.jsonAlternativas
                        )
                    } catch (e) {
                        console.error(
                            'Error al parsear jsonAlternativas (raíz):',
                            e,
                            pregunta.jsonAlternativas
                        )
                        pregunta.jsonAlternativas = []
                    }
                }
            })
            console.log(this.preguntas)
        }
    }

    mostrarListaAlternativas(item: any): boolean {
        return (
            Array.isArray(item.jsonAlternativas) &&
            item.jsonAlternativas.length > 0
        )
    }
}
