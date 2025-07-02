import { PrimengModule } from '@/app/primeng.module'
import { Component, Input, OnChanges, OnInit, TemplateRef } from '@angular/core'
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms'
import { TextFieldModule } from '@angular/cdk/text-field'

@Component({
    selector: 'app-switch-input',
    standalone: true,
    imports: [PrimengModule, TextFieldModule],
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
export class SwitchInputComponent implements OnInit, OnChanges {
    @Input() switchControl: FormControl
    @Input() inputControl: FormControl

    @Input() addonLabel: string = 'Campo'

    @Input() inputPlaceholder: string = 'Especifique otro'
    @Input() inputType: 'text' | 'number' | 'textarea' = 'text'
    @Input() inputRequired: boolean = false

    @Input() inputMaxlength: number = null
    @Input() inputMin: number = 1
    @Input() inputMax: number = null
    @Input() inputStep: number = 1
    @Input() inputUseGrouping: boolean = false
    @Input() inputShowButtons: boolean = false

    @Input() inputInitRows: number = 3
    @Input() inputMinRows: number = 3
    @Input() inputMaxRows: number = 6

    @Input() infoAdicional!: TemplateRef<any>

    inputMinRowsString: string
    inputMaxRowsString: string

    @Input() visibleInput: boolean = false

    onChange = () => {}
    onTouched = () => {}
    touched = false
    disabled = false

    ngOnInit() {
        this.switchControl.valueChanges.subscribe((value) => {
            this.handleSwitchChange({ checked: value })
        })
        this.inputMinRowsString = `${this.inputMinRows}lh`
        this.inputMaxRowsString = `${this.inputMaxRows}lh`
    }

    ngOnChanges() {
        this.handleSwitchChange({ checked: this.switchControl.value })
    }

    handleSwitchChange(event: any) {
        if (event?.checked === undefined) {
            this.visibleInput = false
            this.inputControl.setValue(null)
            return null
        }
        if (event.checked == true) {
            this.visibleInput = true
            this.inputControl.markAsTouched()
            this.inputControl.markAsDirty()
        } else {
            this.visibleInput = false
            this.inputControl.setValue(null)
        }
    }

    writeValue(value: any) {
        if (value) {
            this.switchControl.setValue(value) // Assign the values to the Switch
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
