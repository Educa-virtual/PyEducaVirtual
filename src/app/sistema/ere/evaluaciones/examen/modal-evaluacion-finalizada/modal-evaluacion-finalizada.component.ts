import { PrimengModule } from '@/app/primeng.module'
import { Component, Input } from '@angular/core'

@Component({
    selector: 'app-modal-evaluacion-finalizada',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './modal-evaluacion-finalizada.component.html',
    styleUrl: './modal-evaluacion-finalizada.component.scss',
})
export class ModalEvaluacionFinalizadaComponent {
    @Input() grado: string

    visible: boolean = true

    irEncuesta() {
        switch (this.grado) {
            case 'segundo':
                window.open(
                    'https://docs.google.com/forms/d/e/1FAIpQLSd1g5gBdZRKrtOs8ct5JRgt5Rq2VusvHn10pjtxgUjrLA3LzQ/viewform',
                    '_blank'
                )
                break
            case 'cuarto':
                window.open(
                    'https://docs.google.com/forms/d/e/1FAIpQLSfLd84JJWdx6fZhUdW7TBGEs7uGFOQaX_JPTyI2hhwzzkDK6w/viewform',
                    '_blank'
                )
                break
        }
    }
}
