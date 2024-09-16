import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'

@Component({
    selector: 'app-tarea-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './tarea-form.component.html',
    styleUrl: './tarea-form.component.scss',
})
export class TareaFormComponent {
    private _formBuilder = inject(FormBuilder)

    public tareaForm = this._formBuilder.group({
        titulo: ['', [Validators.required]],
        descripcion: [''],
    })

    onSubmit() {
        console.log(this.tareaForm.value)
    }
}
