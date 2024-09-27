import {
    IActionTable,
    IColumn,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'
import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Input, Output } from '@angular/core'

@Component({
    selector: 'app-encabezados-preguntas',
    standalone: true,
    imports: [CommonModule, TablePrimengComponent],
    templateUrl: './encabezados-preguntas.component.html',
    styleUrl: './encabezados-preguntas.component.scss',
})
export class EncabezadosPreguntasComponent {
    @Input() encabezados
    @Input() encabezado
    @Output() encabezadoChange = new EventEmitter()

    public columnas: IColumn[] = [
        {
            field: '',
            header: '',
            type: 'radio',
            width: '2rem',
            text: 'left',
            text_header: 'Título',
        },
        {
            field: 'cEncabPregTitulo',
            header: 'Titúlo',
            type: 'text',
            width: '5rem',
            text: 'left',
            text_header: 'Título',
        },
        {
            field: 'cEncabPregContenido',
            header: 'Contenido',
            type: 'p-editor',
            width: '10rem',
            text: 'left',
            text_header: 'Puntaje',
        },
        {
            field: '',
            header: 'Acciones',
            type: 'actions',
            width: '5rem',
            text: 'left',
            text_header: '',
        },
    ]
    public accionesTabla: IActionTable[] = [
        {
            accion: 'editar',
            labelTooltip: 'Editar',
            icon: 'pi pi-pencil',
            type: 'item',
            class: 'p-button-rounded p-button-warning p-button-text',
        },
        {
            accion: 'eliminar',
            labelTooltip: 'Eliminar',
            icon: 'pi pi-trash',
            type: 'item',
            class: 'p-button-rounded p-button-danger p-button-text',
        },
    ]

    public accionBtnItemTable({ accion, item }) {
        console.log(accion, item)
    }

    public onSelectionChange(event) {
        this.encabezadoChange.emit(event)
    }
}
