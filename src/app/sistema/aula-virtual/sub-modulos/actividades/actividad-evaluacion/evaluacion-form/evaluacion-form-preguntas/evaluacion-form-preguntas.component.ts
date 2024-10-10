import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import { MenuItem } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { MenuModule } from 'primeng/menu'

@Component({
    selector: 'app-evaluacion-form-preguntas',
    standalone: true,
    imports: [CommonModule, ButtonModule, MenuModule],
    templateUrl: './evaluacion-form-preguntas.component.html',
    styleUrl: './evaluacion-form-preguntas.component.scss',
})
export class EvaluacionFormPreguntasComponent {
    @Input() tituloEvaluacion: string = 'Sin título de evaluación'

    @Input() preguntas: any[] = []

    tiposAgrecacionPregunta: MenuItem[] = [
        {
            label: 'Nueva Pregunta',
            icon: 'pi pi-plus',
            command: () => {},
        },
        {
            label: 'Del banco de preguntas',
            icon: 'pi pi-plus',
        },
    ]
}
