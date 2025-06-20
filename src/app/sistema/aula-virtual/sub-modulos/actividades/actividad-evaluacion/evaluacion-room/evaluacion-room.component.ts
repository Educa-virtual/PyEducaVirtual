import { EvaluacionFinalizadaComponent } from './../evaluacion-finalizada/evaluacion-finalizada.component'
import { ApiEvaluacionesService } from '@/app/sistema/aula-virtual/services/api-evaluaciones.service'
import { IconComponent } from '@/app/shared/icon/icon.component'
import { CommonModule } from '@angular/common'
import {
    Component,
    inject,
    Input,
    OnInit,
    OnDestroy,
    OnChanges,
} from '@angular/core'
import { provideIcons } from '@ng-icons/core'
import {
    matAccessTime,
    matCalendarMonth,
    matHideSource,
    matListAlt,
    matMessage,
    matRule,
    matStar,
    matFactCheck,
    matQuiz,
    matAssignment,
    matDescription,
    matForum,
    matVideocam,
} from '@ng-icons/material-icons/baseline'

import { ActivatedRoute } from '@angular/router'
import { tipoActividadesKeys } from '@/app/sistema/aula-virtual/interfaces/actividad.interface'
import { ApiAulaService } from '@/app/sistema/aula-virtual/services/api-aula.service'
import { Subject } from 'rxjs'

import { EvaluacionFormPreguntasComponent } from '../evaluacion-form/evaluacion-form-preguntas/evaluacion-form-preguntas.component'
import { EvaluacionRoomCalificacionComponent } from './evaluacion-room-calificacion/evaluacion-room-calificacion.component'
import { PrimengModule } from '@/app/primeng.module'
import { EditorOnlyViewDirective } from '@/app/shared/directives/editor-only-view.directive'
import { RecursosListaComponent } from '@/app/shared/components/recursos-lista/recursos-lista.component'
import { EmptySectionComponent } from '@/app/shared/components/empty-section/empty-section.component'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { EvaluacionEstudiantesComponent } from '../evaluacion-estudiantes/evaluacion-estudiantes.component'
import { RubricasComponent } from '@/app/sistema/aula-virtual/features/rubricas/rubricas.component'
import { ActividadListaComponent } from '../../components/actividad-lista/actividad-lista.component'
import { RubricaEvaluacionComponent } from '@/app/sistema/aula-virtual/features/rubricas/components/rubrica-evaluacion/rubrica-evaluacion.component'
import { RubricaCalificarComponent } from '@/app/sistema/aula-virtual/features/rubricas/components/rubrica-calificar/rubrica-calificar.component'
import { ToolbarPrimengComponent } from '../../../../../../shared/toolbar-primeng/toolbar-primeng.component'
import { MenuItem, MessageService } from 'primeng/api'
import { DOCENTE, ESTUDIANTE } from '@/app/servicios/perfilesConstantes'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { EvaluacionAgregarPreguntasComponent } from './evaluacion-agregar-preguntas/evaluacion-agregar-preguntas.component'
import { TabsPrimengComponent } from '@/app/shared/tabs-primeng/tabs-primeng.component'
import { TabDescripcionActividadesComponent } from '../../components/tab-descripcion-actividades/tab-descripcion-actividades.component'
import { EvaluacionesService } from '@/app/servicios/eval/evaluaciones.service'
import { EvaluacionPreguntasComponent } from '../evaluacion-preguntas/evaluacion-preguntas.component'

