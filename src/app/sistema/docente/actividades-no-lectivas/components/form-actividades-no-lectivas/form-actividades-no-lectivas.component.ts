import { PrimengModule } from '@/app/primeng.module'
import { ModalPrimengComponent } from '@/app/shared/modal-primeng/modal-primeng.component'
import { Component, EventEmitter, Input, Output } from '@angular/core'

@Component({
    selector: 'app-form-actividades-no-lectivas',
    standalone: true,
    imports: [ModalPrimengComponent, PrimengModule],
    templateUrl: './form-actividades-no-lectivas.component.html',
    styleUrl: './form-actividades-no-lectivas.component.scss',
})
export class FormActividadesNoLectivasComponent {
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
