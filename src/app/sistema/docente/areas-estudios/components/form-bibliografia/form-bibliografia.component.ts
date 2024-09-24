import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
} from '@angular/core'
import { ModalPrimengComponent } from '../../../../../shared/modal-primeng/modal-primeng.component'
import { PrimengModule } from '@/app/primeng.module'

@Component({
    selector: 'app-form-bibliografia',
    standalone: true,
    imports: [ModalPrimengComponent, PrimengModule],
    templateUrl: './form-bibliografia.component.html',
    styleUrl: './form-bibliografia.component.scss',
})
export class FormBibliografiaComponent implements OnChanges {
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
