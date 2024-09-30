import { PrimengModule } from '@/app/primeng.module'
import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
} from '@angular/core'
import { ModalPrimengComponent } from '../../../../../shared/modal-primeng/modal-primeng.component'

@Component({
    selector: 'app-form-recursos-didacticos',
    standalone: true,
    imports: [PrimengModule, ModalPrimengComponent],
    templateUrl: './form-recursos-didacticos.component.html',
    styleUrl: './form-recursos-didacticos.component.scss',
})
export class FormRecursosDidacticosComponent implements OnChanges {
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