@Component({
    selector: 'app-evaluacion-room',
    standalone: true,
    imports: [
        CommonModule,
        RubricaEvaluacionComponent,
        RubricasComponent,
        IconComponent,
        PrimengModule,
        EvaluacionFormPreguntasComponent,
        EvaluacionRoomCalificacionComponent,
        EditorOnlyViewDirective,
        RecursosListaComponent,
        EmptySectionComponent,
        EvaluacionEstudiantesComponent,
        EvaluacionFinalizadaComponent,
        ActividadListaComponent,
        RubricaCalificarComponent,
        ToolbarPrimengComponent,
        EvaluacionAgregarPreguntasComponent,
        TabsPrimengComponent,
        TabDescripcionActividadesComponent,
        EvaluacionPreguntasComponent,
    ],
    templateUrl: './evaluacion-room.component.html',
    styleUrl: './evaluacion-room.component.scss',
    providers: [
        ApiEvaluacionesService,

        provideIcons({
            matHideSource,
            matCalendarMonth,
            matMessage,
            matStar,
            matRule,
            matListAlt,
            matAccessTime,
            matFactCheck,
            matQuiz,
            matAssignment,
            matDescription,
            matForum,
            matVideocam,
        }),
    ],
})
export class EvaluacionRoomComponent implements OnInit, OnDestroy, OnChanges {
    items: MenuItem[] = []
    @Input() ixActivadadId: string
    @Input() iProgActId: string
    @Input() iActTopId: tipoActividadesKeys

    // injeccion de dependencias
    private _route = inject(ActivatedRoute)
    private _aulaService = inject(ApiAulaService)
    private _ConstantesService = inject(ConstantesService)
    private _ConfirmationModalService = inject(ConfirmationModalService)
    private _evalService = inject(ApiEvaluacionesService)
    private _EvaluacionesService = inject(EvaluacionesService)
    private _MessageService = inject(MessageService)

    actividad = {
        iContenidoSemId: 1,
        iProgActId: 57,
        cProgActTituloLeccion: 'Exmaen de recuperación final',
        iActTipoId: 3,
        iPragActEstado: 1,
        cActTipoNombre: 'Evaluación Formativa',
        idDocCursoId: 1,
        ixActivadadId: 'kVap2xygkeWrXR7q5mdBKjl6dNOzYAQ4oMGEZ31v09JbLDNw8N',
        dtProgActInicio: '2024-10-19T14:00:00',
        dtProgActFin: '2024-10-19T15:00:00',
        dtProgActPublicacion: '2024-10-10T20:12:00',
        iEstado: 2,
        iEvaluacionId: 17,
        cTareaTitulo: null,
        iForoId: null,
        iEstadoActividad: 0,
    }
    params = {
        iCursoId: 0,
        iDocenteId: 0,
        idDocCursoId: 0,
        iEvaluacionId: null,
    }

    rubricas = [
        {
            iInstrumentoId: 0,
            cInstrumentoNombre: 'Sin instrumento de evaluación',
        },
    ]

    tabs = [
        {
            title: 'Descripción',
            icon: 'pi pi-list',
            tab: 'descripcion',
            //tab:0
        },
        {
            title: 'Preguntas',
            icon: 'pi-pen-to-square',
            tab: 'preguntas',
            isVisible: !(this._ConstantesService.iPerfilId === DOCENTE),
            //tab:1
        },
        {
            title: 'Calificar',
            icon: 'pi-list-check',
            tab: 'calificar',
            isVisible: !(this._ConstantesService.iPerfilId === DOCENTE),
            //tab:2
        },
        {
            title: 'Rendir Evaluación',
            icon: 'pi-check-circle',
            tab: 'rendir-examen',
            isVisible: !(this._ConstantesService.iPerfilId === ESTUDIANTE),
            //tab:3
        },
    ]

    activeIndex: number = 0
    constructor(
        private _evaluacionService: ApiEvaluacionesService,
        private _constantesService: ConstantesService,

        private _activeRoute: ActivatedRoute
    ) {}
    tabSeleccionado: string = 'descripcion'
    obtenerIndex(event) {
        this.tabSeleccionado = event.tab
    }
    handleActions(action) {
        console.log(action)
    }

    obtenerRubricas() {
        const params = {
            iDocenteId: this._ConstantesService.iDocenteId,
        }
        this._evaluacionService.obtenerRubricas(params).subscribe({
            next: (data) => {
                data.forEach((element) => {
                    this.rubricas.push(element)
                })
            },
        })
    }

