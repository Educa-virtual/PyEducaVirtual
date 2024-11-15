import {
    Component,
    EventEmitter,
    Input,
    Output,
    OnChanges,
} from '@angular/core'
import { ModalPrimengComponent } from '../../../../shared/modal-primeng/modal-primeng.component'
import { PrimengModule } from '@/app/primeng.module'

@Component({
    selector: 'app-reporte-asistencia',
    standalone: true,
    imports: [ModalPrimengComponent, PrimengModule],
    templateUrl: './reporte-asistencia.component.html',
    styleUrl: './reporte-asistencia.component.scss',
})
export class ReporteAsistenciaComponent implements OnChanges {
    @Output() accionBtnItem = new EventEmitter()

    @Input() showModal: boolean = true
    @Input() cCursoNombre: string = ''

    ngOnChanges(changes) {
        if (changes.showModal?.currentValue) {
            this.showModal = changes.showModal.currentValue
        }
        if (changes.cCursoNombre?.currentValue) {
            this.cCursoNombre = changes.cCursoNombre.currentValue
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
    tipoReporte: number
    solicitarFecha: number
}
