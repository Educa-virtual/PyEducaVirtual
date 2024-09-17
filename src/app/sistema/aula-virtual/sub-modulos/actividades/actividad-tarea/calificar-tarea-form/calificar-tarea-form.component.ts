import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { ButtonModule } from 'primeng/button'

@Component({
    selector: 'app-calificar-tarea-form',
    standalone: true,
    imports: [CommonModule, ButtonModule],
    templateUrl: './calificar-tarea-form.component.html',
    styleUrl: './calificar-tarea-form.component.scss',
})
export class CalificarTareaFormComponent {}
