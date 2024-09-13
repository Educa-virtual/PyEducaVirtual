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
    ],
    templateUrl: './tab-contenido.component.html',
    styleUrl: './tab-contenido.component.scss',
})
export class TabContenidoComponent implements OnInit {
    rangeDates: Date[] | undefined

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
    ]

    ngOnInit(): void {
        const today = new Date()
        const nextWeek = new Date()
        nextWeek.setDate(today.getDate() + 7)

        this.rangeDates = [today, nextWeek]
    }
}
