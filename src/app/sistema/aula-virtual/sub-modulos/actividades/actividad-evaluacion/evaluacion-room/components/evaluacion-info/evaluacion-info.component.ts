import { PrimengModule } from '@/app/primeng.module'
import { FullDatePipe } from '@/app/sistema/aula-virtual/pipes/full-date.pipe'
import { FullTimePipe } from '@/app/sistema/aula-virtual/pipes/full-time.pipe'
import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'

@Component({
    selector: 'app-evaluacion-info',
    standalone: true,
    imports: [CommonModule, PrimengModule, FullDatePipe, FullTimePipe],
    templateUrl: './evaluacion-info.component.html',
    styleUrl: './evaluacion-info.component.scss',
})
export class EvaluacionInfoComponent {
    @Input({ required: true }) evaluacionEstudiante
}
