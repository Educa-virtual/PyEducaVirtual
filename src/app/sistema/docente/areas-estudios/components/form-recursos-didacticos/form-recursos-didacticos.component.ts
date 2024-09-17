import { PrimengModule } from '@/app/primeng.module'
import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
} from '@angular/core'

@Component({
    selector: 'app-form-recursos-didacticos',
    standalone: true,
    imports: [PrimengModule],
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

    accionBtn(accion, item) {
        const data = {
            accion,
            item,
        }
        this.accionBtnItem.emit(data)
    }
}
