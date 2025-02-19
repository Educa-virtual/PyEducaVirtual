import { PrimengModule } from '@/app/primeng.module'
import { ModalPrimengComponent } from '@/app/shared/modal-primeng/modal-primeng.component'
import { Component, EventEmitter, Input, Output } from '@angular/core'

@Component({
    selector: 'app-form-importar-banco-preguntas',
    standalone: true,
    imports: [ModalPrimengComponent, PrimengModule],
    templateUrl: './form-importar-banco-preguntas.component.html',
    styleUrl: './form-importar-banco-preguntas.component.scss',
})
export class FormImportarBancoPreguntasComponent {
    @Output() accionBtnItem = new EventEmitter()
    @Input() showModal: boolean = false

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
