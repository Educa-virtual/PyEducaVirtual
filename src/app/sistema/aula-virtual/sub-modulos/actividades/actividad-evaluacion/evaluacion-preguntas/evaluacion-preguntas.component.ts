import { PrimengModule } from '@/app/primeng.module'
import { ToolbarPrimengComponent } from '@/app/shared/toolbar-primeng/toolbar-primeng.component'
import { Component, Input } from '@angular/core'
import { MenuItem } from 'primeng/api'
import { NoDataComponent } from '@/app/shared/no-data/no-data.component'
export interface IEvaluacion {
    cTitle: string
    iEstado?: number
}
@Component({
    selector: 'app-evaluacion-preguntas',
    standalone: true,
    imports: [ToolbarPrimengComponent, PrimengModule, NoDataComponent],
    templateUrl: './evaluacion-preguntas.component.html',
    styleUrl: './evaluacion-preguntas.component.scss',
})
export class EvaluacionPreguntasComponent {
    @Input() data: IEvaluacion
    totalPreguntas: number = 0
    preguntas: any = []
    tiposAgregarPregunta: MenuItem[] = [
        {
            label: 'Nueva Pregunta simple',
            icon: 'pi pi-plus',
            command: () => {
                // this.handleNuevaPregunta(false)
            },
        },
        {
            label: 'Nueva Pregunta múltiple',
            icon: 'pi pi-plus',
            command: () => {
                // this.handleNuevaPregunta(true)
            },
        },
        {
            label: 'Agregar del banco de preguntas',
            icon: 'pi pi-plus',
            command: () => {
                // this.showModalBancoPreguntas = true
            },
        },
    ]
}
