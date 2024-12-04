import { CommonModule } from '@angular/common'
import { Component, ChangeDetectionStrategy, Input } from '@angular/core'
import { IArea } from '../../interfaces/area.interface'
import { ButtonModule } from 'primeng/button'
import { RouterModule } from '@angular/router'
import { TooltipModule } from 'primeng/tooltip'

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
    @Input() _iEvaluacionId: string | null = null // Usamos _iEvaluacionId como input
    @Input() _nombreEvaluacion: string | null = null // Usamos _nombreEvaluacion como input
    ngOnInit(): void {
        // Verifica si el parámetro llega correctamente
        console.log(
            'A ver si llega a AreaCard el iEvaluacionId:',
            this._iEvaluacionId
        )
    }
}
