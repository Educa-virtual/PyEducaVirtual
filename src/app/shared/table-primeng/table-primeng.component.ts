import { PrimengModule } from '@/app/primeng.module'
import {
    Component,
    Output,
    EventEmitter,
    Input,
    OnChanges,
} from '@angular/core'

@Component({
    selector: 'app-table-primeng',
    templateUrl: './table-primeng.component.html',
    styleUrls: ['./table-primeng.component.scss'],
    standalone: true,
    imports: [PrimengModule],
})
export class TablePrimengComponent implements OnChanges {
    @Output() accionBtnItem = new EventEmitter()

    @Input() data = [
        {
            cActividad1: 'cActividad1',
            cActividad2: 'cActividad2',
            cActividad3: 'cActividad3',
        },
        {
            cActividad1: 'cActividad1',
            cActividad2: 'cActividad2',
            cActividad3: 'cActividad3',
        },
    ]
    @Input() columnas = [
        {
            type: 'text',
            width: '5rem',
            field: 'cActividad1',
            header: 'Actividad1',
            text_header: 'center',
            text: 'justify',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cActividad2',
            header: 'Actividad2',
            text_header: 'center',
            text: 'justify',
        },
        {
            type: 'text',
            width: '20rem',
            field: 'cActividad3',
            header: 'Actividad3',
            text_header: 'center',
            text: 'justify',
        },
        {
            type: 'actions',
            width: '3rem',
            field: 'actions',
            header: 'Acciones',
            text_header: 'center',
            text: 'center',
        },
    ]

    @Input() actions = [
        {
            labelTooltip: 'Agregar',
            icon: 'pi pi-plus',
            accion: 'agregar',
            type: 'item',
            class: 'p-button-rounded p-button-primary',
        },
        {
            labelTooltip: 'Agregar',
            icon: 'pi pi-plus',
            accion: 'agregar',
            type: 'item',
            class: 'p-button-rounded p-button-danger',
        },
        {
            labelTooltip: 'Agregar',
            icon: 'pi pi-plus',
            accion: 'agregar',
            type: 'item',
            class: 'p-button-rounded p-button-success',
        },
    ]

    @Input() subactions = [
        {
            labelTooltip: 'Agregar',
            icon: 'pi pi-plus',
            accion: 'agregar',
            type: 'item',
            sub: [],
        },
        {
            labelTooltip: 'Agregar',
            icon: 'pi pi-plus',
            accion: 'agregar',
            type: 'item',
            sub: [],
        },
        {
            labelTooltip: 'Agregar',
            icon: 'pi pi-plus',
            accion: 'agregar',
            type: 'item',
            sub: [],
        },
        {
            labelTooltip: 'Agregar',
            icon: 'pi pi-plus',
            accion: 'agregar',
            type: 'dropdown',
            sub: [
                {
                    labelTooltip: 'Agregar',
                    icon: 'add',
                    accion: 'agregar',
                    color: 'primary',
                    type: 'link',
                },
            ],
        },
    ]

    loading: boolean = false

    constructor() {}

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