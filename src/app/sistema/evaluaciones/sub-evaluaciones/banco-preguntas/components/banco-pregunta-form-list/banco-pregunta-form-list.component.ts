import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Input, Output } from '@angular/core'
import {
    IActionTable,
    IColumn,
    TablePrimengComponent,
} from '../../../../../../shared/table-primeng/table-primeng.component'
import { provideIcons } from '@ng-icons/core'
import { matListAlt } from '@ng-icons/material-icons/baseline'

@Component({
    selector: 'app-banco-pregunta-form-list',
    standalone: true,
    imports: [CommonModule, TablePrimengComponent],
    templateUrl: './banco-pregunta-form-list.component.html',
    styleUrl: './banco-pregunta-form-list.component.scss',
    providers: [provideIcons({ matListAlt })],
})
export class BancoPreguntaFormListComponent {
    @Input() preguntas = []
    @Output() accionBtnItemTableChange = new EventEmitter()

    public columns: IColumn[] = [
        {
            type: 'p-editor',
            width: '8rem',
            field: 'cPregunta',
            header: 'Pregunta Título',
            text_header: 'Pregunta Título',
            text: 'left',
        },
        {
            field: '',
            header: 'Acciones',
            type: 'actions',
            width: '3rem',
            text: 'left',
            text_header: '',
        },
    ]

    public accionesTabla: IActionTable[] = [
        {
            labelTooltip: 'Editar',
            icon: 'pi pi-pencil',
            accion: 'editar',
            type: 'item',
            class: 'p-button-rounded p-button-warning p-button-text',
        },
        {
            labelTooltip: 'Eliminar',
            icon: 'pi pi-trash',
            accion: 'eliminar',
            type: 'item',
            class: 'p-button-rounded p-button-danger p-button-text',
        },
        {
            labelTooltip: 'Agregar Alternativas',
            icon: {
                name: 'matListAlt',
                size: 'xs',
            },
            accion: 'alternativas',
            type: 'item',
            class: 'p-button-rounded p-button-primary p-button-text',
        },
    ]

    public accionBtnItemTable(event) {
        this.accionBtnItemTableChange.emit(event)
    }
}
