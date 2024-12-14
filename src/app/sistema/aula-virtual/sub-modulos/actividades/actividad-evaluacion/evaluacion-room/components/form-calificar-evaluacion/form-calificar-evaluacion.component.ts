import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
} from '@angular/core'
import { ModalPrimengComponent } from '../../../../../../../../shared/modal-primeng/modal-primeng.component'
import { PrimengModule } from '@/app/primeng.module'

@Component({
    selector: 'app-form-calificar-evaluacion',
    standalone: true,
    imports: [ModalPrimengComponent, PrimengModule],
    templateUrl: './form-calificar-evaluacion.component.html',
    styleUrl: './form-calificar-evaluacion.component.scss',
})
export class FormCalificarEvaluacionComponent implements OnChanges {
    @Output() accionBtnItem = new EventEmitter()

    @Input() showFormCalificarEvaluacion: boolean = false
    @Input() name: string = ''

    ngOnChanges(changes) {
        if (changes.showFormCalificarEvaluacion?.currentValue) {
            this.showFormCalificarEvaluacion =
                changes.showFormCalificarEvaluacion.currentValue
        }
    }
    accionBtn(elemento): void {
        const { accion } = elemento
        const { item } = elemento

        switch (accion) {
            case 'close-modal':
                this.accionBtnItem.emit({
                    accion: 'close-modal-preguntas-form',
                    item,
                })
                break
        }
    }
}
