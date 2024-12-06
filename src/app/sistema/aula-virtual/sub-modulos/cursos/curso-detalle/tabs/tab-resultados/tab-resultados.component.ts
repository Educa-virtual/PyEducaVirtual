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
//import { ConstantesService } from '@/app/servicios/constantes.service'
import { OrderListModule } from 'primeng/orderlist'
import { PrimengModule } from '@/app/primeng.module'
import { ApiAulaService } from '@/app/sistema/aula-virtual/services/api-aula.service'
import { Message } from 'primeng/api'
import { Subject, takeUntil } from 'rxjs'
import { RemoveHTMLPipe } from '@/app/shared/pipes/remove-html.pipe'
import { CommonInputComponent } from '@/app/shared/components/common-input/common-input.component'
import { ButtonModule } from 'primeng/button'
@Component({
    selector: 'app-tab-resultados',
    standalone: true,
    templateUrl: './tab-resultados.component.html',
    styleUrls: ['./tab-resultados.component.scss'],
    imports: [
        TablePrimengComponent,
        ButtonModule,
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
    //private _constantesService = inject(ConstantesService)
    estudiantes: any[] = []
    reporteDeNotas: any[] = []
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
    tabla: string
    campos: string
    where: number
    private unsbscribe$ = new Subject<boolean>()
    unidad: string = '1'

    idcurso: number
    mostrarDiv: boolean = false // Variable para controlar la visibilidad

    califcnFinal: any[] = []
    public califcFinal: FormGroup = this._formBuilder.group({
        cDetMatrConclusionDesc1: ['', [Validators.required]],
        iEscalaCalifIdPeriodo1: ['', [Validators.required]],
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
        //this.verperfiles()
        this.getEstudiantesMatricula()
        this.mostrarCalificacion()
        this.obtenerReporteDenotasFinales()
        //this.selectUnidad()
    }
    // Obtenemos los datos de estudiante que el docente hico su retroalimentación por alumno
    obtenerComnt(estudiantes) {
        //this.mostrarDiv = !this.mostrarDiv // Cambia el estado de visibilida
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
    //un load para el boton guardar
    loading: boolean = false
    load() {
        this.loading = true

        setTimeout(() => {
            this.loading = false
        }, 2000)
    }
    // metodo para limpiar las etiquestas
    limpiarHTML(html: string): string {
        const temporal = document.createElement('div') // Crear un div temporal
        temporal.innerHTML = html // Insertar el HTML
        return temporal.textContent || '' // Obtener solo el texto
    }
    //metodo para obtener el id de la unidad al seleccionar
    selectUnidad(event: Event): void {
        const buttonValue = (event.target as HTMLButtonElement).value
        this.unidad = buttonValue
    }
    // en desarrollo
    obtenerReporteDenotasFinales() {
        //this.loaderService.show(); // Muestra el loader
        this.GeneralService.getDatos(
            this.tabla,
            this.campos,
            this.where
        ).subscribe({
            next: (response) => {
                this.reporteDeNotas = response
                console.log('Detalle Notas', this.reporteDeNotas)
            },
            error: (error) => {
                console.error('Error al obtener notas finales:', error)
            },
        })
    }
    //guardar la calificación y conclusión descriptiva del docente para los promedios finales
    guardaCalificacionFinalUnidad() {
        const resultadosEstudiantesf = this.califcFinal.value
        const descripcionlimpia = resultadosEstudiantesf.cDetMatrConclusionDesc1
        const conclusionFinalDocente = this.limpiarHTML(descripcionlimpia)
        const where = [
            {
                COLUMN_NAME: 'iDetMatrId',
                VALUE: this.estudianteSeleccionado.iDetMatrId,
            },
        ]
        const registro: any = {}

        switch (this.unidad) {
            case '1':
                registro.cDetMatrConclusionDesc1 = conclusionFinalDocente
                registro.iEscalaCalifIdPeriodo1 =
                    resultadosEstudiantesf.iEscalaCalifIdPeriodo1
                registro.dtDetMatrPeriodo1 = '2024/12/5'
                break
            case '2':
                registro.cDetMatrConclusionDesc2 = conclusionFinalDocente
                registro.iEscalaCalifIdPeriodo2 =
                    resultadosEstudiantesf.iEscalaCalifIdPeriodo1
                registro.dtDetMatrPeriodo2 = '2024/12/5'
                break
            case '3':
                registro.cDetMatrConclusionDesc3 = conclusionFinalDocente
                registro.iEscalaCalifIdPeriodo3 =
                    resultadosEstudiantesf.iEscalaCalifIdPeriodo1
                registro.dtDetMatrPeriodo3 = '2024/12/5'
                break
            case '4':
                registro.cDetMatrConclusionDesc4 = conclusionFinalDocente
                registro.iEscalaCalifIdPeriodo4 =
                    resultadosEstudiantesf.iEscalaCalifIdPeriodo1
                registro.dtDetMatrPeriodo4 = '2024/12/5'
                break
            case '5':
                registro.iEscalaCalifIdRecuperacion =
                    resultadosEstudiantesf.iEscalaCalifIdPeriodo1
                registro.dtDetMatrRecuperacion = '2024/12/5'
                break

            default:
                console.log('No se a encontrado la unidad')
        }
        this._aulaService
            .guardarCalificacionEstudiante(
                'acad',
                'detalle_matriculas',
                where,
                registro
            )
            .subscribe({
                next: (response) => {
                    console.log('actualizar:', response)
                },
                error: (error) => {
                    console.log('Error en la actualización:', error)
                },
            })
        this.califcFinal.reset()
        console.log('hola', where, registro)
    }
    //mostrar las escalas de calificacioón
    mostrarCalificacion() {
        const userId = 1
        this._aulaService.obtenerCalificacion(userId).subscribe((Data) => {
            this.calificacion = Data['data']
            //console.log('Mostrar escala',this.calificacion)
        })
    }
    // mostrar los estudiantes
    getInformation(params) {
        this.GeneralService.getGralPrefix(params).subscribe({
            next: (response) => {
                this.estudiantes = response.data
                //console.log('lista de estudiante', this.estudiantes)
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
