import { Component, Input, OnChanges } from '@angular/core'
import { ToolbarPrimengComponent } from '../../../../../../shared/toolbar-primeng/toolbar-primeng.component'
import { IconComponent } from '@/app/shared/icon/icon.component'
import { CommonModule } from '@angular/common'
import { TimeComponent } from '@/app/shared/time/time.component'
import { PrimengModule } from '@/app/primeng.module'

@Component({
    selector: 'app-evaluacion-estudiantes',
    standalone: true,
    imports: [
        ToolbarPrimengComponent,
        IconComponent,
        CommonModule,
        TimeComponent,
        PrimengModule,
    ],
    templateUrl: './evaluacion-estudiantes.component.html',
    styleUrl: './evaluacion-estudiantes.component.scss',
})
export class EvaluacionEstudiantesComponent implements OnChanges {
    @Input() evaluacion

    iPreguntaId: number = 0
    preguntas = []
    itemPreguntas = []
    esUltimaPregunta: boolean = false
    display: boolean

    ngOnChanges(changes) {
        if (changes.evaluacion?.currentValue) {
            this.evaluacion = changes.evaluacion.currentValue
            const totalPreguntas = this.evaluacion
                ? this.evaluacion.preguntas.length
                : 0
            if (this.evaluacion && totalPreguntas > 0) {
                this.evaluacion.preguntas.forEach((item, index) => {
                    this.preguntas.push({
                        id: index + 1,
                        preguntas: item,
                    })
                })
            }
        }
    }

    iniciarEvaluacion() {
        this.iPreguntaId++
        this.itemPreguntas = this.preguntas.find(
            (item) => item.id === this.iPreguntaId
        )
        this.itemPreguntas = this.itemPreguntas?.['preguntas'] || []
        this.esUltimaPregunta = this.iPreguntaId === this.preguntas.length
    }

    regresarPregunta(): void {
        if (this.iPreguntaId > 1) {
            this.iPreguntaId--
            const preguntaActual = this.preguntas.find(
                (item) => item.id === this.iPreguntaId
            )
            this.itemPreguntas = preguntaActual?.['preguntas'] || []
            this.esUltimaPregunta = false // Desactiva el estado de "última pregunta".
        } else {
            alert('Ya estás en la primera pregunta.')
        }
    }

    finalizarEvaluacion() {
        // Aquí va la lógica para finalizar la evaluación
        console.log(
            'Evaluación finalizada con ID de pregunta: ',
            this.iPreguntaId
        )
        alert('Evaluación finalizada. ¡Gracias por participar!')
        // Cerrar el modal
        this.display = false
    }
}
