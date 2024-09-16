import { CommonInputComponent } from '@/app/shared/components/common-input/common-input.component'
import { CommonModule } from '@angular/common'
import { Component, EventEmitter, inject, Output } from '@angular/core'
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms'
import { EditorModule } from 'primeng/editor'
import { DisponibilidadFormComponent } from '../../components/disponibilidad-form/disponibilidad-form.component'

@Component({
    selector: 'app-tarea-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        CommonInputComponent,
        EditorModule,
        FormsModule,
        DisponibilidadFormComponent,
    ],
    templateUrl: './tarea-form.component.html',
    styleUrl: './tarea-form.component.scss',
})
export class TareaFormComponent {
    @Output() submitEvent = new EventEmitter<FormGroup>()
    @Output() cancelEvent = new EventEmitter<void>()

    private _formBuilder = inject(FormBuilder)

    public tareaForm = this._formBuilder.group({
        titulo: ['', [Validators.required]],
        descripcion: ['', [Validators.required]],
        indicaciones: [''],
    })

    submit() {
        console.log('submit')

        if (this.tareaForm.valid) {
            this.submitEvent.emit(this.tareaForm)
        } else {
            this.tareaForm.markAllAsTouched()
        }
    }

    cancel() {
        this.tareaForm.reset()
        this.cancelEvent.emit()
    }
}
