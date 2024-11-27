import { PrimengModule } from '@/app/primeng.module'
import {
    Component,
    EventEmitter,
    Input,
    Output,
    OnChanges,
} from '@angular/core'
import { ModalPrimengComponent } from '../modal-primeng/modal-primeng.component'

@Component({
    selector: 'app-recover-password',
    standalone: true,
    imports: [PrimengModule, ModalPrimengComponent],
    templateUrl: './recover-password.component.html',
    styleUrl: './recover-password.component.scss',
})
export class RecoverPasswordComponent implements OnChanges {
    @Output() accionBtnItem = new EventEmitter()

    @Input() showModal: boolean = true

    formulario: number = 1
    ngOnChanges(changes) {
        if (changes.showModal?.currentValue) {
            this.showModal = changes.showModal.currentValue
        }
    }
    accionBtn(elemento): void {
        const { accion } = elemento
        const { item } = elemento

        switch (accion) {
            case 'close-modal':
                this.accionBtnItem.emit({ accion, item })
                break
        }
    }
}
