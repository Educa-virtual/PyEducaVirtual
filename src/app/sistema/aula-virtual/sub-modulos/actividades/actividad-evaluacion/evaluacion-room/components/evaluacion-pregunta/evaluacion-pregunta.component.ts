import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import { EvaluacionPreguntaAlternativaComponent } from './evaluacion-pregunta-alternativa/evaluacion-pregunta-alternativa.component'
import { BancoPreguntaPreviewComponent } from '@/app/sistema/evaluaciones/sub-evaluaciones/banco-preguntas/components/banco-pregunta-preview/banco-pregunta-preview.component'
import { PrimengModule } from '@/app/primeng.module'

@Component({
    selector: 'app-evaluacion-pregunta',
    standalone: true,
    imports: [
        CommonModule,
        EvaluacionPreguntaAlternativaComponent,
        BancoPreguntaPreviewComponent,
        PrimengModule,
    ],
    templateUrl: './evaluacion-pregunta.component.html',
    styleUrl: './evaluacion-pregunta.component.scss',
})
export class EvaluacionPreguntaComponent {
    @Input({ required: true }) pregunta
}
