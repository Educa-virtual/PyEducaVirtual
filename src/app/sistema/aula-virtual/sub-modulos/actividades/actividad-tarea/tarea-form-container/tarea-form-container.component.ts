import { CommonModule } from '@angular/common'
import { Component, inject, ViewChild } from '@angular/core'
import { DialogModule } from 'primeng/dialog'
import { TareaFormComponent } from '../tarea-form/tarea-form.component'
import { IActividad } from '@/app/sistema/aula-virtual/interfaces/actividad.interface'
import { ButtonModule } from 'primeng/button'
import { FormGroup } from '@angular/forms'
import { DynamicDialogRef } from 'primeng/dynamicdialog'

@Component({
    selector: 'app-tarea-form-container',
    standalone: true,
    imports: [CommonModule, DialogModule, TareaFormComponent, ButtonModule],
    templateUrl: './tarea-form-container.component.html',
    styleUrl: './tarea-form-container.component.scss',
})
export class TareaFormContainerComponent {
    @ViewChild(TareaFormComponent) tareaFormComponent: TareaFormComponent
    actividad: IActividad | undefined

    private ref = inject(DynamicDialogRef)

    submitFormulario(form: FormGroup) {
        console.log('Formulario enviado:', form.value)
    }

    cancelar() {
        this.ref.close(null)
    }

    closeModal() {
        this.ref.close(null)
    }
}
