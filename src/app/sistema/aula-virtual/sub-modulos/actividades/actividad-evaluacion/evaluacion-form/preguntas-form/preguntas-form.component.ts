import {
    Component,
    EventEmitter,
    Input,
    Output,
    OnChanges,
} from '@angular/core'
import { ModalPrimengComponent } from '../../../../../../../shared/modal-primeng/modal-primeng.component'
import { PrimengModule } from '@/app/primeng.module'

@Component({
    selector: 'app-preguntas-form',
    standalone: true,
    imports: [ModalPrimengComponent, PrimengModule],
    templateUrl: './preguntas-form.component.html',
    styleUrl: './preguntas-form.component.scss',
})
export class PreguntasFormComponent implements OnChanges {
    @Output() accionBtnItem = new EventEmitter()

    @Input() showModalPreguntas

    ngOnChanges(changes) {
        if (changes.showModalPreguntas?.currentValue) {
            this.showModalPreguntas = changes.showModalPreguntas.currentValue
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

    tipoPreguntas = [
        {
            iTipoPreguntaId: 1,
            cTipoPregunta: 'Opción única',
        },
        {
            iTipoPreguntaId: 2,
            cTipoPregunta: 'Opción múltiple',
        },
        {
            iTipoPreguntaId: 3,
            cTipoPregunta: 'Opción libre',
        },
    ]

    iTipoPreguntaId = 0
}
