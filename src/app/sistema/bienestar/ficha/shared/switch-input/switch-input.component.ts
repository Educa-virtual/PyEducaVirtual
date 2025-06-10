import { PrimengModule } from '@/app/primeng.module'
import { Component, Input, OnInit } from '@angular/core'
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms'

@Component({
    selector: 'app-switch-input',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './switch-input.component.html',
    styleUrl: './switch-input.component.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: SwitchInputComponent,
        },
    ],
})
export class SwitchInputComponent implements OnInit {
    @Input() switchControl: FormControl
    @Input() inputControl: FormControl

    @Input() addonLabel: string = 'Campo'

    @Input() inputPlaceholder: string = 'Especifique otro'
    @Input() inputType: 'text' | 'number' = 'text'
    @Input() inputRequired: boolean = false

    @Input() inputMaxlength: number = null
    @Input() inputMin: number = 1
    @Input() inputMax: number = null
    @Input() inputStep: number = 1
    @Input() inputUseGrouping: boolean = false
    @Input() inputShowButtons: boolean = false

    @Input() visibleInput: boolean = false

    onChange = () => {}
    onTouched = () => {}
    touched = false
    disabled = false

    ngOnInit() {
        this.switchControl.valueChanges.subscribe((value) => {
            this.handleSwitchChange({ checked: value })
        })
    }

    handleSwitchChange(event: any) {
        if (event?.checked === undefined) {
            this.visibleInput = false
            this.inputControl.setValue(null)
            return null
        }
        if (event.checked === true) {
            this.visibleInput = true
        } else {
            this.visibleInput = false
            this.inputControl.setValue(null)
        }
    }

    writeValue(value: any) {
        if (value) {
            this.switchControl.setValue(value) // Assign the values to the MultiSelect
        } else {
            this.switchControl.setValue(null) // Reset if value is null or undefined
        }
    }

    registerOnChange(onChange: any) {
        this.onChange = onChange
    }

    registerOnTouched(onTouched: any) {
        this.onTouched = onTouched
    }

    markAsTouched() {
        if (!this.touched) {
            this.onTouched()
            this.touched = true
        }
    }

    setDisabledState(disabled: boolean) {
        this.disabled = disabled
    }
}
