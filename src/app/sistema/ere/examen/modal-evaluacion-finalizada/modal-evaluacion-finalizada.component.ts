import { PrimengModule } from '@/app/primeng.module'
import { Component } from '@angular/core'

@Component({
    selector: 'app-modal-evaluacion-finalizada',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './modal-evaluacion-finalizada.component.html',
    styleUrl: './modal-evaluacion-finalizada.component.scss',
})
export class ModalEvaluacionFinalizadaComponent {
    visible: boolean = true
}
