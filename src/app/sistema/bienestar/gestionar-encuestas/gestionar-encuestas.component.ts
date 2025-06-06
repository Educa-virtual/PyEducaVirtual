import { PrimengModule } from '@/app/primeng.module'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import {
    IActionTable,
    IColumn,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'
import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { ButtonModule } from 'primeng/button'
import { InputGroupModule } from 'primeng/inputgroup'
import { InputTextModule } from 'primeng/inputtext'
import { PanelModule } from 'primeng/panel'
import { EncuestaComponent } from '../encuesta/encuesta.component'

@Component({
    selector: 'app-gestionar-encuestas',
    standalone: true,
    imports: [
        TablePrimengComponent,
        ReactiveFormsModule,
        ButtonModule,
        PanelModule,
        InputTextModule,
        InputGroupModule,
        PrimengModule,
        EncuestaComponent,
    ],
    templateUrl: './gestionar-encuestas.component.html',
    styleUrl: './gestionar-encuestas.component.scss',
})
export class GestionarEncuestasComponent implements OnInit {
    encuestas: Array<object> = []
    searchForm: FormGroup
    categorias: Array<object>
    dialog_visible: boolean = false
    dialog_header: string = 'Registrar Notificacion'

    constructor(
        private fb: FormBuilder,
        private store: LocalStoreService
    ) {}

    ngOnInit(): void {
        this.searchForm = this.fb.group({
            cEncuestaNombre: [''],
            iCategoriaEncuestaId: [null],
        })

        this.categorias = [
            { label: 'Socioeconómica', value: 1 },
            { label: 'Psicosocial', value: 2 },
            { label: 'Vocacional', value: 3 },
            { label: 'Vida estudiantil', value: 4 },
        ]
    }

    verEncuesta() {
        this.dialog_header = 'Registrar sugerencia'
        this.dialog_visible = true
    }

    dialogVisible(event: any) {
        return (this.dialog_visible = event.value)
    }

    //---Filtrado de estudiantes--------------
    filtrarEstudiantes() {}

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
            header: 'Categoría',
            text_header: 'Nombres',
            text: 'Nombres',
        },
        {
            field: 'cEncuestaNombre',
            type: 'text',
            width: '50%',
            header: 'Encuesta',
            text_header: 'left',
            text: 'left',
        },
        {
            field: 'iCantRespuestas',
            type: 'text',
            width: '15%',
            header: 'Respuestas',
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
