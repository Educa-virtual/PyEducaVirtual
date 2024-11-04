import { CommonModule } from '@angular/common'
import { Component, inject, OnInit } from '@angular/core'
import { EvaluacionInfoComponent } from '../components/evaluacion-info/evaluacion-info.component'
import { DynamicDialogConfig } from 'primeng/dynamicdialog'
import { EvaluacionPreguntaComponent } from '../components/evaluacion-pregunta/evaluacion-pregunta.component'
import { PrimengModule } from '@/app/primeng.module'
import { RemoveHTMLPipe } from '@/app/shared/pipes/remove-html.pipe'

@Component({
    selector: 'app-evaluacion-pregunta-calificacion',
    standalone: true,
    imports: [
        CommonModule,
        EvaluacionInfoComponent,
        EvaluacionPreguntaComponent,
        RemoveHTMLPipe,
        PrimengModule,
    ],
    templateUrl: './evaluacion-pregunta-calificacion.component.html',
    styleUrl: './evaluacion-pregunta-calificacion.component.scss',
})
export class EvaluacionPreguntaCalificacionComponent implements OnInit {
    evaluacion = null
    pregunta = null
    // injeccion de dependencias
    private _config = inject(DynamicDialogConfig)

    ngOnInit() {
        this.evaluacion = this._config.data.evaluacion
        this.pregunta = this._config.data.pregunta
        console.log(this.pregunta)
    }
}
