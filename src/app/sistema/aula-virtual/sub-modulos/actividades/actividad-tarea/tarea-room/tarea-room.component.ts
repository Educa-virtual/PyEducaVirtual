import { IconComponent } from '@/app/shared/icon/icon.component'
import {
    IColumn,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'
import {
    ILeyendaItem,
    LeyendaItemComponent,
} from '@/app/sistema/aula-virtual/sub-modulos/actividades/components/leyenda-tareas/leyenda-item/leyenda-item.component'
import { LeyendaTareasComponent } from '@/app/sistema/aula-virtual/sub-modulos/actividades/components/leyenda-tareas/leyenda-tareas.component'
import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { provideIcons } from '@ng-icons/core'
import { matListAlt, matPeople } from '@ng-icons/material-icons/baseline'
import { ButtonModule } from 'primeng/button'
import { DialogService } from 'primeng/dynamicdialog'
import { TabViewModule } from 'primeng/tabview'
import { CalificarTareaFormComponent } from '../calificar-tarea-form/calificar-tarea-form.component'
import { MODAL_CONFIG } from '@/app/shared/constants/modal.config'
import { PrimengModule } from '@/app/primeng.module'
import { FileUploadPrimengComponent } from '../../../../../../shared/file-upload-primeng/file-upload-primeng.component'
import { FormGrupoComponent } from '../form-grupo/form-grupo.component'

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
        LeyendaItemComponent,
        PrimengModule,
        FileUploadPrimengComponent,
        FormGrupoComponent,
    ],
    templateUrl: './tarea-room.component.html',
    styleUrl: './tarea-room.component.scss',
    providers: [provideIcons({ matListAlt, matPeople }), DialogService],
})
export class TareaRoomComponent {
    private _dialogService = inject(DialogService)
    showModal: boolean = false
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
            iGrupo: '1',
            cEstado: 'F',
            iCheckbox: false,
        },
        {
            id: 1,
            nombre: 'Luis Alvarez',
            iGrupo: '-',
            cEstado: 'C',
            iCheckbox: false,
        },
        {
            id: 2,
            nombre: 'Hermione Salazar',
            iGrupo: '1',
            cEstado: 'C',
            iCheckbox: false,
        },
        {
            id: 3,
            nombre: 'Henrry Velasquez',
            iGrupo: '-',
            cEstado: 'P',
            iCheckbox: false,
        },
        {
            id: 4,
            nombre: 'Karla Casas',
            iGrupo: '1',
            cEstado: 'F',
            iCheckbox: false,
        },
        {
            id: 5,
            nombre: 'Danica Lobo',
            iGrupo: '2',
            cEstado: 'F',
            iCheckbox: false,
        },
        {
            id: 6,
            nombre: 'Alexander Jaramillo',
            iGrupo: '1',
            cEstado: 'F',
            iCheckbox: false,
        },
        {
            id: 7,
            nombre: 'Mariley Cruz',
            iGrupo: '2',
            cEstado: 'P',
            iCheckbox: false,
        },
        {
            id: 8,
            nombre: 'Ernesto Paúcar',
            iGrupo: '1',
            cEstado: 'F',
            iCheckbox: false,
        },
        {
            id: 9,
            nombre: 'Stefano Rebagliati',
            iGrupo: '-',
            cEstado: 'C',
            iCheckbox: false,
        },
    ]

    estadoCheckbox: boolean = false
    changeEstadoCheckbox() {
        this.estadoCheckbox = !this.estadoCheckbox
        this.estudiantes.map((i) => (i.iCheckbox = this.estadoCheckbox))
    }

    documentos = [
        {
            iDocumentoId: '1',
            url: '',
            cDocumento: 'Proyecto Virtual',
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

    public accionBtnItem(elemento) {
        const { accion } = elemento
        // const { item } = elemento
        switch (accion) {
            case 'calificar':
                this._dialogService.open(CalificarTareaFormComponent, {
                    ...MODAL_CONFIG,
                    header: 'Calificar Actividad',
                })
                break
            case 'close-modal':
                this.showModal = false
                break
            default:
                break
        }
    }

    ngOninit() {}

    estudianteSeleccionado: number = null
    getTareaRealizada(item) {
        console.log(item)
        this.estudianteSeleccionado = item.id
    }
}
