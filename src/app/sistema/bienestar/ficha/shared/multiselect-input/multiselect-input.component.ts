import { PrimengModule } from '@/app/primeng.module'
import { Component, Input, OnInit } from '@angular/core'
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms'

@Component({
    selector: 'app-multiselect-input',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './multiselect-input.component.html',
    styleUrl: './multiselect-input.component.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: MultiselectInputComponent,
        },
    ],
})
export class MultiselectInputComponent implements OnInit {
    @Input() multiselectItems: Array<object>
    @Input() multiselectPlaceholder: string = 'Seleccione'

    @Input() inputControl: FormControl
    @Input() multiselectControl: FormControl

    @Input() addonLabel: string = 'Campo'

    @Input() inputPlaceholder: string = 'Especifique otro'
    @Input() inputType: string = 'text'
    @Input() inputRequired: boolean = false
    @Input() inputMaxlength: number = null

    @Input() visibleInput: boolean = false

    @Input() filter: boolean = true
    @Input() showClear: boolean = true
    @Input() showToggleAll: boolean = false

    onChange = () => {}
    onTouched = () => {}
    touched = false
    disabled = false

    ngOnInit() {
        this.multiselectControl.valueChanges.subscribe((value) => {
            this.handleDropdownChange({ value: value })
        })
    }

    handleDropdownChange(event: any) {
        if (event?.value === undefined) {
            this.visibleInput = false
            this.inputControl.setValue(null)
            return null
        }
        if (Array.isArray(event.value)) {
            if (event.value.includes(1)) {
                this.visibleInput = true
            } else {
                this.visibleInput = false
                this.inputControl.setValue(null)
            }
        } else {
            if (event.value == 1) {
                this.visibleInput = true
            } else {
                this.visibleInput = false
                this.inputControl.setValue(null)
            }
        }
    }

    writeValue(value: any) {
        if (value) {
            this.multiselectControl.setValue(value) // Assign the values to the MultiSelect
        } else {
            this.multiselectControl.setValue(null) // Reset if value is null or undefined
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
