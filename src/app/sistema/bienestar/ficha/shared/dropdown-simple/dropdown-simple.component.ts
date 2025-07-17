import { PrimengModule } from '@/app/primeng.module'
import { Component, Input, TemplateRef } from '@angular/core'
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms'

@Component({
    selector: 'app-dropdown-simple',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './dropdown-simple.component.html',
    styleUrl: './dropdown-simple.component.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: DropdownSimpleComponent,
        },
    ],
})
export class DropdownSimpleComponent {
    @Input() dropdownItems: Array<object>
    @Input() dropdownPlaceholder: string = 'Seleccione'

    @Input() dropdownControl: FormControl

    @Input() addonLabel: string = 'Campo'

    @Input() filter: boolean = true
    @Input() showClear: boolean = true
    @Input() showToggleAll: boolean = false

    @Input() infoAdicional!: TemplateRef<any>

    onChange = () => {}
    onTouched = () => {}
    touched = false
    disabled = false

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
