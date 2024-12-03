import { CommonModule } from '@angular/common'
import { Component, OnInit, Input, inject } from '@angular/core'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import {
    TablePrimengComponent,
    IColumn,
    IActionTable,
} from '@/app/shared/table-primeng/table-primeng.component'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import {
    matAccessTime,
    matCalendarMonth,
    matHideSource,
    matListAlt,
    matMessage,
    matRule,
    matStar,
} from '@ng-icons/material-icons/baseline'
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
import { TabViewModule } from 'primeng/tabview'
import { IconComponent } from '@/app/shared/icon/icon.component'
import { provideIcons } from '@ng-icons/core'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { OrderListModule } from 'primeng/orderlist'
import { PrimengModule } from '@/app/primeng.module'
import { ApiAulaService } from '@/app/sistema/aula-virtual/services/api-aula.service'
import { Message } from 'primeng/api'
import { Subject, takeUntil } from 'rxjs'
import { RemoveHTMLPipe } from '@/app/shared/pipes/remove-html.pipe'
import { CommonInputComponent } from '@/app/shared/components/common-input/common-input.component'
@Component({
    selector: 'app-tab-resultados',
    standalone: true,
    templateUrl: './tab-resultados.component.html',
    styleUrls: ['./tab-resultados.component.scss'],
    imports: [
        TablePrimengComponent,
        RemoveHTMLPipe,
        TabViewModule,
        TableModule,
        CommonInputComponent,
        IconComponent,
        DataViewModule,
        OrderListModule,
        InputIconModule,
        PrimengModule,
        IconFieldModule,
        ContainerPageComponent,
        InputTextModule,
        DropdownModule,
        InputGroupModule,
        InputGroupAddonModule,
        CommonModule,
    ],
    providers: [
        provideIcons({
            matHideSource,
            matCalendarMonth,
            matMessage,
            matStar,
            matRule,
            matListAlt,
            matAccessTime,
        }),
    ],
})
export class TabResultadosComponent implements OnInit {
    @Input() ixActivadadId: string
    @Input() iActTopId: tipoActividadesKeys

    private GeneralService = inject(GeneralService)
    private _formBuilder = inject(FormBuilder)
    private _aulaService = inject(ApiAulaService)
    // private ref = inject(DynamicDialogRef)
    private _constantesService = inject(ConstantesService)
    estudiantes: any[] = []
    estudianteEv: any[] = []
    calificacion: any[] = []
    //------
    estudianteSeleccionado: any
    resultadosEstudiantes: any
    //-------
    iEstudianteId: number
    estudianteSelect = null
    public comentariosSelect
    messages: Message[] | undefined
    private unsbscribe$ = new Subject<boolean>()

    idcurso: number
    mostrarDiv: boolean = false // Variable para controlar la visibilidad

    califcnFinal: any[] = []
    public califcFinal: FormGroup = this._formBuilder.group({
        cDetMatrConclusionDesc1: ['', [Validators.required]],
        iEscalaCalifIdPeriodo1: [],
    })
    //Campos de la tabla para mostrar notas
    public columnasTabla: IColumn[] = [
        {
            type: 'item',
            width: '0.5rem',
            field: 'index',
            header: 'Nro',
            text_header: 'center',
            text: 'center',
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
            header: 'Promedio',
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
            header: 'Conclusión descriptiva',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'actions',
            width: '1rem',
            field: '',
            header: 'Acciones',
            text_header: 'left',
            text: 'left',
        },
    ]
    public accionesTabla: IActionTable[] = [
        {
            labelTooltip: 'Eliminar',
            icon: 'pi pi-trash',
            accion: 'eliminar',
            type: 'item',
            class: 'p-button-rounded p-button-danger p-button-text',
        },
        {
            labelTooltip: 'Editar',
            icon: 'pi pi-pencil',
            accion: 'editar',
            type: 'item',
            class: 'p-button-rounded p-button-warning p-button-text',
        },
    ]
    // Inicializamos
    ngOnInit() {
        this.verperfiles()
        this.getEstudiantesMatricula()
        this.mostrarCalificacion()
    }
    // ver que id nos llegan(borrar):
    verperfiles() {
        this.iEstudianteId = this._constantesService.iEstudianteId
        this.idcurso = this._constantesService.iYAcadId
        console.log('ver datos', this.idcurso)
    }
    obtenerComnt(estudiantes) {
        this.mostrarDiv = !this.mostrarDiv // Cambia el estado de visibilida
        this.estudianteEv = estudiantes.nombrecompleto
        this.estudianteSeleccionado = estudiantes
        this._aulaService
            .obtenerResultados({
                iEstudianteId: estudiantes.iEstudianteId,
                idDocCursoId: estudiantes.iCursoId,
            })
            .pipe(takeUntil(this.unsbscribe$))
            .subscribe({
                next: (resp) => {
                    this.messages = [
                        {
                            severity: 'info',
                            detail: resp?.iEscalaCalifId,
                        },
                    ]
                    this.comentariosSelect = resp
                    console.log('obtener comentarior', resp)
                },
            })
    }
    guardarCalifcFinal() {
        const resultadosEstudiantesf = this.califcFinal.value
        const datos = JSON.stringify({
            estudianteS: this.estudianteSeleccionado,
            estudianteF: resultadosEstudiantesf,
        })
        this._aulaService.guardarCalificacionEstudiante(datos).subscribe({
            next: (resp) => {
                this.messages = [
                    {
                        severity: 'info',
                        //detail: resp?.iEscalaCalifId,
                    },
                ]
                this.comentariosSelect = resp
                console.log('obtener comentarior', resp)
            },
        })
        console.log('Enviar datos a matriz detalle', datos)
    }
    mostrarCalificacion() {
        const userId = 1
        this._aulaService.obtenerCalificacion(userId).subscribe((Data) => {
            this.calificacion = Data['data']
            //console.log('Mostrar escala',this.calificacion)
        })
    }
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
