import { Component, OnInit, Input, inject } from '@angular/core'
import { IActionContainer } from '@/app/shared/container-page/container-page.component'
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
import {
    EVALUACION,
    FORO,
    TAREA,
    tipoActividadesKeys,
} from '@/app/sistema/aula-virtual/interfaces/actividad.interface'
import { provideIcons } from '@ng-icons/core'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { PrimengModule } from '@/app/primeng.module'
import { ApiAulaService } from '@/app/sistema/aula-virtual/services/api-aula.service'
import { Message, MessageService } from 'primeng/api'
import { Subject, takeUntil } from 'rxjs'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { TabsKeys } from '../tab.interface'
import { DOCENTE, ESTUDIANTE } from '@/app/servicios/perfilesConstantes'
import { CardOrderListComponent } from '../../../../../../../shared/card-orderList/card-orderList.component'
import { SelectButtonChangeEvent } from 'primeng/selectbutton'
import { DetalleMatriculasService } from '@/app/servicios/acad/detalle-matriculas.service'
import { IconComponent } from '@/app/shared/icon/icon.component'
import { ActividadConfigPipe } from '@/app/sistema/aula-virtual/pipes/actividad-config.pipe'
@Component({
    selector: 'app-tab-resultados',
    standalone: true,
    templateUrl: './tab-resultados.component.html',
    styleUrls: ['./tab-resultados.component.scss'],
    imports: [
        TablePrimengComponent,
        PrimengModule,
        CardOrderListComponent,
        IconComponent,
        ActividadConfigPipe,
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

    private _formBuilder = inject(FormBuilder)
    private _aulaService = inject(ApiAulaService)
    private _confirmService = inject(ConfirmationModalService)
    // private ref = inject(DynamicDialogRef)
    private _constantesService = inject(ConstantesService)
    private _DetalleMatriculasService = inject(DetalleMatriculasService)
    private _MessageService = inject(MessageService)

    @Input() actions: IActionContainer[] = [
        {
            labelTooltip: 'Descargar Pdf',
            text: 'Reporte  Pdf',
            icon: 'pi pi-file-pdf',
            accion: 'descargar_pdf',
            class: 'p-button-danger',
        },
        // {
        //     labelTooltip: 'Descargar Excel',
        //     text: 'Reporte Excel',
        //     icon: 'pi pi-download',
        //     accion: 'Descargar_Excel',
        //     class: 'p-button-success',
        // },
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
    stateOptions: any[] = [
        { label: 'Resumen', value: '1' },
        { label: 'Detalle Completo', value: '2' },
    ]
    listarActividades: any[] = [
        {
            label: 'Actividad de Aprendizaje',
            value: TAREA,
            styleClass: 'btn-success',
        },
        { label: 'Foro', value: FORO, styleClass: 'btn-success' },
        { label: 'Evaluación', value: EVALUACION, styleClass: 'btn-danger' },
    ]
    seleccionarResultado = '1'
    actividadSeleccionado = TAREA

    public califcFinal: FormGroup = this._formBuilder.group({
        cDetMatrConclusionDesc1: ['', [Validators.required]],
        iEscalaCalifIdPeriodo1: ['', [Validators.required]],
    })
    public conclusionDescrp: FormGroup = this._formBuilder.group({
        iEscalaCalifId: ['', [Validators.required]],
        cDetMatConclusionDescPromedio: ['', [Validators.required]],
    })

    detalleActividades: any[] = []

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
        {
            type: 'text',
            width: '10rem',
            field: 'iEscalaCalifIdPromedioFinal',
            header: 'Promedio Final',
            text_header: 'center',
            text: 'center',
        },
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
            isVisible: () => this.iPerfilId === this.DOCENTE,
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
    descrip: string

    accionBnt({ accion, item }): void {
        switch (accion) {
            case 'agregarConclusion':
                // this.mostrarModalConclusionDesc = true
                this.enviarDatosFinales(item)
                break
        }
    }
    //enviar datos al modal
    enviarDatosFinales(item) {
        this.mostrarModalConclusionDesc = true
        this.estudianteSelect = item
        // this.descrip = item.cDetMatConclusionDescPromedio
        this.conclusionDescrp.controls['iEscalaCalifId'].setValue(
            item.iEscalaCalifIdPromedio
        )
        this.conclusionDescrp.controls[
            'cDetMatConclusionDescPromedio'
        ].setValue(item.cDetMatConclusionDescPromedio)
    }
    //cerra el modal de calificacion
    cerrarModalDeCalif() {
        this.mostrarModalConclusionDesc = false
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
                //     this.messageService.add({
                //         severity: 'error',
                //         summary: 'Error',
                //         detail: 'revisar',
                //     })
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
        // console.log('Estudiante select', estudiantes)
        this._aulaService
            .obtenerResultados({
                iEstudianteId: estudiantes.iEstudianteId,
                idDocCursoId: this.idDocCursoId,
            })
            .pipe(takeUntil(this.unsbscribe$))
            .subscribe({
                next: (resp) => {
                    this.detalleActividades = resp.length ? resp[0] : []
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
        // console.log('Indice de la Unidad', idx)
    }
    // para desacctivar el boton guardar conclusion descritiva
    desactivarUnidad(): boolean {
        return this.unidades.some((item) => item.iEstado === '0')
    }
    // muestra las notas del curso x trimestre
    reporteNotasFinales: any[] = []
    obtenerReporteDenotasFinales() {
        this._aulaService
            .obtenerReporteFinalDeNotas({
                iIeCursoId: this.curso.iIeCursoId,
                iYAcadId: this._constantesService.iYAcadId,
                iSedeId: this._constantesService.iSedeId,
                iSeccionId: this.curso.iSeccionId,
                iNivelGradoId: this.curso.iNivelGradoId,
                iEstudianteId:
                    this.iPerfilId === this.ESTUDIANTE
                        ? this._constantesService.iEstudianteId
                        : null,
            })
            .subscribe((Data) => {
                this.reporteNotasFinales = Data['data']
                this.reporteNotasFinales = Data['data'].map(
                    (item: any, index) => {
                        return {
                            ...item,
                            cTitulo: index + 1 + '.- ' + item.completoalumno,
                        }
                    }
                )
                // console.log(this.reporteNotasFinales)
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
        const idEscala = conclusionDescrp.iEscalaCalifId

        const params: any = {
            iEscalaCalifIdPromedio: idEscala,
            iEstudianteId: this.estudianteSelect.iEstudianteId,
            iMatrId: this.estudianteSelect.iMatrId,
            iIeCursoId: this.curso.iIeCursoId,
            cDetMatConclusionDescPromedio: conclusionDescrpLimpia,
            iSeccionId: this.curso.iSeccionId,
            idDocCursoId: this.idDocCursoId,
            iCredId: this._constantesService.iCredId,
        }
        this._DetalleMatriculasService
            .guardarConclusionDescriptiva(
                this.estudianteSelect.iDetMatrId,
                params
            )
            .subscribe({
                next: (response) => {
                    this.obtenerReporteDenotasFinales()
                    this.mostrarModalConclusionDesc = false
                    this.conclusionDescrp.reset()
                    if (response.validated) {
                        this._MessageService.add({
                            severity: 'success',
                            summary: 'Éxito',
                            detail: 'Calificación guardada correctamente.',
                        })
                    }
                },
                error: (error) => {
                    const errores = error?.error?.errors

                    if (error.status === 422 && errores) {
                        // Recorre y muestra cada mensaje de error
                        Object.keys(errores).forEach((campo) => {
                            errores[campo].forEach((mensaje: string) => {
                                this._MessageService.add({
                                    severity: 'error',
                                    summary: 'Error de validación',
                                    detail: mensaje,
                                })
                            })
                        })
                    } else {
                        // Error genérico si no hay errores específicos
                        this._MessageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail:
                                error?.error?.message ||
                                'Ocurrió un error inesperado',
                        })
                    }
                },
            })
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
            this._MessageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Seleccione un estudiante:',
            })
        } else {
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
                this._MessageService.add({
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
                                    this._MessageService.add({
                                        severity: 'success',
                                        summary: 'Éxito',
                                        detail: 'Calificación guardada correctamente.',
                                    })
                                },
                                error: (error) => {
                                    console.log(
                                        'Error en la actualización:',
                                        error
                                    )
                                },
                            })
                    },
                    reject: () => {
                        // Mensaje de cancelación (opcional)
                        this._MessageService.add({
                            severity: 'error',
                            summary: 'Cancelado',
                            detail: 'Acción cancelada',
                        })
                    },
                })
            }
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
        const idYear = 3 //this._constantesService.iYAcadId
        const params = {
            iYAcadId: idYear,
            iCredId: this._constantesService.iCredId,
        }
        this._aulaService.habilitarCalificacion(params).subscribe((Data) => {
            this.unidades = Data['data']
            // this.unidades.forEach((periodo, index) => {
            //     periodo.cPeriodoEvalNombre = `TRIMESTRAL ${index + 1}`;
            // });

            console.log(this.unidades)
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

    iTabSeleccionado: string = '1'
    obtenerTab(evn: SelectButtonChangeEvent) {
        if (!evn.value) {
            this.seleccionarResultado = this.iTabSeleccionado
        } else {
            this.iTabSeleccionado = evn.value
        }
    }

    obtenerActividadesxiActTipoId() {
        switch (this.actividadSeleccionado) {
            case TAREA:
                const tarea = this.detalleActividades['tarea']
                tarea ? JSON.parse(tarea) : []
                return tarea ? JSON.parse(tarea) : []
            case FORO:
                const foro = this.detalleActividades['foro']
                foro ? JSON.parse(foro) : []
                return foro ? JSON.parse(foro) : []
            case EVALUACION:
                const evaluacion = this.detalleActividades['evaluacion']
                evaluacion ? JSON.parse(evaluacion) : []
                return evaluacion ? JSON.parse(evaluacion) : []
        }
        return []
    }

    obtenerStyleActividad() {
        let styleActividad = ''
        switch (Number(this.actividadSeleccionado)) {
            case 1: //PROCESO TAREA
                styleActividad =
                    'border-left:15px solid var(--green-500); border-right:15px solid var(--green-500);'
                break
            case 2: //NO PUBLICADO FORO
                styleActividad =
                    'border-left:15px solid var(--yellow-500); border-right:15px solid var(--yellow-500);'
                break
            case 0: //CULMINADO EVALUACION
                styleActividad =
                    'border-left:15px solid var(--red-500); border-right:15px solid var(--red-500);'
                break
        }
        return styleActividad
    }

    asignarColorActividad(): string {
        if (this.actividadSeleccionado === TAREA) {
            return 'background-tarea'
        }
        if (this.actividadSeleccionado === FORO) {
            return 'background-evaluacion'
        }
        if (this.actividadSeleccionado === EVALUACION) {
            return 'background-foro'
        }
        return ''
    }
}
