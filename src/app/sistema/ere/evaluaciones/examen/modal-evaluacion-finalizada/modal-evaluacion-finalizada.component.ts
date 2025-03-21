import { PrimengModule } from '@/app/primeng.module'
import { Component, Input, OnInit } from '@angular/core'

@Component({
    selector: 'app-modal-evaluacion-finalizada',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './modal-evaluacion-finalizada.component.html',
    styleUrl: './modal-evaluacion-finalizada.component.scss',
})
export class ModalEvaluacionFinalizadaComponent implements OnInit {
    @Input() grado: string

    visible: boolean = true
    mostrarBotonEncuesta: boolean = false

    ngOnInit() {
        switch (this.grado) {
            case '2do.':
            case '4to.':
                this.mostrarBotonEncuesta = true
                break
        }
    }

    irEncuesta() {
        console.log(this.grado)
        switch (this.grado) {
            case '2do.':
                window.open(
                    'https://docs.google.com/forms/d/e/1FAIpQLSd1g5gBdZRKrtOs8ct5JRgt5Rq2VusvHn10pjtxgUjrLA3LzQ/viewform',
                    '_blank'
                )
                break
            case '4to.':
                window.open(
                    'https://docs.google.com/forms/d/e/1FAIpQLSfLd84JJWdx6fZhUdW7TBGEs7uGFOQaX_JPTyI2hhwzzkDK6w/viewform',
                    '_blank'
                )
                break
        }
    }
}
