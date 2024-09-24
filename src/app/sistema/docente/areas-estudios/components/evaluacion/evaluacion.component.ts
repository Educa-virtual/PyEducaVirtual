import { PrimengModule } from '@/app/primeng.module'
import { Component } from '@angular/core'

@Component({
    selector: 'app-evaluacion',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './evaluacion.component.html',
    styleUrl: './evaluacion.component.scss',
})
export class EvaluacionComponent {}
