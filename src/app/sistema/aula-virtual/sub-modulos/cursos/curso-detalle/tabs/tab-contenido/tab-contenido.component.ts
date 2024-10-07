import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { AccordionModule } from 'primeng/accordion'
import { CalendarModule } from 'primeng/calendar'
import { IconFieldModule } from 'primeng/iconfield'
import { InputIconModule } from 'primeng/inputicon'
import { InputTextModule } from 'primeng/inputtext'
import { ActividadRowComponent } from '@/app/sistema/aula-virtual/sub-modulos/actividades/components/actividad-row/actividad-row.component'
import { ActividadListaComponent } from '../../../../actividades/components/actividad-lista/actividad-lista.component'
import { IActividad } from '@/app/sistema/aula-virtual/interfaces/actividad.interface'
import { TActividadActions } from '@/app/sistema/aula-virtual/interfaces/actividad-actions.iterface'
import { DialogModule } from 'primeng/dialog'
import { MenuModule } from 'primeng/menu'
import { MenuItem } from 'primeng/api'
import { TareaFormContainerComponent } from '../../../../actividades/actividad-tarea/tarea-form-container/tarea-form-container.component'
import { VideoconferenciaContainerFormComponent } from '../../../../actividades/actividad-videoconferencia/videoconferencia-container-form/videoconferencia-container-form.component'
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
import { ForoFormContainerComponent } from '../../../../actividades/actividad-foro/foro-form-container/foro-form-container.component'
import { ActividadFormComponent } from '../../../../actividades/components/actividad-form/actividad-form.component'

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

    public actividades: IActividad[] = [
        {
            id: '1',
            tipoActividadNombre: 'Actividad',
            tipoActividad: 1,
            nombreActividad: 'Actividad I',
        },
        {
            id: '2',
            tipoActividadNombre: 'Foro',
            tipoActividad: 2,
            nombreActividad: 'Foro Debate',
        },
        {
            id: '3',
            tipoActividadNombre: 'Evaluacion',
            tipoActividad: 3,
            nombreActividad: 'Exámen Unidad',
        },
        {
            id: '4',
            tipoActividadNombre: 'Videoconferencia',
            tipoActividad: 4,
            nombreActividad: 'Reunión explicación',
        },
        {
            id: '5',
            tipoActividadNombre: 'Material',
            tipoActividad: 5,
            nombreActividad: 'Glosario',
        },
    ]

    constructor(private _dialogService: DialogService) {}

    ngOnInit(): void {
        const today = new Date()
        const nextWeek = new Date()
        nextWeek.setDate(today.getDate() + 7)

        this.rangeDates = [today, nextWeek]

        this.accionesContenido = [
            {
                label: 'Actividad',
                icon: 'matAssignment',
                command: () => {
                    this.handleTareaAction('CREAR', null)
                },
            },
            {
                label: 'Cuestionario',
                icon: 'matQuiz',
                command: () => {
                    this.handleForoAction('CREAR', null)
                },
            },
            {
                label: 'Videoconferencia',
                icon: 'matVideocam',
                command: () => {
                    this.handleVideoconferenciaAction('CREAR', null)
                },
            },
            {
                label: 'Foro',
                icon: 'matForum',
                // command: (event: MenuItemCommandEvent) => {
                command: () => {
                    this.handleForoAction('CREAR', null)
                },
            },
            {
                label: 'Material',
                icon: 'matDescription',
                command: () => {
                    this.handleMaterialAction('CREAR', null, 'Crear Material')
                },
            },
        ]
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

        if (actividad.tipoActividad === 1) {
            this.handleTareaAction(action, actividad)
            return
        }

        if (actividad.tipoActividad === 2) {
            this.handleForoAction(action, actividad)
            return
        }

        if (actividad.tipoActividad === 4) {
            this.handleVideoconferenciaAction(action, actividad)
            return
        }

        if (actividad.tipoActividad === 5) {
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
}
