import { PrimengModule } from '@/app/primeng.module'
import { ModalPrimengComponent } from '@/app/shared/modal-primeng/modal-primeng.component'
import {
    Component,
    EventEmitter,
    Input,
    Output,
    OnChanges,
} from '@angular/core'

@Component({
    selector: 'app-form-grupo',
    standalone: true,
    imports: [ModalPrimengComponent, PrimengModule],
    templateUrl: './form-grupo.component.html',
    styleUrl: './form-grupo.component.scss',
})
export class FormGrupoComponent implements OnChanges {
    @Output() accionBtnItem = new EventEmitter()

    @Input() data = []
    @Input() showModal: boolean = true

    ngOnChanges(changes) {
        console.log(changes)
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
