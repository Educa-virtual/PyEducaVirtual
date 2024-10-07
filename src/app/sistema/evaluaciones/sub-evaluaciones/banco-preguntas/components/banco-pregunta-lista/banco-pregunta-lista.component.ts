import {
    IActionTable,
    IColumn,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'
import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Input, Output } from '@angular/core'
import { IPregunta } from '../../models/pregunta.model'
import { BancoPreguntaPreviewComponent } from '../banco-pregunta-preview/banco-pregunta-preview.component'

@Component({
    selector: 'app-banco-pregunta-lista',
    standalone: true,
    imports: [
        CommonModule,
        TablePrimengComponent,
        BancoPreguntaPreviewComponent,
    ],
    templateUrl: './banco-pregunta-lista.component.html',
    styleUrl: './banco-pregunta-lista.component.scss',
})
export class BancoPreguntaListaComponent {
    @Output() accionBtnItemTable = new EventEmitter()
    @Output() selectedRowDataChange = new EventEmitter()
    @Input() columnas: IColumn[] = []
    @Input() dataKey: string = 'iPreguntaId'

    @Input() data: IPregunta[] = []
    @Input() selectedRowData: IPregunta[] = []
    @Input() accionesTabla: IActionTable[]
    @Input() expandedRowKeys = {}
    @Input() showCaption: boolean = true

    onSelectionChange(event) {
        this.selectedRowData = event
        this.selectedRowDataChange.emit(event)
    }
}
