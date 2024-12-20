import { CommonModule } from '@angular/common'
import { Component, OnInit, Input, inject } from '@angular/core'
import {
    ContainerPageComponent,
    IActionContainer,
} from '@/app/shared/container-page/container-page.component'
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
import { Message, MessageService } from 'primeng/api'
import { Subject, takeUntil } from 'rxjs'
import { RemoveHTMLPipe } from '@/app/shared/pipes/remove-html.pipe'
import { CommonInputComponent } from '@/app/shared/components/common-input/common-input.component'
import { ButtonModule } from 'primeng/button'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { TabsKeys } from '../tab.interface'
import { DOCENTE, ESTUDIANTE } from '@/app/servicios/perfilesConstantes'
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
    @Input() area: TabsKeys
    @Input() iCursoId
    @Input() _iSilaboId
    @Input() idDocCursoId
    @Input() curso

    private GeneralService = inject(GeneralService)
    private _formBuilder = inject(FormBuilder)
    private _aulaService = inject(ApiAulaService)
    private _confirmService = inject(ConfirmationModalService)
    // private ref = inject(DynamicDialogRef)
    private _constantesService = inject(ConstantesService)
    @Input() actions: IActionContainer[] = [
        {
            labelTooltip: 'Descargar Pdf',
            text: 'Reporte  Pdf',
            icon: 'pi pi-file-pdf',
            accion: 'descargar_pdf',
            class: 'p-button-danger',
        },
        {
            labelTooltip: 'Descargar Excel',
            text: 'Reporte Excel',
            icon: 'pi pi-download',
            accion: 'Descargar_Excel',
            class: 'p-button-success',
        },
    ]
    estudiantes: any[] = []
    reporteDeNotas: any[] = []
    estudianteEv: any[] = []
    calificacion: any[] = []
    mit: any[] = []
    //------
    estudianteSeleccionado: any
    resultadosEstudiantes: any
    //-------
    iEstudianteId: number
    estudianteSelect = null
    public comentariosSelect = []
    public comentarioSelectTareas = []
    public comentarioSelectEvaluaciones = []
    messages: Message[] | undefined
    tabla: string
    campos: string
    where: number
    iPerfilId: number
    public DOCENTE = DOCENTE
    public ESTUDIANTE = ESTUDIANTE
    iDocenteId: number
    private unsbscribe$ = new Subject<boolean>()

    unidad: number
    idcurso: number
    mostrarDiv: boolean = false // Variable para controlar la visibilidad

    califcnFinal: any[] = []
    public califcFinal: FormGroup = this._formBuilder.group({
        cDetMatrConclusionDesc1: ['', [Validators.required]],
        iEscalaCalifIdPeriodo1: ['', [Validators.required]],
    })
    public conclusionDescrp: FormGroup = this._formBuilder.group({
        cDetMatConclusionDescPromedio: ['', [Validators.required]],
    })
    constructor(private messageService: MessageService) {}
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
            field: 'completoalumno',
            header: 'Nombre estudiante',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '10rem',
            field: 'iEscalaCalifIdPeriodo1',
            header: 'Trimestre 01',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '10rem',
            field: 'iEscalaCalifIdPeriodo2',
            header: 'Trimestre 02',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '10rem',
            field: 'iEscalaCalifIdPeriodo3',
            header: 'Trimestre 03',
            text_header: 'center',
            text: 'center',
        },
        // {
        //     type: 'text',
        //     width: '10rem',
        //     field: 'iEscalaCalifIdPeriodo4',
        //     header: 'Promedio 04',
        //     text_header: 'center',
        //     text: 'center',
        // },
        {
            type: 'text',
            width: '10rem',
            field: 'cDetMatConclusionDescPromedio',
            header: 'Conclusión descriptiva',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'actions',
            width: '1rem',
            field: '',
            header: 'Acciones',
            text_header: 'center',
            text: 'center',
        },
    ]
    public accionesTabla: IActionTable[] = [
        {
            labelTooltip: 'Agregar Conclusión descriptiva',
            icon: 'pi pi-cog',
            accion: 'agregarConclusion',
            type: 'item',
            class: 'p-button-rounded p-button-danger p-button-text',
        },
    ]
    // Inicializamos
    ngOnInit() {
        this.obtenerIdPerfil()
        this.mostrarCalificacion()
        this.obtenerReporteDenotasFinales()
        this.habilitarCalificacion()
    }
    //Agregar conclusion descritiva final
    mostrarModalConclusionDesc: boolean = false
    accionBnt({ accion, item }): void {
        switch (accion) {
            case 'agregarConclusion':
                this.mostrarModalConclusionDesc = true
                this.estudianteSelect = item
                console.log('Agregar descripcion', accion, item)
                break
        }
    }
    //Descargar reporte de notas finales de curso con switch
    accionDescargar({ accion }): void {
        switch (accion) {
            case 'descargar_pdf':
                this.generarReporteDeLogrosPdf()
                console.log('Descargar pdf')
                break
            case 'Descargar_Excel':
                console.log('Descargar excel')
                break
        }
    }
    //exportar en pdf el reporte de notas finales:
    generarReporteDeLogrosPdf() {
        const value = this.iCursoId
        const idDocente = this.idDocCursoId
        console.log('idDocente', this.idDocCursoId)
        this._aulaService
            .generarReporteDeLogrosPdf({
                iIeCursoId: value,
                idDocCursoId: idDocente,
            })
            .subscribe(
                (response) => {
                    //console.log('Respuesta de Evaluacion:', response) // Para depuración
                    // Crear un Blob con la respuesta del backend
                    const blob = response as Blob // Asegúrate de que la respuesta sea un Blob
                    const link = document.createElement('a')
                    //console.log('imprimer01', blob)
                    link.href = URL.createObjectURL(blob)
                    link.download = 'Reporte_logros' + '.pdf' // Nombre del archivo descargado
                    link.click()
                }
                // (error) => {
                //     // En caso de error, se determina el mensaje de error a mostrar
                //     const errorMessage =
                //         error?.message ||
                //         'No hay datos suficientes para exportar nivel de logro'

                //     // // Se muestra un mensaje de error en el sistema
                //     // this.messageService.add({
                //     //     severity: 'error',
                //     //     summary: 'Error',
                //     //     detail: 'revisar',
                //     // })
                // }
            )
    }
    //obtener los perfiles
    obtenerIdPerfil() {
        this.iEstudianteId = this._constantesService.iEstudianteId
        this.iPerfilId = this._constantesService.iPerfilId
        this.iDocenteId = this._constantesService.iDocenteId
        //console.log('icredito', this.iEstudianteId)
    }
    // Obtenemos los datos de estudiante que el docente hico su retroalimentación por alumno
    obtenerComnt(estudiantes) {
        //this.mostrarDiv = !this.mostrarDiv // Cambia el estado de visibilida
        this.estudianteEv = estudiantes.completoalumno
        this.estudianteSeleccionado = estudiantes
        console.log('Estudiante select', estudiantes)
        this._aulaService
            .obtenerResultados({
                iEstudianteId: estudiantes.iEstudianteId,
                idDocCursoId: estudiantes.iIeCursoId,
            })
            .pipe(takeUntil(this.unsbscribe$))
            .subscribe({
                next: (resp) => {
                    this.comentariosSelect = []
                    console.log('obtener comentarios', resp)
                    resp.forEach((element) => {
                        element['foro'] = element['foro']
                            ? JSON.parse(element['foro'])
                            : []
                    })
                    this.comentariosSelect = resp.length ? resp[0]['foro'] : []
                    console.log('Mis foros', this.comentariosSelect)

                    this.comentarioSelectTareas = []
                    resp.forEach((element) => {
                        element['tarea'] = element['tarea']
                            ? JSON.parse(element['tarea'])
                            : []
                    })
                    this.comentarioSelectTareas = resp.length
                        ? resp[0]['tarea']
                        : []
                    console.log('Mis tareas', this.comentarioSelectTareas)

                    this.comentarioSelectEvaluaciones = []
                    resp.forEach((element) => {
                        element['evaluacion'] = element['evaluacion']
                            ? JSON.parse(element['evaluacion'])
                            : []
                    })
                    this.comentarioSelectEvaluaciones = resp.length
                        ? resp[0]['evaluacion']
                        : []
                    console.log(
                        'Mis evaluaciones',
                        this.comentarioSelectEvaluaciones
                    )
                    //console.log(resp)
                    //comentariosForo
                    //comentariosTareas

                    // this.messages = [
                    //     {
                    //         severity: 'info',
                    //         detail: resp?.iEscalaCalifId,
                    //     },
                    // ]
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
    // metodo para limpiar las etiquetas
    limpiarHTML(html: string): string {
        const temporal = document.createElement('div') // Crear un div temporal
        temporal.innerHTML = html // Insertar el HTML
        return temporal.textContent || '' // Obtener solo el texto
    }
    //metodo para obtener el id de la unidad al seleccionar
    selectUnidad(item: any, idx: number): void {
        this.unidad = idx
        //console.log('Unidad Seleccionada', item)
        console.log('Indice de la Unidad', idx)
    }
    // muestra las notas del curso x trimestre
    reporteNotasFinales: any[] = []
    obtenerReporteDenotasFinales() {
        console.log('idCurso:', this.iCursoId)
        const value = this.iCursoId
        this._aulaService
            .obtenerReporteFinalDeNotas({
                iIeCursoId: value,
            })
            .subscribe((Data) => {
                this.reporteNotasFinales = Data['data']
                console.log(this.reporteNotasFinales)
                // Mapear las calificaciones en letras a reporteNotasFinales
                //console.log('Mostrar notas finales', this.reporteNotasFinales)
                this.calificacion
            })
    }
    // Metodo para guardar la conclusión descriptiva final
    guardarConclusionDescriptiva() {
        const conclusionDescrp = this.conclusionDescrp.value
        const conclusionDescrpLimpia = this.limpiarHTML(
            conclusionDescrp.cDetMatConclusionDescPromedio
        )
        const where = [
            {
                COLUMN_NAME: 'iDetMatrId',
                VALUE: this.estudianteSelect.iDetMatrId,
            },
        ]
        const registro: any = {
            cDetMatConclusionDescPromedio: conclusionDescrpLimpia,
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
                    this.obtenerReporteDenotasFinales()
                    this.mostrarModalConclusionDesc = false
                    console.log('actualizar:', response)
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Calificación guardada correctamente.',
                    })
                },
                error: (error) => {
                    console.log('Error en la actualización:', error)
                },
            })
        this.conclusionDescrp.reset()
        console.log('conclusion;', where, registro)
    }
    //guardar la calificación y conclusión descriptiva del docente para los promedios finales
    guardaCalificacionFinalUnidad() {
        const resultadosEstudiantesf = this.califcFinal.value
        const descripcionlimpia = resultadosEstudiantesf.cDetMatrConclusionDesc1
        const conclusionFinalDocente = this.limpiarHTML(descripcionlimpia)
        console.log(
            'calificacion',
            this.califcFinal.value.iEscalaCalifIdPeriodo1
        )
        if (this.estudianteSeleccionado == undefined) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Seleccione un estudiante:',
            })
        }
        const fechaActual = new Date()
        const where = [
            {
                COLUMN_NAME: 'iDetMatrId',
                VALUE: this.estudianteSeleccionado.iDetMatrId,
            },
        ]
        console.log('where', where)
        const registro: any = {}
        if (!this.unidad) {
            this.unidades.find((i, index) => {
                if (i.iEstado) {
                    this.unidad = index
                }
            })
        }
        //console.log(this.unidad)
        switch (this.unidad) {
            case 0:
                registro.cDetMatrConclusionDesc1 = conclusionFinalDocente
                registro.iEscalaCalifIdPeriodo1 =
                    resultadosEstudiantesf.iEscalaCalifIdPeriodo1
                registro.dtDetMatrPeriodo1 = fechaActual
                break
            case 1:
                registro.cDetMatrConclusionDesc2 = conclusionFinalDocente
                registro.iEscalaCalifIdPeriodo2 =
                    resultadosEstudiantesf.iEscalaCalifIdPeriodo1
                registro.dtDetMatrPeriodo2 = fechaActual
                break
            case 2:
                registro.cDetMatrConclusionDesc3 = conclusionFinalDocente
                registro.iEscalaCalifIdPeriodo3 =
                    resultadosEstudiantesf.iEscalaCalifIdPeriodo1
                registro.dtDetMatrPeriodo3 = fechaActual
                break
            case 3:
                registro.cDetMatrConclusionDesc4 = conclusionFinalDocente
                registro.iEscalaCalifIdPeriodo4 =
                    resultadosEstudiantesf.iEscalaCalifIdPeriodo1
                registro.dtDetMatrPeriodo4 = fechaActual
                break
            case 4:
                registro.iEscalaCalifIdRecuperacion =
                    resultadosEstudiantesf.iEscalaCalifIdPeriodo1
                registro.dtDetMatrRecuperacion = fechaActual
                break

            default:
                console.log('No se a encontrado la unidad')
        }
        if (
            conclusionFinalDocente == '' ||
            this.califcFinal.value.iEscalaCalifIdPeriodo1 == null
        ) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Tiene que agregar una conclusión descriptiva y el nivel de logro',
            })
        } else {
            this._confirmService.openConfiSave({
                message: 'Recuerde que no podra retroceder',
                header: '¿Esta seguro que desea guardar conclusión descriptiva?',
                accept: () => {
                    // Acción para guardar la conclusion descritiva final
                    this._aulaService
                        .guardarCalificacionEstudiante(
                            'acad',
                            'detalle_matriculas',
                            where,
                            registro
                        )
                        .subscribe({
                            next: (response) => {
                                this.califcFinal.reset()
                                //actualiza la tabla de reporte de notas:
                                this.obtenerReporteDenotasFinales()
                                console.log('actualizar:', response)
                                this.messageService.add({
                                    severity: 'success',
                                    summary: 'Éxito',
                                    detail: 'Calificación guardada correctamente.',
                                })
                            },
                            error: (error) => {
                                console.log('Error en la actualización:', error)
                            },
                        })
                },
                reject: () => {
                    // Mensaje de cancelación (opcional)
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Cancelado',
                        detail: 'Acción cancelada',
                    })
                },
            })
        }
    }
    //mostrar las escalas de calificacioón
    mostrarCalificacion() {
        const userId = 1
        this._aulaService.obtenerCalificacion(userId).subscribe((Data) => {
            this.calificacion = Data['data']
            //console.log('Mostrar escala',this.calificacion)
        })
    }
    //obtener los periordos en un button
    unidades: any[] = []
    habilitarCalificacion() {
        const params = {
            iYAcadId: this._constantesService.iYAcadId,
            iCredId: this._constantesService.iCredId,
        }
        //console.log('año', params)
        this._aulaService.habilitarCalificacion(params).subscribe((Data) => {
            this.unidades = Data['data']
            this.unidades = this.unidades.map((unidad) => {
                const ini = new Date(
                    unidad.dtPeriodoEvalAperInicio
                ).toLocaleDateString()
                const fin = new Date(
                    unidad.dtPeriodoEvalAperFin
                ).toLocaleDateString()

                return {
                    ...unidad,
                    dtPeriodoEvalAperInicio: ini,
                    dtPeriodoEvalAperFin: fin,
                }
            })
            //console.log('Mostrar fechas', this.unidades)
        })
    }
}
