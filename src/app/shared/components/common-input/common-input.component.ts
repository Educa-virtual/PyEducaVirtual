import { CommonModule } from '@angular/common'
import { Component, inject, Input, OnInit } from '@angular/core'
import {
    ControlContainer,
    FormGroup,
    ReactiveFormsModule,
} from '@angular/forms'
import { InputTextModule } from 'primeng/inputtext'

@Component({
    selector: 'app-common-input',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, InputTextModule],
    templateUrl: './common-input.component.html',
    styleUrl: './common-input.component.scss',
})
export class CommonInputComponent implements OnInit {
    @Input({ required: true }) controlKey: string
    @Input() id: string
    @Input() label: string
    @Input() type: string = 'text'
    private _parentContainer = inject(ControlContainer)

    ngOnInit(): void {
        this.parentFormGroup.get(this.controlKey).hasError('required')
        console.log(this._parentContainer.control.get(this.controlKey))
    }

    get parentFormGroup() {
        return this._parentContainer.control as FormGroup
    }

    get errorMessage(): string | null {
        const control = this._parentContainer.control.get(this.controlKey)
        if (control.hasError('required')) {
            return 'Este campo es requerido'
        }
        return null
    }

    get campoInvalido(): boolean {
        return (
            this._parentContainer.control.get(this.controlKey).invalid &&
            this._parentContainer.control.get(this.controlKey).touched
        )
    }
}
