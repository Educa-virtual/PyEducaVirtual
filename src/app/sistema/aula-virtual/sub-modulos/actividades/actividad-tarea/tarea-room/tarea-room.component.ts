import { IconComponent } from '@/app/shared/icon/icon.component'
import {
    IColumn,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'
import { ILeyendaItem } from '@/app/sistema/aula-virtual/components/leyenda-tareas/leyenda-item/leyenda-item.component'
import { LeyendaTareasComponent } from '@/app/sistema/aula-virtual/components/leyenda-tareas/leyenda-tareas.component'
import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { provideIcons } from '@ng-icons/core'
import { matListAlt, matPeople } from '@ng-icons/material-icons/baseline'
import { ButtonModule } from 'primeng/button'
import { DialogService } from 'primeng/dynamicdialog'
import { TabViewModule } from 'primeng/tabview'
import { CalificarTareaFormComponent } from '../calificar-tarea-form/calificar-tarea-form.component'
import { MODAL_CONFIG } from '@/app/shared/constants/modal.config'

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
    providers: [provideIcons({ matListAlt, matPeople }), DialogService],
})
export class TareaRoomComponent {
    private _dialogService = inject(DialogService)
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
            field: 'id',
            header: '#',
            text: 'actividad',
            text_header: 'left',
            width: '3rem',
            type: 'text',
        },
        {
            field: 'nombre',
            header: 'Estudiantes',
            text: 'actividad',
            text_header: 'left',
            width: '5rem',
            type: 'text',
        },

        {
            field: 'cActividad',
            header: 'Estado',
            text: 'Estado',
            text_header: 'left',
            width: '5rem',
            type: 'text',
        },

        {
            field: 'cActividad',
            header: 'Nota',
            text: 'actividad',
            text_header: 'left',
            width: '5rem',
            type: 'text',
        },

        {
            field: '',
            header: 'Acciones',
            text: '',
            text_header: 'left',
            width: '5rem',
            type: 'actions',
        },
    ]

    public estudiantes = [
        {
            id: 0,
            nombre: 'Pedro Perez',
        },
    ]

    public acciones = [
        {
            labelTooltip: 'Agregar',
            icon: 'pi pi-plus',
            accion: 'calificar',
            type: 'item',
            class: 'p-button-rounded p-button-primary p-button-text',
        },
    ]

    public accionBtnItem(event) {
        if (event.accion === 'calificar') {
            console.log('agregar')
            this._dialogService.open(CalificarTareaFormComponent, {
                ...MODAL_CONFIG,
                header: 'Calificar Tarea',
            })
        }
    }

    ngOninit() {}
}
