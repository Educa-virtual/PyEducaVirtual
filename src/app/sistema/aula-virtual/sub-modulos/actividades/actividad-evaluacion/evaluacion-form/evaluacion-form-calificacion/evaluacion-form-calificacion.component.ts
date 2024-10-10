import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import { DropdownModule } from 'primeng/dropdown'

@Component({
    selector: 'app-evaluacion-form-calificacion',
    standalone: true,
    imports: [CommonModule, DropdownModule],
    templateUrl: './evaluacion-form-calificacion.component.html',
    styleUrl: './evaluacion-form-calificacion.component.scss',
})
export class EvaluacionFormCalificacionComponent {
    @Input() tituloEvaluacion: string = 'Sin título de evaluación'

    public instrumentoEvaluacionOpciones = [
        {
            id: 1,
            nombre: 'Sin instrumento de evaluación',
        },
        {
            id: 2,
            nombre: 'Con instrumento de evaluación',
        },
    ]
}
