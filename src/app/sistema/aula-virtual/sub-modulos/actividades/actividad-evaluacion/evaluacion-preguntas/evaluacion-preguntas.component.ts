import { PrimengModule } from '@/app/primeng.module'
import { ToolbarPrimengComponent } from '@/app/shared/toolbar-primeng/toolbar-primeng.component'
import { Component, Input } from '@angular/core'
import { MenuItem } from 'primeng/api'
import { NoDataComponent } from '@/app/shared/no-data/no-data.component'
import { PreguntasFormComponent } from '../evaluacion-form/preguntas-form/preguntas-form.component'
export interface IEvaluacion {
    cTitle: string
    cHeader: string
    iEstado?: number
    iEvaluacionId?: string | number
}
@Component({
    selector: 'app-evaluacion-preguntas',
    standalone: true,
    imports: [
        ToolbarPrimengComponent,
        PrimengModule,
        NoDataComponent,
        PreguntasFormComponent,
    ],
    templateUrl: './evaluacion-preguntas.component.html',
    styleUrl: './evaluacion-preguntas.component.scss',
})
export class EvaluacionPreguntasComponent {
    @Input() data: IEvaluacion

    showModalPreguntas: boolean = false
    totalPreguntas: number = 0
    preguntas: any = []
    tiposAgregarPregunta: MenuItem[] = [
        {
            label: 'Pregunta',
            icon: 'pi pi-plus',
            command: () => {
                // this.handleNuevaPregunta(false)
                this.showModalPreguntas = true
            },
        },
        {
            label: 'Encabezado',
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
