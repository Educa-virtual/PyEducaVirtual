import { CommonModule } from '@angular/common'
import { Component, Input, TemplateRef } from '@angular/core'
import { BancoPreguntaPreviewItemComponent } from './banco-pregunta-preview-item/banco-pregunta-preview-item.component'
import { PrimengModule } from '@/app/primeng.module'

@Component({
    selector: 'app-banco-pregunta-preview',
    standalone: true,
    imports: [CommonModule, BancoPreguntaPreviewItemComponent, PrimengModule],
    templateUrl: './banco-pregunta-preview.component.html',
    styleUrl: './banco-pregunta-preview.component.scss',
})
export class BancoPreguntaPreviewComponent {
    @Input({ required: true }) pregunta
    @Input() customAlternativeTemplate: TemplateRef<any> | null = null
    @Input() footerPreguntaTemplate: TemplateRef<any> | null = null
}
