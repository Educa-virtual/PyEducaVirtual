import { PrimengModule } from '@/app/primeng.module'
import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'

@Component({
    selector: 'app-evaluacion-form-container-',
    standalone: true,
    imports: [CommonModule, PrimengModule],
    templateUrl: './evaluacion-form-container.component.html',
    styleUrl: './evaluacion-form-container.component.scss',
})
export class EvaluacionFormContainerComponent {}
