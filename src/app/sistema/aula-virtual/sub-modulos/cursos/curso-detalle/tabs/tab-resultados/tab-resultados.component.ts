import { CommonModule } from '@angular/common'
import { Component, OnInit, Input, inject } from '@angular/core'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import {
    TablePrimengComponent,
    IColumn,
} from '@/app/shared/table-primeng/table-primeng.component'
import { DataViewModule } from 'primeng/dataview'
import { IconFieldModule } from 'primeng/iconfield'
import { InputIconModule } from 'primeng/inputicon'
import { InputTextModule } from 'primeng/inputtext'
import { DropdownModule } from 'primeng/dropdown'
import { InputGroupModule } from 'primeng/inputgroup'
import { InputGroupAddonModule } from 'primeng/inputgroupaddon'
import { TableModule } from 'primeng/table'
import { tipoActividadesKeys } from '@/app/sistema/aula-virtual/interfaces/actividad.interface'
import { GeneralService } from '@/app/servicios/general.service'
// import { FormBuilder, FormGroup, Validators } from '@angular/forms'
// import { ApiAulaService } from '@/app/sistema/aula-virtual/services/api-aula.service'
import { ConstantesService } from '@/app/servicios/constantes.service'
@Component({
    selector: 'app-tab-resultados',
    standalone: true,
    templateUrl: './tab-resultados.component.html',
    styleUrls: ['./tab-resultados.component.scss'],
    imports: [
        TablePrimengComponent,
        TableModule,
        DataViewModule,
        InputIconModule,
        IconFieldModule,
        ContainerPageComponent,
        InputTextModule,
        DropdownModule,
        InputGroupModule,
        InputGroupAddonModule,
        CommonModule,
    ],
})
export class TabResultadosComponent implements OnInit {
    @Input() ixActivadadId: string
    @Input() iActTopId: tipoActividadesKeys

    private GeneralService = inject(GeneralService)
    // private _formBuilder = inject(FormBuilder)
    // private _aulaService = inject(ApiAulaService)
    // private ref = inject(DynamicDialogRef)
    private _constantesService = inject(ConstantesService)

    idcurso: number

    //Campos de la tabla para mostrar notas
    public columnasTabla: IColumn[] = [
        {
            type: 'item',
            width: '5rem',
            field: 'index',
            header: 'Nro',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '10rem',
            field: 'nombrecompleto',
            header: 'Nombre estudiante',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '10rem',
            field: '',
            header: 'Nt. tarea',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '10rem',
            field: '',
            header: 'Nt. Evaluación',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '10rem',
            field: '',
            header: 'Nt. Foro',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '10rem',
            field: '',
            header: 'Promedio',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '10rem',
            field: '',
            header: 'Nt. tarea',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '10rem',
            field: '',
            header: 'Nt. Evaluación',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '10rem',
            field: '',
            header: 'Nt. Foro',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '10rem',
            field: '',
            header: 'Promedio',
            text_header: 'left',
            text: 'left',
        },
        // {
        //     type: 'actions',
        //     width: '1rem',
        //     field: '',
        //     header: 'Acciones',
        //     text_header: 'left',
        //     text: 'left',
        // },
    ]
    // [actions]="accionesTabla"
    //  public accionesTabla: IActionTable[] = [
    //     {
    //         labelTooltip: 'Eliminar',
    //         icon: 'pi pi-trash',
    //         accion: 'eliminar',
    //         type: 'item',
    //         class: 'p-button-rounded p-button-danger p-button-text',
    //     },
    //     {
    //         labelTooltip: 'Editar',
    //         icon: 'pi pi-pencil',
    //         accion: 'editar',
    //         type: 'item',
    //         class: 'p-button-rounded p-button-warning p-button-text',
    //     },
    // ]
    estudiantes: any[] = []
    // Inicializamos
    ngOnInit() {
        this.obtenerEstudiantesM()
        this.verperfiles()
        this.getEstudiantesMatricula()
    }
    // ver que id nos llegan(borrar):

    verperfiles() {
        this.idcurso = this._constantesService.iYAcadId
        console.log('ver datos', this.idcurso)
    }
    obtenerEstudiantesM() {}
    getInformation(params) {
        this.GeneralService.getGralPrefix(params).subscribe({
            next: (response) => {
                this.estudiantes = response.data
                console.log('lista de estudiante', this.estudiantes)
            },
            complete: () => {},
            error: (error) => {
                console.log(error)
            },
        })
    }

    getEstudiantesMatricula() {
        const params = {
            petition: 'post',
            group: 'aula-virtual',
            prefix: 'matricula',
            ruta: 'list',
            data: {
                opcion: 'CONSULTAR-ESTUDIANTESxiSemAcadIdxiYAcadIdxiCurrId',
                iSemAcadId:
                    '2jdp2ERVe0QYG8agql5J1ybONbOMzW93KvLNZ7okAmD4xXBrwe',
                iYAcadId: '2jdp2ERVe0QYG8agql5J1ybONbOMzW93KvLNZ7okAmD4xXBrwe',
                iCurrId: '2jdp2ERVe0QYG8agql5J1ybONbOMzW93KvLNZ7okAmD4xXBrwe',
            },
            params: { skipSuccessMessage: true },
        }

        this.getInformation(params)
    }
}
