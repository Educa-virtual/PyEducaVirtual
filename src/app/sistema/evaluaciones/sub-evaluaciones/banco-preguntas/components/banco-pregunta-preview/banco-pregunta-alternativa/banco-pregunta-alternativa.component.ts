import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { CheckboxModule } from 'primeng/checkbox'
import { RadioButtonModule } from 'primeng/radiobutton'

@Component({
    selector: 'app-banco-pregunta-alternativa',
    standalone: true,
    imports: [CommonModule, RadioButtonModule, CheckboxModule, FormsModule],
    templateUrl: './banco-pregunta-alternativa.component.html',
    styleUrl: './banco-pregunta-alternativa.component.scss',
})
export class BancoPreguntaAlternativaComponent {
    @Input({ required: true }) alternativa
    @Input({ required: true }) pregunta
}
