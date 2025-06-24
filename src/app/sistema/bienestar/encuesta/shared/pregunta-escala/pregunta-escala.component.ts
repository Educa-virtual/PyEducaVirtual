import { PrimengModule } from '@/app/primeng.module'
import { Component, Input, TemplateRef } from '@angular/core'
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms'
import { TextFieldModule } from '@angular/cdk/text-field'

@Component({
    selector: 'app-pregunta-escala',
    standalone: true,
    imports: [PrimengModule, TextFieldModule],
    templateUrl: './pregunta-escala.component.html',
    styleUrl: './pregunta-escala.component.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: PreguntaEscalaComponent,
        },
    ],
})
export class PreguntaEscalaComponent {
    @Input() ratingControl: FormControl

    @Input() addonLabel: string = 'Campo'

    @Input() infoAdicional!: TemplateRef<any>

    onChange = () => {}
    onTouched = () => {}
    touched = false
    disabled = false

    writeValue(value: any) {
        if (value) {
            this.ratingControl.setValue(value) // Assign the values to the Switch
        } else {
            this.ratingControl.setValue(null) // Reset if value is null or undefined
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
