import { PrimengModule } from '@/app/primeng.module'
import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import { FormGroup } from '@angular/forms'

@Component({
    selector: 'app-evaluacion-pregunta-logro',
    standalone: true,
    imports: [CommonModule, PrimengModule],
    templateUrl: './evaluacion-pregunta-logro.component.html',
    styleUrl: './evaluacion-pregunta-logro.component.scss',
})
export class EvaluacionPreguntaLogroComponent {
    @Input() logrosBase = []
    @Input() formEvaluacionLogro: FormGroup
}
