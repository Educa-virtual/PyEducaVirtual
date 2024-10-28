import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import { TableModule } from 'primeng/table'

@Component({
    selector: 'app-evaluacion-info',
    standalone: true,
    imports: [CommonModule, TableModule],
    templateUrl: './evaluacion-info.component.html',
    styleUrl: './evaluacion-info.component.scss',
})
export class EvaluacionInfoComponent {
    @Input({ required: true }) evaluacion
}
