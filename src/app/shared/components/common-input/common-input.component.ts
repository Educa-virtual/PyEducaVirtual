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
    private _parentContainer = inject(ControlContainer)

    ngOnInit(): void {
        console.log(this._parentContainer.control.get(this.controlKey))
    }

    get parentFormGroup() {
        return this._parentContainer.control as FormGroup
    }
}
