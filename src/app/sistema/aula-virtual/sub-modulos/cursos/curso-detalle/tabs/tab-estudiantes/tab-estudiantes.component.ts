import { IEstudiante } from '@/app/sistema/aula-virtual/interfaces/estudiantes.interface'
import { Component, Input, OnInit, inject } from '@angular/core'
import { AvatarModule } from 'primeng/avatar'
import { ListboxModule } from 'primeng/listbox'
import { TableModule } from 'primeng/table'
import { FormsModule } from '@angular/forms'
import { GeneralService } from '@/app/servicios/general.service'
import { TabViewModule } from 'primeng/tabview'
import { PrimengModule } from '@/app/primeng.module'
import {
    IActionTable,
    IColumn,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'

@Component({
    selector: 'app-tab-estudiantes',
    standalone: true,
    imports: [
        TablePrimengComponent,
        ListboxModule,
        AvatarModule,
        TableModule,
        FormsModule,
        TabViewModule,
        PrimengModule,
    ],
    templateUrl: './tab-estudiantes.component.html',
    styleUrl: './tab-estudiantes.component.scss',
})
export class TabEstudiantesComponent implements OnInit {
    @Input({ required: true }) estudiantes: IEstudiante[] = []
    private GeneralService = inject(GeneralService)

    // estudiantes: any[] = [];
    estudianteSeleccionado: number = null
    estadoCheckbox: boolean = false

    public columnasTabla: IColumn[] = [
        {
            type: 'text',
            width: '5rem',
            field: 'index',
            header: 'Nro',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '10rem',
            field: 'nombrecompleto',
            header: 'Nombres',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'actions',
            width: '1rem',
            field: '',
            header: 'Acciones',
            text_header: 'left',
            text: 'left',
        },
    ]
    public accionesTabla: IActionTable[] = [
        {
            labelTooltip: 'Eliminar',
            icon: 'pi pi-trash',
            accion: 'eliminar',
            type: 'item',
            class: 'p-button-rounded p-button-danger p-button-text',
        },
        {
            labelTooltip: 'Editar',
            icon: 'pi pi-pencil',
            accion: 'editar',
            type: 'item',
            class: 'p-button-rounded p-button-warning p-button-text',
        },
    ]

    ngOnInit() {
        this.getEstudiantesMatricula()
    }

    // changeEstadoCheckbox() {
    //     this.estadoCheckbox = !this.estadoCheckbox
    //     this.estudiantes.map((i) => (i.iCheckbox = this.estadoCheckbox))
    // }
    getEstudiantesMatricula() {
        const params = {
            petition: 'post',
            group: 'aula-virtual',
            prefix: 'matricula',
            ruta: 'list',
            data: {
                opcion: 'CONSULTAR-ESTUDIANTESxiSemAcadIdxiYAcadIdxiCurrId',
                iSemAcadId:
                    '2jdp2ERVe0QYG8agql5J1ybONbOMzW93KvLNZ7okAmD4xXBrwe',
                iYAcadId: '2jdp2ERVe0QYG8agql5J1ybONbOMzW93KvLNZ7okAmD4xXBrwe',
                iCurrId: '2jdp2ERVe0QYG8agql5J1ybONbOMzW93KvLNZ7okAmD4xXBrwe',
            },
            params: { skipSuccessMessage: true },
        }
        console.log(this.getInformation)

        this.getInformation(params)
    }
    getInformation(params) {
        this.GeneralService.getGralPrefix(params).subscribe({
            next: (response) => {
                console.log(response)

                this.estudiantes = response.data.map((estudiante, index) => ({
                    index: index + 1,
                    nombrecompleto: estudiante.nombrecompleto,
                }))
            },
            complete: () => {},
            error: (error) => {
                console.log(error)
            },
        })
    }

    // Método para editar un estudiante
    onEdit(estudiante: any) {
        console.log('Editar estudiante:', estudiante)
        // Aquí puedes implementar la lógica para abrir un formulario o modal para editar
    }

    // Método para eliminar un estudiante
    onDelete(estudiante: any) {
        console.log('Eliminar estudiante:', estudiante)
        // Aquí puedes implementar la lógica para eliminar el estudiante
        // Por ejemplo, podrías hacer una confirmación antes de eliminar
    }
}
