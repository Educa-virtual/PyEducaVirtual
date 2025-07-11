import {
    Component,
    ElementRef,
    EventEmitter,
    inject,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    ViewChild,
} from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { NgIf } from '@angular/common'
import { NoDataComponent } from '../no-data/no-data.component'
import { ConfirmationModalService } from '../confirm-modal/confirmation-modal.service'
@Component({
    selector: 'app-conf-horario',
    standalone: true,
    imports: [PrimengModule, NgIf, NoDataComponent],
    templateUrl: './conf-horario.component.html',
    styleUrls: ['./conf-horario.component.scss'],
})
export class ConfHorariosComponent implements OnChanges {
    @Output() accionBtnItem = new EventEmitter()

    @Input() cursos = []
    @Input() dias = []
    @Input() horario = []
    @Input() bloques: number = 0

    cursoSeleccionado

    @ViewChild('cursosContainer', { static: false })
    cursosContainer!: ElementRef

    private _ConfirmationModalService = inject(ConfirmationModalService)

    scrollCursos(direction: number): void {
        const container = this.cursosContainer.nativeElement
        const scrollAmount = 270
        container.scrollBy({
            left: scrollAmount * direction,
            behavior: 'smooth',
        })
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['cursos']) {
            this.cursos = changes['cursos'].currentValue
        }
        if (changes['dias']) {
            this.dias = changes['dias'].currentValue
        }
        if (changes['horario']) {
            this.horario = changes['horario'].currentValue
        }
        if (changes['bloques']) {
            this.bloques = changes['bloques'].currentValue
        }
    }
    getHorarioxiBloque(iBloque: number) {
        return this.horario.filter((horario) => horario.iBloque === iBloque)
    }

    agregarRemoverHorario(horario, accion) {
        if (!this.cursoSeleccionado) {
            this._ConfirmationModalService.openAlert({
                header: '¡Atención!, debe seleccionar un curso',
            })
            return
        }
        switch (accion) {
            case 'agregar-horario':
                horario.idDocCursoId = this.cursoSeleccionado.idDocCursoId
                break
            case 'remover-horario':
                horario.idDocCursoId = null
                break
        }
        this.accionBtn(accion, horario)
    }
    accionBtn(accion, item) {
        const data = {
            accion,
            item,
        }
        this.accionBtnItem.emit(data)
    }

    getRango(n: number): number[] {
        return Array.from({ length: n }, (_, i) => i + 1)
    }
}
