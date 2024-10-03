import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { CheckboxModule } from 'primeng/checkbox'
import { RadioButtonModule } from 'primeng/radiobutton'

@Component({
    selector: 'app-banco-pregunta-preview-item',
    standalone: true,
    imports: [CommonModule, RadioButtonModule, CheckboxModule, FormsModule],
    templateUrl: './banco-pregunta-preview-item.component.html',
    styleUrl: './banco-pregunta-preview-item.component.scss',
})
export class BancoPreguntaPreviewItemComponent {
    @Input({ required: true }) pregunta
}
