import { Component } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { StepperModule } from 'primeng/stepper'
@Component({
    selector: 'app-gestionar-encuesta',
    standalone: true,
    imports: [StepperModule, PrimengModule],
    templateUrl: './gestionar-encuesta.component.html',
    styleUrl: './gestionar-encuesta.component.scss',
})
export class GestionarEncuestaComponent {}
