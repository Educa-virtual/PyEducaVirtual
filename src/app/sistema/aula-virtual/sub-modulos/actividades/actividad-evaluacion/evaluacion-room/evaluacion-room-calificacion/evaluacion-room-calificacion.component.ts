import { LeyendaComponent } from '@/app/shared/components/leyenda/leyenda.component'
import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import { IconFieldModule } from 'primeng/iconfield'
import { InputIconModule } from 'primeng/inputicon'
import { InputTextModule } from 'primeng/inputtext'
import { TableModule } from 'primeng/table'
import { EvaluacionInfoComponent } from '@/app/sistema/aula-virtual/sub-modulos/actividades/actividad-evaluacion/evaluacion-room/components/evaluacion-info/evaluacion-info.component'
import { EmptySectionComponent } from '@/app/shared/components/empty-section/empty-section.component'
import { AccordionModule } from 'primeng/accordion'
import { BancoPreguntaPreviewItemComponent } from '@/app/sistema/evaluaciones/sub-evaluaciones/banco-preguntas/components/banco-pregunta-preview/banco-pregunta-preview-item/banco-pregunta-preview-item.component'
import { RemoveHTMLPipe } from '@/app/shared/pipes/remove-html.pipe'

@Component({
    selector: 'app-evaluacion-room-calificacion',
    standalone: true,
    imports: [
        CommonModule,
        LeyendaComponent,
        TableModule,
        IconFieldModule,
        InputIconModule,
        InputTextModule,
        EvaluacionInfoComponent,
        EmptySectionComponent,
        AccordionModule,
        RemoveHTMLPipe,
        BancoPreguntaPreviewItemComponent,
    ],
    templateUrl: './evaluacion-room-calificacion.component.html',
    styleUrl: './evaluacion-room-calificacion.component.scss',
})
export class EvaluacionRoomCalificacionComponent {
    @Input({ required: true }) evaluacion
    @Input() evaluacionesEstudiantes = [
        {
            iEvalPromId: 1,
            pregunta: [],
            nEvalPromNota: 10,
            cEstNombres: 'Usuario',
            cEstPaterno: 'prueba',
        },
        {
            iEvalPromId: 2,
            pregunta: [],
            nEvalPromNota: 10,
            cEstNombres: 'Usuario',
            cEstPaterno: 'prueba 2',
        },
        {
            iEvalPromId: 3,
            pregunta: [],
            nEvalPromNota: 10,
            cEstNombres: 'Usuario',
            cEstPaterno: 'prueba 3',
        },
    ]

    public evaluacionSeleccionada = null

    public seleccionarEvaluacion(evaluacion) {
        this.evaluacionSeleccionada = evaluacion
    }
}
