import { PrimengModule } from '@/app/primeng.module'
import { Component, Input, OnInit, TemplateRef } from '@angular/core'
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms'

@Component({
    selector: 'app-dropdown-input',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './dropdown-input.component.html',
    styleUrl: './dropdown-input.component.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: DropdownInputComponent,
        },
    ],
})
export class DropdownInputComponent implements OnInit {
    @Input() dropdownItems: Array<object>
    @Input() dropdownPlaceholder: string = 'Seleccione'

    @Input() inputControl: FormControl
    @Input() dropdownControl: FormControl

    @Input() addonLabel: string = 'Campo'

    @Input() inputPlaceholder: string = 'Especifique otro'
    @Input() inputType: string = 'text'
    @Input() inputRequired: boolean = false
    @Input() inputMaxlength: number = null

    @Input() visibleInput: boolean = false

    @Input() filter: boolean = true
    @Input() showClear: boolean = true
    @Input() showToggleAll: boolean = false

    @Input() infoAdicional!: TemplateRef<any>

    onChange = () => {}
    onTouched = () => {}
    touched = false
    disabled = false

    ngOnInit() {
        this.dropdownControl.valueChanges.subscribe((value) => {
            this.handleDropdownChange({ value: value })
        })
    }

    handleDropdownChange(event: any) {
        if (event?.value === undefined) {
            this.visibleInput = false
            this.inputControl.setValue(null)
            return null
        }
        if (event.value == 1) {
            this.visibleInput = true
        } else {
            this.visibleInput = false
            this.inputControl.setValue(null)
        }
    }

    writeValue(value: any) {
        if (value) {
            this.dropdownControl.setValue(value) // Assign the values to the Dropdown
        } else {
            this.dropdownControl.setValue(null) // Reset if value is null or undefined
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
