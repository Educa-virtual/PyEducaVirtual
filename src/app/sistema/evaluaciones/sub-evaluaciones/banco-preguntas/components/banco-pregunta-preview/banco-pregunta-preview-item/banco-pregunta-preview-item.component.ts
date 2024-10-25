import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import { BancoPreguntaAlternativaComponent } from '../banco-pregunta-alternativa/banco-pregunta-alternativa.component'

@Component({
    selector: 'app-banco-pregunta-preview-item',
    standalone: true,
    imports: [CommonModule, BancoPreguntaAlternativaComponent],
    templateUrl: './banco-pregunta-preview-item.component.html',
    styleUrl: './banco-pregunta-preview-item.component.scss',
})
export class BancoPreguntaPreviewItemComponent {
    @Input({ required: true }) pregunta
}
