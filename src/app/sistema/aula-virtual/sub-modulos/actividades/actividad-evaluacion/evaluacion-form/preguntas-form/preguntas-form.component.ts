import {
    Component,
    EventEmitter,
    Input,
    Output,
    OnChanges,
} from '@angular/core'
import { ModalPrimengComponent } from '../../../../../../../shared/modal-primeng/modal-primeng.component'
import { PrimengModule } from '@/app/primeng.module'
import { NgIf } from '@angular/common'

@Component({
    selector: 'app-preguntas-form',
    standalone: true,
    imports: [ModalPrimengComponent, PrimengModule, NgIf],
    templateUrl: './preguntas-form.component.html',
    styleUrl: './preguntas-form.component.scss',
})
export class PreguntasFormComponent implements OnChanges {
    @Output() accionBtnItem = new EventEmitter()

    @Input() showModalPreguntas
    @Input() showEncabezado
    @Input() cEvaluacionTitulo: string

    ngOnChanges(changes) {
        if (changes.showModalPreguntas?.currentValue) {
            this.showModalPreguntas = changes.showModalPreguntas.currentValue
        }
        if (changes.showEncabezado?.currentValue) {
            this.showEncabezado = changes.showEncabezado.currentValue
        }
    }

    accionBtn(elemento): void {
        const { accion } = elemento
        const { item } = elemento

        switch (accion) {
            case 'close-modal':
                this.accionBtnItem.emit({
                    accion: 'close-modal-preguntas-form',
                    item,
                })
                break
            case 'guardar-pregunta':
                item.iTipoPregId = this.iTipoPreguntaId
                item.iPreguntaPeso = this.iPeso
                item.cPreguntaTextoAyuda = this.cTextoAyuda
                item.cPregunta = this.cPregunta
                item.Alternativas = this.alternativas
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
    preguntas = []
    alternativas = []
    cAlternativa: string
    cPregunta: string
    bRptaCorreta: boolean = false

    iPeso
    cTextoAyuda

    agregarAlternativa() {
        this.alternativas.push({
            isLocal: false,
            cAlternativa: this.cAlternativa,
            bRptaCorreta: this.bRptaCorreta,
        })
        this.cAlternativa = ''
        this.bRptaCorreta = false
    }
}
