import { IconComponent } from '@/app/shared/icon/icon.component'
import {
    IColumn,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'
import { ILeyendaItem } from '@/app/sistema/aula-virtual/components/leyenda-tareas/leyenda-item/leyenda-item.component'
import { LeyendaTareasComponent } from '@/app/sistema/aula-virtual/components/leyenda-tareas/leyenda-tareas.component'
import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { provideIcons } from '@ng-icons/core'
import { matListAlt, matPeople } from '@ng-icons/material-icons/baseline'
import { ButtonModule } from 'primeng/button'
import { TabViewModule } from 'primeng/tabview'

@Component({
    selector: 'app-tarea-room',
    standalone: true,
    imports: [
        CommonModule,
        IconComponent,
        TabViewModule,
        ButtonModule,
        TablePrimengComponent,
        LeyendaTareasComponent,
    ],
    templateUrl: './tarea-room.component.html',
    styleUrl: './tarea-room.component.scss',
    providers: [provideIcons({ matListAlt, matPeople })],
})
export class TareaRoomComponent {
    public leyendaTareas: ILeyendaItem[] = [
        {
            color: 'bg-red-100',
            total: 3,
            nombre: 'Faltan',
        },
        {
            color: 'bg-yellow-100',
            total: 20,
            nombre: 'En Proceso',
        },
        {
            color: 'bg-green-100',
            total: 3,
            nombre: 'Enviados',
        },
    ]
    columnas: IColumn[] = [
        {
            field: 'cActividad',
            header: '#',
            text: 'actividad',
            text_header: 'center',
            width: '3rem',
            type: 'text',
        },
        {
            field: 'cActividad',
            header: 'Estudiantes',
            text: 'actividad',
            text_header: 'center',
            width: '5rem',
            type: 'text',
        },

        {
            field: 'cActividad',
            header: 'Estado',
            text: 'Estado',
            text_header: 'center',
            width: '5rem',
            type: 'text',
        },

        {
            field: 'cActividad',
            header: 'Nota',
            text: 'actividad',
            text_header: 'center',
            width: '5rem',
            type: 'text',
        },
    ]
}
