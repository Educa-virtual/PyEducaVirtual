import { CommonModule } from '@angular/common'
import { Component, inject, OnInit } from '@angular/core'
import { FormBuilder, FormsModule } from '@angular/forms'
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
import { MenuItem, MenuItemCommandEvent } from 'primeng/api'
import { TareaFormContainerComponent } from '../../../../actividades/actividad-tarea/tarea-form-container/tarea-form-container.component'

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
    ],
    templateUrl: './tab-contenido.component.html',
    styleUrl: './tab-contenido.component.scss',
})
export class TabContenidoComponent implements OnInit {
    public actividadDialogVisibildad: boolean = false
    public rangeDates: Date[] | undefined
    public accionesContenido: MenuItem[]

    private _formBuilder = inject(FormBuilder)

    public tareaForm = this._formBuilder.group({
        name: [''],
        description: [''],
    })

    public actividades: IActividad[] = [
        {
            id: '1',
            tipoActividadNombre: 'Tarea',
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

    ngOnInit(): void {
        const today = new Date()
        const nextWeek = new Date()
        nextWeek.setDate(today.getDate() + 7)

        this.rangeDates = [today, nextWeek]

        this.accionesContenido = [
            {
                label: 'Editar',
                icon: 'pi pi-pencil',
                command: (event: MenuItemCommandEvent) => {
                    event.originalEvent.stopPropagation()
                },
            },
        ]
    }

    hideDialog() {
        this.actividadDialogVisibildad = false
    }

    actionSelected(event: {
        actividad: IActividad
        action: TActividadActions
    }) {
        this.actividadDialogVisibildad = true
        console.log(event)
    }
}
