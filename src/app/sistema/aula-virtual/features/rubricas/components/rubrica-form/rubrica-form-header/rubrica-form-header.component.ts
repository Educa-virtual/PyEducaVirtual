import { Component, Input } from '@angular/core'
import { FormGroup } from '@angular/forms'

@Component({
    selector: 'app-rubrica-form-header',
    templateUrl: './rubrica-form-header.component.html',
    styleUrl: './rubrica-form-header.component.scss',
})
export class RubricaFormHeaderComponent {
    @Input() rubricaForm: FormGroup
}
