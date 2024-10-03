import { CommonInputComponent } from '@/app/shared/components/common-input/common-input.component'
import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { ButtonModule } from 'primeng/button'
import { InputTextareaModule } from 'primeng/inputtextarea'

@Component({
    selector: 'app-calificar-tarea-form',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        CommonInputComponent,
        ReactiveFormsModule,
        InputTextareaModule,
    ],
    templateUrl: './calificar-tarea-form.component.html',
    styleUrl: './calificar-tarea-form.component.scss',
})
export class CalificarTareaFormComponent {
    private _formBuilder = inject(FormBuilder)

    public calificarTareaForm = this._formBuilder.group({
        nota: [0, [Validators.required]],
    })
}
