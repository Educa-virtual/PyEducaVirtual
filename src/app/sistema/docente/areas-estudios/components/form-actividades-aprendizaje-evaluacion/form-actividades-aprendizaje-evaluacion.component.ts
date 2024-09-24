import { PrimengModule } from '@/app/primeng.module'
import { ModalPrimengComponent } from '@/app/shared/modal-primeng/modal-primeng.component'
import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
} from '@angular/core'

@Component({
    selector: 'app-form-actividades-aprendizaje-evaluacion',
    standalone: true,
    imports: [ModalPrimengComponent, PrimengModule],
    templateUrl: './form-actividades-aprendizaje-evaluacion.component.html',
    styleUrl: './form-actividades-aprendizaje-evaluacion.component.scss',
})
export class FormActividadesAprendizajeEvaluacionComponent
    implements OnChanges
{
    @Output() accionBtnItem = new EventEmitter()

    @Input() showModal: boolean = true
    @Input() data = []

    @Input() option: string

    ngOnChanges(changes) {
        const { currentValue } = changes.data
        this.data = currentValue
    }
    accionBtn(elemento): void {
        const { accion } = elemento
        const { item } = elemento

        switch (accion) {
            case 'close-modal':
                this.accionBtnItem.emit({ accion, item })
                break

            default:
                break
        }
    }
}
