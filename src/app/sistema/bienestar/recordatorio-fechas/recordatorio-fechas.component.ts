import { Component } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import {
    IActionTable,
    IColumn,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { ButtonModule } from 'primeng/button'
import { InputGroupModule } from 'primeng/inputgroup'
import { InputTextModule } from 'primeng/inputtext'
import { PanelModule } from 'primeng/panel'

@Component({
    selector: 'app-recordatorio-fechas',
    standalone: true,
    imports: [
        TablePrimengComponent,
        ReactiveFormsModule,
        ButtonModule,
        PanelModule,
        InputTextModule,
        InputGroupModule,
        PrimengModule,
    ],
    templateUrl: './recordatorio-fechas.component.html',
    styleUrl: './recordatorio-fechas.component.scss',
})
export class RecordatorioFechasComponent {
    searchForm: FormGroup
    notificaciones: Array<object>
    dias_restantes: Array<object>
    notificar: string[] = []
    dialog_visible: boolean = false
    dialog_header: string = 'Registrar encuesta'

    constructor(
        private fb: FormBuilder,
        private store: LocalStoreService
    ) {}

    ngOnInit(): void {
        this.searchForm = this.fb.group({
            // cEncuestaNombre: [''],
            // iCategoriaEncuestaId: [null],
        })

        this.dias_restantes = [
            { label: '01 dia', value: 1 },
            { label: '01 semana', value: 2 },
            { label: '01 mes', value: 3 },
        ]
    }

    accionBnt(event: { accion: string }): void {
        switch (event.accion) {
            case 'editar':
                console.log('Editar seleccionado')
                break
            case 'eliminar':
                console.log('Eliminar seleccionado')
                break
            case 'estado':
                console.log('Cambiar estado seleccionado')
                break
            default:
                console.warn('Acción no reconocida:', event.accion)
        }
    }

    public columnasTabla: IColumn[] = [
        {
            field: 'text',
            type: 'text',
            width: '10%',
            header: 'Fecha',
            text_header: 'center',
            text: 'center',
        },
        {
            field: 'cCategoriaNombre',
            type: 'text',
            width: '15%',
            header: 'Apellidos y Nombres',
            text_header: 'Nombres',
            text: 'Nombres',
        },
        {
            field: 'cEncuestaNombre',
            type: 'text',
            width: '50%',
            header: 'Tipo relacion',
            text_header: 'left',
            text: 'left',
        },
        {
            field: 'iCantRespuestas',
            type: 'text',
            width: '15%',
            header: 'Dias Faltantes',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'actions',
            width: '10%',
            field: '',
            header: 'Acciones',
            text_header: 'right',
            text: 'right',
        },
    ]

    public accionesTabla: IActionTable[] = [
        {
            labelTooltip: 'Editar',
            icon: 'pi pi-print',
            accion: 'editar',
            type: 'item',
            class: 'p-button-rounded p-button-success p-button-text',
        },
        {
            labelTooltip: 'Cambiar estado',
            icon: 'pi pi-file-edit',
            accion: 'estado',
            type: 'item',
            class: 'p-button-rounded p-button-warning p-button-text',
        },
        {
            labelTooltip: 'Eliminar',
            icon: 'pi pi-undo',
            accion: 'eliminar',
            type: 'item',
            class: 'p-button-rounded p-button-danger p-button-text',
        },
    ]
}
