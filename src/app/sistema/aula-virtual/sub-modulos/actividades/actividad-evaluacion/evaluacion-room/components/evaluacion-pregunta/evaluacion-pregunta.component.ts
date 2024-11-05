import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Input, Output } from '@angular/core'
import { BancoPreguntaPreviewComponent } from '@/app/sistema/evaluaciones/sub-evaluaciones/banco-preguntas/components/banco-pregunta-preview/banco-pregunta-preview.component'
import { PrimengModule } from '@/app/primeng.module'
import { EvaluacionPreguntaAlternativaComponent } from './evaluacion-pregunta-alternativa/evaluacion-pregunta-alternativa.component'

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
    @Output() calificarPreguntaChange = new EventEmitter()
    @Input({ required: true }) pregunta
    @Input() hideButton = false
}
