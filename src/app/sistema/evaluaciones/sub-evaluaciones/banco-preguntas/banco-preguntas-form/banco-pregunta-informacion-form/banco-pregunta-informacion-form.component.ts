import { CommonInputComponent } from '@/app/shared/components/common-input/common-input.component'
import { CommonModule } from '@angular/common'
import { Component, inject, Input, OnInit } from '@angular/core'
import {
    ControlContainer,
    FormGroup,
    ReactiveFormsModule,
} from '@angular/forms'
import { DropdownModule } from 'primeng/dropdown'
import { EditorModule } from 'primeng/editor'

@Component({
    selector: 'app-banco-pregunta-informacion-form',
    standalone: true,
    imports: [
        CommonModule,
        DropdownModule,
        EditorModule,
        CommonInputComponent,
        ReactiveFormsModule,
    ],
    templateUrl: './banco-pregunta-informacion-form.component.html',
    styleUrl: './banco-pregunta-informacion-form.component.scss',
})
export class BancoPreguntaInformacionFormComponent implements OnInit {
    @Input() tipoPreguntas = []
    @Input({ required: true }) controlKey = ''

    // injeccion de dependencias
    private parentContainer = inject(ControlContainer)

    formGroup!: FormGroup

    ngOnInit(): void {
        this.formGroup = this.parentFormGroup
    }

    // obtiene el formulario padre usando ControlContainer
    get parentFormGroup() {
        return this.parentContainer.control?.get(this.controlKey) as FormGroup
    }
}
