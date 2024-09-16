import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import { DialogModule } from 'primeng/dialog'
import { TareaFormComponent } from '../tarea-form/tarea-form.component'
import { IActividad } from '@/app/sistema/aula-virtual/interfaces/actividad.interface'
import { ButtonModule } from 'primeng/button'

@Component({
    selector: 'app-tarea-form-container',
    standalone: true,
    imports: [CommonModule, DialogModule, TareaFormComponent, ButtonModule],
    templateUrl: './tarea-form-container.component.html',
    styleUrl: './tarea-form-container.component.scss',
})
export class TareaFormContainerComponent {
    @Input({ required: true }) visible: boolean = false
    @Input() actividad: IActividad | undefined
}
