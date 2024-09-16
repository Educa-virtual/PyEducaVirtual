import { CommonModule } from '@angular/common'
import {
    Component,
    EventEmitter,
    Input,
    Output,
    ViewChild,
} from '@angular/core'
import { DialogModule } from 'primeng/dialog'
import { TareaFormComponent } from '../tarea-form/tarea-form.component'
import { IActividad } from '@/app/sistema/aula-virtual/interfaces/actividad.interface'
import { ButtonModule } from 'primeng/button'
import { FormGroup } from '@angular/forms'

@Component({
    selector: 'app-tarea-form-container',
    standalone: true,
    imports: [CommonModule, DialogModule, TareaFormComponent, ButtonModule],
    templateUrl: './tarea-form-container.component.html',
    styleUrl: './tarea-form-container.component.scss',
})
export class TareaFormContainerComponent {
    @ViewChild(TareaFormComponent) tareaFormComponent: TareaFormComponent
    @Input({ required: true }) visible: boolean = false
    @Input() actividad: IActividad | undefined

    @Output() visibleChange = new EventEmitter<boolean>()

    closeModal(event: boolean) {
        this.visibleChange.emit(event)
    }

    submitFormulario(form: FormGroup) {
        console.log('Formulario enviado:', form.value)
    }

    cancelar() {
        this.visibleChange.emit(false)
        console.log('Formulario cancelado')
    }
}
