import { PrimengModule } from '@/app/primeng.module'
import { ModalPrimengComponent } from '@/app/shared/modal-primeng/modal-primeng.component'
import { Component, EventEmitter, Input, Output } from '@angular/core'

@Component({
    selector: 'app-form-material-educativo',
    standalone: true,
    imports: [PrimengModule, ModalPrimengComponent],
    templateUrl: './form-material-educativo.component.html',
    styleUrl: './form-material-educativo.component.scss',
})
export class FormMaterialEducativoComponent {
    @Output() accionBtnItem = new EventEmitter()

    @Input() showModal: boolean = true

    date = new Date()
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
