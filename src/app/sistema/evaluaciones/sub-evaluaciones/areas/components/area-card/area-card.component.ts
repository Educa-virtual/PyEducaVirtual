import { CommonModule } from '@angular/common'
import { Component, ChangeDetectionStrategy, Input } from '@angular/core'
import { IArea } from '../../interfaces/area.interface'
import { ButtonModule } from 'primeng/button'
import { Router, RouterModule } from '@angular/router'
import { TooltipModule } from 'primeng/tooltip'
import { CompartirFormularioEvaluacionService } from '../../../../services/ereEvaluaciones/compartir-formulario-evaluacion.service'

@Component({
    selector: 'app-area-card',
    standalone: true,
    templateUrl: './area-card.component.html',
    styleUrl: './area-card.component.scss',
    imports: [CommonModule, TooltipModule, ButtonModule, RouterModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AreaCardComponent {
    @Input() area: IArea
    @Input() _iEvaluacionId: number | null = null // Usamos _iEvaluacionId como input
    @Input() _nombreEvaluacion: string | null = null // Usamos _nombreEvaluacion como input

    constructor(
        private router: Router,
        private compartirFormularioEvaluacionService: CompartirFormularioEvaluacionService
    ) {}
    ngOnInit(): void {
        // Verifica si el parámetro llega correctamente
        console.log(
            'A ver si llega a AreaCard el iEvaluacionId: ----->',
            this._iEvaluacionId
        )
    }
    irABancoPreguntas(area: any): void {
        // Almacenar los datos en el servicio
        this.compartirFormularioEvaluacionService.setcEvaluacionNombre(
            area.nombre
        )
        this.compartirFormularioEvaluacionService.setGrado(area.grado)
        this.compartirFormularioEvaluacionService.setNivel(area.nivel)
        this.compartirFormularioEvaluacionService.setSeccion(area.seccion)

        // Navegar a la nueva ruta sin parámetros en la URL
        this.router.navigate(['./', area.id, 'banco-preguntas'])
    }
}
