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
    IActividad,
    tipoActividadesKeys,
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
    public accionSeleccionada: TActividadActions | undefined
    public contenidoSemanas = []
    // public actividades = actividadesConfigList

    private _constantesService = inject(ConstantesService)
    private _generalService = inject(GeneralService)

    @Input({ required: true }) private _iSilaboId: string

    private handleActionsMap: Record<
        string,
        (action: TActividadActions, actividad: IActividad) => void
    > = {
        tarea: this.handleTareaAction.bind(this),
        foro: this.handleForoAction.bind(this),
        evaluacion: this.handleEvaluacionAction.bind(this),
        'video-conferencia': this.handleVideoconferenciaAction.bind(this),
        material: this.handleMaterialAction.bind(this),
    }

    constructor(private _dialogService: DialogService) {}

    ngOnInit(): void {
        const today = new Date()
        const nextWeek = new Date()
        nextWeek.setDate(today.getDate() + 7)

        this.rangeDates = [today, nextWeek]

        this.generarAccionesContenido()
        this.getData()
    }

    private getData() {
        this.obtenerContenidoSemanas()
    }

    private obtenerContenidoSemanas() {
        const params = {
            petition: 'post',
            group: 'docente',
            prefix: 'contenido-semanas',
            ruta: 'list',
            seleccion: 1,
            data: {
                opcion: 'CONSULTARxiSilaboId',
                valorBusqueda: this._iSilaboId,
                iCredId: this._constantesService.iCredId,
            },
            params: {
                skipSuccessMessage: true,
            },
        }

        this._generalService.getGralPrefix(params).subscribe({
            next: (response) => {
                this.contenidoSemanas = response.data
            },
        })
    }

    generarAccionesContenido() {
        this.accionesContenido = Object.keys(actividadesConfig).map((key) => {
            const actividad = actividadesConfig[key as tipoActividadesKeys]
            return {
                label: actividad.tipoActividadNombre,
                icon: actividad.icon,
                command: () => {
                    const actionHandler =
                        this.handleActionsMap[actividad.tipoActividad]
                    if (actionHandler) {
                        actionHandler('CREAR', null)
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
        action: TActividadActions
    }) {
        this.actividadSelected = actividad
        this.accionSeleccionada = action

        if (actividad.tipoActividad === 'tarea') {
            this.handleTareaAction(action, actividad)
            return
        }

        if (actividad.tipoActividad === 'evaluacion') {
            this.handleEvaluacionAction(action, actividad)
            return
        }

        if (actividad.tipoActividad === 'foro') {
            this.handleForoAction(action, actividad)
            return
        }

        if (actividad.tipoActividad === 'video-conferencia') {
            this.handleVideoconferenciaAction(action, actividad)
            return
        }

        if (actividad.tipoActividad === 'material') {
            this.handleMaterialAction('EDITAR', actividad, 'Editar Material')
        }
    }

    handleTareaAction(action: TActividadActions, actividad: IActividad) {
        if (action === 'EDITAR') {
            const ref: DynamicDialogRef = this._dialogService.open(
                TareaFormContainerComponent,
                {
                    ...MODAL_CONFIG,
                    data: actividad,
                    header: 'Editar Actividad',
                }
            )
            ref.onClose.subscribe((result) => {
                if (result) {
                    console.log('Formulario enviado', result)
                } else {
                    console.log('Formulario cancelado')
                }
            })
        }

        if (action === 'CREAR') {
            this._dialogService.open(TareaFormContainerComponent, {
                ...MODAL_CONFIG,
                header: 'Crear Actividades de Aprendizaje',
                data: null,
            })
        }
    }

    handleVideoconferenciaAction(
        action: TActividadActions,
        actividad: IActividad
    ) {
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

    handleForoAction(action: TActividadActions, actividad: IActividad) {
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
                data: null,
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

    handleEvaluacionAction(action: TActividadActions, actividad: IActividad) {
        if (action === 'CREAR') {
            const ref = this._dialogService.open(
                EvaluacionFormContainerComponent,
                {
                    ...MODAL_CONFIG,
                    maximizable: true,
                    header: 'Crear Evaluación',
                    data: actividad,
                }
            )
            this._dialogService.getInstance(ref).maximize()
        }
    }
}
