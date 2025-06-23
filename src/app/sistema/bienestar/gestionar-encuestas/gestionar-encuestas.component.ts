import { PrimengModule } from '@/app/primeng.module'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import {
    IActionTable,
    IColumn,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { ButtonModule } from 'primeng/button'
import { InputGroupModule } from 'primeng/inputgroup'
import { InputTextModule } from 'primeng/inputtext'
import { PanelModule } from 'primeng/panel'
import { EncuestaComponent } from '../encuesta/encuesta.component'
import { DatosEncuestaService } from '../services/datos-encuesta.service'
import { MessageService } from 'primeng/api'

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
    @ViewChild('filtro') filtro: ElementRef
    encuestas: Array<object> = []
    encuestas_filtradas: Array<object> = []
    searchForm: FormGroup
    categorias: Array<object>
    dialog_visible: boolean = false
    dialog_header: string = 'Registrar encuesta'
    perfil: any
    iYAcadId: number

    private _messageService = inject(MessageService)

    constructor(
        private fb: FormBuilder,
        private store: LocalStoreService,
        private datosEncuestas: DatosEncuestaService
    ) {
        this.perfil = this.store.getItem('dremoPerfil')
        this.iYAcadId = this.store.getItem('dremoiYAcadId')
    }

    ngOnInit(): void {
        this.datosEncuestas.getEncuestaParametros().subscribe((data: any) => {
            this.categorias = this.datosEncuestas.getCategorias(
                data?.categorias
            )
        })

        this.listarEncuestas()
    }

    agregarEncuesta() {
        this.dialog_header = 'Registrar Encuesta'
        this.dialog_visible = true
    }

    listarEncuestas() {
        this.datosEncuestas
            .listarEncuestas({
                iCredEntPerfId: this.perfil.iCredEntPerfId,
                iYAcadId: this.iYAcadId,
            })
            .subscribe({
                next: (data: any) => {
                    this.encuestas = data.data
                    this.encuestas_filtradas = this.encuestas
                },
                error: (error) => {
                    console.error('Error obteniendo encuestas:', error)
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.error.message,
                    })
                },
            })
    }

    dialogVisible(event: any) {
        return this.dialog_visible == event.value
    }

    filtrarEncuestas() {
        const filtro = this.filtro.nativeElement.value
        this.encuestas_filtradas = this.encuestas.filter((encuesta: any) => {
            if (
                encuesta.cEncuNombre
                    .toLowerCase()
                    .includes(filtro.toLowerCase())
            )
                return encuesta
            if (
                encuesta.cEncuDescripcion
                    .toLowerCase()
                    .includes(filtro.toLowerCase())
            )
                return encuesta
            if (
                encuesta.cEncuCateNombre
                    .toLowerCase()
                    .includes(filtro.toLowerCase())
            )
                return encuesta
            if (
                encuesta.dEncuDesde.toLowerCase().includes(filtro.toLowerCase())
            )
                return encuesta
            if (
                encuesta.dEncuHasta.toLowerCase().includes(filtro.toLowerCase())
            )
                return encuesta
            return null
        })
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
            field: 'dEncuDesde',
            type: 'date',
            width: '10%',
            header: 'Desde',
            text_header: 'center',
            text: 'center',
        },
        {
            field: 'dEncuHasta',
            type: 'date',
            width: '10%',
            header: 'Hasta',
            text_header: 'center',
            text: 'center',
        },
        {
            field: 'cEncuCateNombre',
            type: 'text',
            width: '20%',
            header: 'Categoría',
            text_header: 'center',
            text: 'center',
        },
        {
            field: 'cEncuNombre',
            type: 'text',
            width: '30%',
            header: 'Encuesta',
            text_header: 'left',
            text: 'left',
        },
        {
            field: 'iRptaCount',
            type: 'text',
            width: '10%',
            header: 'Respuestas',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'actions',
            width: '20%',
            field: '',
            header: 'Acciones',
            text_header: 'right',
            text: 'right',
        },
    ]

    public accionesTabla: IActionTable[] = [
        {
            labelTooltip: 'Editar',
            icon: 'pi pi-file-edit',
            accion: 'editar',
            type: 'item',
            class: 'p-button-rounded p-button-success p-button-text',
        },
        {
            labelTooltip: 'Editar Preguntas',
            icon: 'pi pi-list-check',
            accion: 'estado',
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
    ]
}
