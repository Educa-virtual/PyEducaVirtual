import { CommonModule } from '@angular/common'
import { Component, inject, Input, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { AccordionModule } from 'primeng/accordion'
import { CalendarModule } from 'primeng/calendar'
import { IconFieldModule } from 'primeng/iconfield'
import { InputIconModule } from 'primeng/inputicon'
import { InputTextModule } from 'primeng/inputtext'
import { ActividadRowComponent } from '@/app/sistema/aula-virtual/sub-modulos/actividades/components/actividad-row/actividad-row.component'
import {
    actividadesConfig,
    EVALUACION,
    FORO,
    IActividad,
    MATERIAL,
    TAREA,
    VIDEO_CONFERENCIA,
} from '@/app/sistema/aula-virtual/interfaces/actividad.interface'
import { TActividadActions } from '@/app/sistema/aula-virtual/interfaces/actividad-actions.iterface'
import { DialogModule } from 'primeng/dialog'
import { MenuModule } from 'primeng/menu'
import { MenuItem } from 'primeng/api'
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog'
import { IconComponent } from '@/app/shared/icon/icon.component'
import { provideIcons } from '@ng-icons/core'
import {
    matFactCheck,
    matQuiz,
    matAssignment,
    matDescription,
    matForum,
    matVideocam,
} from '@ng-icons/material-icons/baseline'
import { MODAL_CONFIG } from '@/app/shared/constants/modal.config'
import { ActividadListaComponent } from '../../../../actividades/components/actividad-lista/actividad-lista.component'
import { TareaFormContainerComponent } from '../../../../actividades/actividad-tarea/tarea-form-container/tarea-form-container.component'
import { VideoconferenciaContainerFormComponent } from '../../../../actividades/actividad-videoconferencia/videoconferencia-container-form/videoconferencia-container-form.component'
import { ForoFormContainerComponent } from '../../../../actividades/actividad-foro/foro-form-container/foro-form-container.component'
import { ActividadFormComponent } from '../../../../actividades/components/actividad-form/actividad-form.component'
import { EvaluacionFormContainerComponent } from '../../../../actividades/actividad-evaluacion/evaluacion-form-container/evaluacion-form-container.component'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { GeneralService } from '@/app/servicios/general.service'
import { ApiAulaService } from '@/app/sistema/aula-virtual/services/api-aula.service'
import { Subject, takeUntil } from 'rxjs'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { ActivatedRoute, Router } from '@angular/router'
import { DynamicDialogModule } from 'primeng/dynamicdialog'

@Component({
    selector: 'app-tab-contenido',
    standalone: true,
    imports: [
        CommonModule,
        IconFieldModule,
        InputIconModule,
        InputTextModule,
        CalendarModule,
        FormsModule,
        AccordionModule,
        ActividadRowComponent,
        ActividadListaComponent,
        DialogModule,
        MenuModule,
        TareaFormContainerComponent,
        VideoconferenciaContainerFormComponent,
        IconComponent,
        DynamicDialogModule,
    ],
    templateUrl: './tab-contenido.component.html',
    styleUrl: './tab-contenido.component.scss',
    providers: [
        DialogService,
        provideIcons({
            matFactCheck,
            matQuiz,
            matAssignment,
            matDescription,
            matForum,
            matVideocam,
        }),
    ],
})
export class TabContenidoComponent implements OnInit {
    public rangeDates: Date[] | undefined
    public accionesContenido: MenuItem[]
    public actividadSelected: IActividad | undefined
    public accionSeleccionada: string | undefined
    public contenidoSemanas = []
    // public actividades = actividadesConfigList

    private _constantesService = inject(ConstantesService)
    private _generalService = inject(GeneralService)
    private _confirmService = inject(ConfirmationModalService)
    private _aulaService = inject(ApiAulaService)
    private semanaSeleccionada
    private _unsubscribe$ = new Subject<boolean>()
    tipoActivadedes = []
    @Input({ required: true }) private _iSilaboId: string

    // lista de acciones base para la semana
    private handleActionsMap: Record<
        number,
        (action: TActividadActions, actividad: IActividad) => void
    > = {
        [TAREA]: this.handleTareaAction.bind(this),
        [FORO]: this.handleForoAction.bind(this),
        [EVALUACION]: this.handleEvaluacionAction.bind(this),
        [VIDEO_CONFERENCIA]: this.handleVideoconferenciaAction.bind(this),
        [MATERIAL]: this.handleMaterialAction.bind(this),
    }

    constructor(
        private _dialogService: DialogService,
        private router: Router,
        private _activatedRoute: ActivatedRoute
    ) {}

    ngOnInit(): void {
        const today = new Date()
        const nextWeek = new Date()
        nextWeek.setDate(today.getDate() + 7)

        this.rangeDates = [today, nextWeek]

        this.getData()
    }

    private getData() {
        this.obtenerTipoActivadad()
        this.obtenerContenidoSemanas()
    }

    obtenerTipoActivadad() {
        this._aulaService.obtenerTipoActividades().subscribe({
            next: (tipoActivadeds) => {
                this.tipoActivadedes = tipoActivadeds
                this.generarAccionesContenido()
            },
        })
    }

    private obtenerContenidoSemanas() {
        this._aulaService
            .contenidoSemanasProgramacionActividades({
                iSilaboId: this._iSilaboId,
            })
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe({
                next: (data) => {
                    this.contenidoSemanas = data
                },
            })
    }

    setSemanaSeleccionada(semana) {
        this.semanaSeleccionada = semana
    }

    // genera las acciones de contenido segun la configuracion de las actividades
    generarAccionesContenido() {
        this.accionesContenido = Object.keys(actividadesConfig).map((key) => {
            const tipoActividadLocal = actividadesConfig[key]
            const tipoActividad = this.tipoActivadedes.find(
                (act) => act.iActTipoId == tipoActividadLocal.iActTipoId
            )
            return {
                label: tipoActividad.cActTipoNombre,
                icon: tipoActividadLocal.icon,
                command: () => {
                    const actionHandler =
                        this.handleActionsMap[tipoActividadLocal.iActTipoId]
                    if (actionHandler) {
                        actionHandler('CREAR', tipoActividadLocal)
                    }
                },
            }
        })
    }

    actionSelected({
        actividad,
        action,
    }: {
        actividad: IActividad
        action: string
    }) {
        console.log(actividad, action)

        this.actividadSelected = actividad
        this.accionSeleccionada = action

        if (actividad.iActTipoId === TAREA) {
            this.handleTareaAction(action, actividad)
            return
        }

        if (actividad.iActTipoId === EVALUACION) {
            this.handleEvaluacionAction(action, actividad)
            return
        }

        if (actividad.iActTipoId === FORO) {
            this.handleForoAction(action, actividad)
            return
        }

        if (actividad.iActTipoId === VIDEO_CONFERENCIA) {
            this.handleVideoconferenciaAction(action, actividad)
            return
        }

        if (actividad.iActTipoId === MATERIAL) {
            this.handleMaterialAction('EDITAR', actividad, 'Editar Material')
        }
    }

    handleTareaAction(action: string, actividad: IActividad) {
        switch (action) {
            case 'CREAR':
            case 'EDITAR':
                const ref: DynamicDialogRef = this._dialogService.open(
                    TareaFormContainerComponent,
                    {
                        ...MODAL_CONFIG,
                        data: {
                            contenidoSemana: this.semanaSeleccionada,
                            iActTipoId: actividad.iActTipoId,
                            actividad: actividad,
                            action:
                                action === 'EDITAR' ? 'ACTUALIZAR' : 'GUARDAR',
                        },
                        header:
                            action === 'EDITAR'
                                ? 'Editar Tarea'
                                : 'Crear Tarea',
                    }
                )
                ref.onClose.subscribe((result) => {
                    if (result) {
                        this.getData()
                        console.log('Formulario enviado', result)
                    } else {
                        console.log('Formulario cancelado')
                    }
                })
                break
            case 'ELIMINAR':
                console.log(actividad)
                this._confirmService.openConfirm({
                    header:
                        '¿Esta seguro de eliminar la tarea ' +
                        actividad['cTareaTitulo'] +
                        ' ?',
                    accept: () => {
                        this.deleteTareaxiTareaid(actividad)
                    },
                })
                break
            case 'VER':
                this.router.navigate([
                    'aula-virtual/areas-curriculares/' +
                        'actividad' +
                        '/' +
                        actividad.ixActivadadId +
                        '/' +
                        actividad.iActTipoId,
                ])
                break
        }
    }

    handleVideoconferenciaAction(action: string, actividad: IActividad) {
        if (action === 'EDITAR' || action === 'CREAR') {
            let data = null
            let header = 'Crear Videoconferencia'
            if (action === 'EDITAR') {
                data = actividad
                header = 'Editar Videoconferencia'
            }
            this._dialogService.open(VideoconferenciaContainerFormComponent, {
                ...MODAL_CONFIG,
                data: data,
                header: header,
            })
        }
    }

    handleForoAction(action: string, actividad: IActividad) {
        if (action === 'EDITAR') {
            this._dialogService.open(ForoFormContainerComponent, {
                ...MODAL_CONFIG,
                data: actividad,
                header: 'Editar Foro',
            })
        }
        if (action === 'CREAR') {
            this._dialogService.open(ForoFormContainerComponent, {
                ...MODAL_CONFIG,
                header: 'Crear Foro',
                data: actividad,
            })
        }
    }

    handleMaterialAction(
        action: TActividadActions,
        actividad: IActividad,
        header
    ) {
        if (action === 'EDITAR' || action === 'CREAR') {
            this._dialogService.open(ActividadFormComponent, {
                ...MODAL_CONFIG,
                data: actividad,
                header: header,
            })
        }
    }

    handleEvaluacionAction(action: string, actividad: IActividad) {
        if (action === 'CREAR' || action === 'EDITAR') {
            const ref = this._dialogService.open(
                EvaluacionFormContainerComponent,
                {
                    ...MODAL_CONFIG,
                    maximizable: true,
                    header:
                        actividad == null
                            ? 'Crear Evaluación'
                            : 'Editar Evaluación',
                    data: {
                        actividad,
                        semana: this.semanaSeleccionada,
                    },
                }
            )
            this._dialogService.getInstance(ref).maximize()
            ref.onClose.pipe(takeUntil(this._unsubscribe$)).subscribe({
                next: () => {
                    // todo validar solo cuando sea necesario
                    this.obtenerContenidoSemanas()
                },
            })
        }

        if (action === 'ELIMINAR') {
            this._confirmService.openConfirm({
                header: '¿Esta seguro de eliminar la evaluación?',
                accept: () => {
                    this.eliminarActividad(
                        actividad.iProgActId,
                        actividad.iActTipoId,
                        actividad.ixActivadadId
                    )
                },
            })
        }

        if (action === 'VER') {
            this.router.navigate(
                [
                    '../',
                    'actividad',
                    actividad.ixActivadadId,
                    actividad.iActTipoId,
                ],
                {
                    relativeTo: this._activatedRoute,
                }
            )
        }
    }

    private eliminarActividad(iProgActId, iActTipoId, ixActivadadId) {
        this._aulaService
            .eliminarActividad({ iProgActId, iActTipoId, ixActivadadId })
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe({
                next: () => {
                    this.obtenerContenidoSemanas()
                },
            })
    }

    deleteTareaxiTareaid(actividad) {
        actividad.opcion = 'ELIMINARxiTareaid'
        actividad.iTareaId = actividad.ixActivadadId
        const params = {
            petition: 'post',
            group: 'aula-virtual',
            prefix: 'tareas',
            ruta: 'delete',
            data: actividad,
            params: { skipSuccessMessage: true },
        }
        this._generalService.getGralPrefix(params).subscribe({
            next: (resp) => {
                if (resp.validated) {
                    this.obtenerContenidoSemanas()
                }
            },
        })
    }
}
