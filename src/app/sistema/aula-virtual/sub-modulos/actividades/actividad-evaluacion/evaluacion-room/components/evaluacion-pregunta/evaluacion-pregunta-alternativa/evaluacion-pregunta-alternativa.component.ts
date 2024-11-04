import { PrimengModule } from '@/app/primeng.module'
import { EditorOnlyViewDirective } from '@/app/shared/directives/editor-only-view.directive'
import { IconComponent } from '@/app/shared/icon/icon.component'
import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'

@Component({
    selector: 'app-evaluacion-pregunta-alternativa',
    standalone: true,
    imports: [
        CommonModule,
        PrimengModule,
        IconComponent,
        EditorOnlyViewDirective,
    ],
    templateUrl: './evaluacion-pregunta-alternativa.component.html',
    styleUrl: './evaluacion-pregunta-alternativa.component.scss',
})
export class EvaluacionPreguntaAlternativaComponent {
    @Input({ required: true }) alternativa
    @Input({ required: true }) pregunta
}
