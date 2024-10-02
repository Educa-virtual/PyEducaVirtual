import { CommonModule } from '@angular/common'
import { Component, inject, Input, OnInit } from '@angular/core'
import {
    ControlContainer,
    FormGroup,
    ReactiveFormsModule,
} from '@angular/forms'

@Component({
    selector: 'app-common-dropdown',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './common-dropdown.component.html',
    styleUrl: './common-dropdown.component.scss',
})
export class CommonDropdownComponent implements OnInit {
    private _parentContainer = inject(ControlContainer)

    @Input({ required: true }) controlKey: string
    @Input() id = ''
    @Input() type = 'text'

    ngOnInit(): void {
        this.parentFormGroup.get(this.controlKey).hasError('required')
    }

    get parentFormGroup() {
        return this._parentContainer.control as FormGroup
    }

    get campoInvalido(): boolean {
        return (
            this._parentContainer.control.get(this.controlKey).invalid &&
            this._parentContainer.control.get(this.controlKey).touched
        )
    }
}
