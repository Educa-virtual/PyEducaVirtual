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
import { Component, inject, Input, OnChanges } from '@angular/core'
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
import { GeneralService } from '@/app/servicios/general.service'
import { ModalPrimengComponent } from '../../../../../../shared/modal-primeng/modal-primeng.component'

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
        ModalPrimengComponent,
    ],
    templateUrl: './tarea-room.component.html',
    styleUrl: './tarea-room.component.scss',
    providers: [provideIcons({ matListAlt, matPeople }), DialogService],
})
export class TareaRoomComponent implements OnChanges {
    @Input() iTareaId: string

    private _dialogService = inject(DialogService)
    private GeneralService = inject(GeneralService)

    ngOnChanges(changes) {
        if (changes.iTareaId?.currentValue) {
            this.iTareaId = changes.iTareaId.currentValue
            this.getTareasxiTareaid()
        }
    }
    showModal: boolean = false
    estudiantes = []
    grupos = []
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
    data
    grupoSeleccionado
    cTareaDescripcion: string
    tareaAsignar: number
    FilesTareas = []
    tareaOptions = [
        { name: 'Individual', value: 0 },
        { name: 'Grupal', value: 1 },
    ]

    getInformation(params, condition) {
        this.GeneralService.getGralPrefix(params).subscribe({
            next: (response) => {
                this.accionBtnItem({ accion: condition, item: response.data })
            },
            complete: () => {},
            error: (error) => {
                console.log(error)
            },
        })
    }

    estadoCheckbox: boolean = false

    changeEstadoCheckbox() {
        this.estadoCheckbox = !this.estadoCheckbox
        //this.estudiantes.map((i) => (i.iCheckbox = this.estadoCheckbox))
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
        const { item } = elemento
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
            case 'get-tarea-estudiantes':
                this.estudiantes = item
                break
            case 'update-tareas':
                !this.tareaAsignar
                    ? this.getTareaEstudiantes()
                    : this.getTareaCabeceraGrupos()

                break
            case 'get-tarea-cabecera-grupos':
                this.grupos = item
                this.grupos.forEach((i) => {
                    i.json_estudiantes = i.json_estudiantes
                        ? JSON.parse(i.json_estudiantes)
                        : []
                    i.json_estudiantes_respaldo = i.json_estudiantes
                })

                this.grupos.forEach((i) => {
                    i.json_estudiantes = i.json_estudiantes.filter(
                        (j) => j.bAsignado === 1
                    )
                })

                break
            case 'save-tarea-cabecera-grupos':
                this.showModal = false
                !this.tareaAsignar
                    ? this.getTareaEstudiantes()
                    : this.getTareaCabeceraGrupos()
                break
            case 'get-tareas':
                this.data = item.length ? item[0] : []
                this.cTareaDescripcion = this.data?.cTareaDescripcion
                this.FilesTareas = this.data?.cTareaArchivoAdjunto
                    ? JSON.parse(this.data?.cTareaArchivoAdjunto)
                    : []
                this.tareaAsignar = Number(this.data?.bTareaEsGrupal)
                this.tareaAsignar !== null
                    ? this.accionBtnItem({
                          accion: 'save-tarea-cabecera-grupos',
                          item: [],
                      })
                    : null

                break
            default:
                break
        }
    }

    ngOninit() {}

    estudianteSeleccionado
    getTareaRealizada(item) {
        console.log(item)
        this.estudianteSeleccionado = item
    }

    updateTareas() {
        const params = {
            petition: 'post',
            group: 'aula-virtual',
            prefix: 'tareas',
            ruta: 'updatexiTareaId',
            data: {
                opcion: 'ACTUALIZARxiTareaId',
                iTareaId: this.iTareaId,
                bTareaEsGrupal: this.tareaAsignar ? true : false,
            },
            params: { skipSuccessMessage: true },
        }
        this.getInformation(params, 'update-tareas')
    }

    getTareaEstudiantes() {
        const params = {
            petition: 'post',
            group: 'aula-virtual',
            prefix: 'tarea-estudiantes',
            ruta: 'list',
            data: {
                opcion: 'CONSULTAR-ASIGNACIONxiTareaId',
                iTareaId: this.iTareaId,
            },
            params: { skipSuccessMessage: true },
        }
        this.getInformation(params, 'get-' + params.prefix)
    }

    getTareaCabeceraGrupos() {
        const params = {
            petition: 'post',
            group: 'aula-virtual',
            prefix: 'tarea-cabecera-grupos',
            ruta: 'list',
            data: {
                opcion: 'CONSULTAR-ASIGNACIONxiTareaId',
                iTareaId: this.iTareaId,
            },
            params: { skipSuccessMessage: true },
        }
        this.getInformation(params, 'get-' + params.prefix)
    }

    getTareasxiTareaid() {
        const params = {
            petition: 'post',
            group: 'aula-virtual',
            prefix: 'tareas',
            ruta: 'list',
            data: {
                opcion: 'CONSULTARxiTareaId',
                iTareaId: this.iTareaId,
            },
            params: { skipSuccessMessage: true },
        }
        this.getInformation(params, 'get-' + params.prefix)
    }
}