    accionRubrica(elemento): void {
        if (!elemento) return
        this.obtenerRubricas()
    }

    dialogRubricaInfo = {
        visible: false,
        header: undefined,
    }

    showRubrica(data) {
        this.dialogRubricaInfo.visible = true
        this.dialogRubricaInfo.header = data
    }

    private unsbscribe$ = new Subject<boolean>()
    public iPerfilId: number
    public evaluacion
    public cEvaluacionInstrucciones
    public DOCENTE = DOCENTE
    public ESTUDIANTE = ESTUDIANTE
    isDocente: boolean = this._ConstantesService.iPerfilId === DOCENTE
    ngOnInit() {
        console.log('')
        // this.params.iDocenteId = this._constantesService.iDocenteId

        // this._activeRoute.queryParams.subscribe((params) => {
        //     this.params.iCursoId = params['iCursoId'] ?? null
        //     this.params.idDocCursoId = params['idDocCursoId'] ?? null
        //     this.params.iEvaluacionId = params['iEvaluacionId'] ?? null
        // })

        // console.log('params')
        // console.log(this.params)

        // this.obtenerEvaluacion()
        // this.iPerfilId = Number(this._ConstantesService.iPerfilId)
    }
    ngOnChanges(changes) {
        if (changes.ixActivadadId?.currentValue) {
            this.ixActivadadId = changes.ixActivadadId.currentValue
            this.obtenerEvaluacion(this.ixActivadadId)
        }
    }
    // obtiene la evalución
    obtenerEvaluacion(iEvaluacionId: string | number) {
        const params = {
            iCredId: this._ConstantesService.iCredId,
        }
        this._EvaluacionesService
            .obtenerEvaluacionesxiEvaluacionId(iEvaluacionId, params)
            .subscribe({
                next: (resp) => {
                    if (resp.validated) {
                        let data = resp.data
                        data = data.length ? data[0] : []
                        data.cEvaluacionArchivoAdjunto =
                            data.cEvaluacionArchivoAdjunto
                                ? JSON.parse(data.cEvaluacionArchivoAdjunto)
                                : []
                        this.evaluacion = {
                            cTitle:
                                'Evaluación Formativa: ' +
                                (data.cEvaluacionTitulo || '-'),
                            cHeader: data.cEvaluacionTitulo || '-',
                            dInicio: data.dtEvaluacionInicio,
                            dFin: data.dtEvaluacionFin,
                            iEstado: Number(data.iEstado || 0),
                            cDescripcion: data.cEvaluacionDescripcion,
                            cDocumentos: data.cEvaluacionArchivoAdjunto,
                        }
                        // data = data.length ? data[0] : []
                        // data.cEvaluacionArchivoAdjunto =
                        //     data.cEvaluacionArchivoAdjunto
                        //         ? JSON.parse(data.cEvaluacionArchivoAdjunto)
                        //         : []
                        // this.filesUrl = data.cEvaluacionArchivoAdjunto
                        // this.formEvaluacion.patchValue({
                        //     ...data,
                        //     dtEvaluacionInicio: new Date(
                        //         data.dtEvaluacionInicio
                        //     ),
                        //     dtEvaluacionFin: new Date(data.dtEvaluacionFin),
                        // })
                    }
                },
                error: (error) => {
                    const errores = error?.error?.errors
                    if (error.status === 422 && errores) {
                        // Recorre y muestra cada mensaje de error
                        Object.keys(errores).forEach((campo) => {
                            errores[campo].forEach((mensaje: string) => {
                                this.mostrarMensajeToast({
                                    severity: 'error',
                                    summary: 'Error de validación',
                                    detail: mensaje,
                                })
                            })
                        })
                    } else {
                        // Error genérico si no hay errores específicos
                        this.mostrarMensajeToast({
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
    // obtenerEvaluacion() {
    //     this._aulaService
    //         .obtenerActividad({
    //             iActTipoId: this.iActTopId,
    //             ixActivadadId: this.ixActivadadId,
    //         })
    //         .pipe(takeUntil(this.unsbscribe$))
    //         .subscribe({
    //             next: (resp) => {
    //                 this.evaluacion = resp
    //                 this.cEvaluacionInstrucciones =
    //                     this.evaluacion.cEvaluacionDescripcion
    //                 if (this.evaluacion?.iEstado === 1) {
    //                     this.items = [
    //                         {
    //                             items: [
    //                                 {
    //                                     label: 'Editar',
    //                                     icon: 'pi pi-pencil',
    //                                 },
    //                                 {
    //                                     label: 'Eliminar',
    //                                     icon: 'pi pi-trash',
    //                                     command: () => {
    //                                         this.eliminarEvaluacionxiEvaluacionId()
    //                                     },
    //                                 },

    //                                 {
    //                                     label: 'Publicar',
    //                                     icon: 'pi pi-send',
    //                                     command: () => {
    //                                         this.actualizarEvaluacionxiEvaluacionId()
    //                                     },
    //                                 },
    //                             ],
    //                         },
    //                     ]
    //                 }
    //                 if (this.evaluacion?.iEstado === 2) {
    //                     this.items = [
    //                         {
    //                             items: [
    //                                 {
    //                                     label: 'Anular Publicación',
    //                                     icon: 'pi pi-times',
    //                                     command: () => {
    //                                         this.anularEvaluacionxiEvaluacionId()
    //                                     },
    //                                 },
    //                             ],
    //                         },
    //                     ]
    //                 }
    //             },
    //         })
    // }

    // desuscribe los observables al eliminarse el componente
    ngOnDestroy() {
        this.unsbscribe$.next(true)
        this.unsbscribe$.complete()
    }
    eliminarEvaluacionxiEvaluacionId() {
        this._ConfirmationModalService.openConfirm({
            header: '¿Está seguro de eliminar la evaluación?',
            accept: () => {
                this.eliminarEvaluacionPorId(
                    this.iProgActId,
                    this.iActTopId,
                    this.ixActivadadId
                )
            },
        })
    }

    private eliminarEvaluacionPorId(iProgActId, iActTipoId, ixActivadadId) {
        this._aulaService
            .eliminarActividad({ iProgActId, iActTipoId, ixActivadadId })
            .subscribe({
                next: (resp) => {
                    console.log(resp)
                    window.history.back()
                },
            })
    }

    actualizarEvaluacionxiEvaluacionId() {
        this._ConfirmationModalService.openConfirm({
            header: '¿Esta seguro de publicar la evaluación?',
            accept: () => {
                this.publicarEvaluacion()
            },
        })
    }

    publicarEvaluacion() {
        if (this.evaluacion.iEvaluacionId) {
            const data = {
                iEvaluacionId: this.ixActivadadId,
                iCursoId: this.evaluacion.iCursoId,
                iSeccionId: this.evaluacion.iSeccionId,
                iGradoId: this.evaluacion.iGradoId,
                iYAcadId: this._constantesService.iYAcadId,
                iSemAcadId: this.evaluacion.iSemAcadId,
                iNivelGradoId: this.evaluacion.iNivelGradoId,
                iCurrId: this.evaluacion.iCurrId,
                iEstado: 2,
            }
            this._evalService.publicarEvaluacion(data).subscribe({
                next: () => {
                    // this.obtenerEvaluacion()
                },
            })
        }
    }

    anularEvaluacionxiEvaluacionId() {
        this._ConfirmationModalService.openConfirm({
            header: '¿Esta seguro de anular la publicación de la evaluación?',
            accept: () => {
                this.anularPublicacionEvaluacion({
                    iEvaluacionId: this.ixActivadadId,
                })
            },
        })
    }
    anularPublicacionEvaluacion({ iEvaluacionId }) {
        this._evalService
            .anularPublicacionEvaluacion({ iEvaluacionId })
            .subscribe({
                next: () => {
                    // this.obtenerEvaluacion()
                },
            })
    }

    mostrarMensajeToast(message) {
        this._MessageService.add(message)
    }
}
