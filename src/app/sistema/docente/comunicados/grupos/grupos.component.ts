import { Component, OnInit, inject } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { FormsModule } from '@angular/forms'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { GeneralService } from '@/app/servicios/general.service'
import { MessageService } from 'primeng/api'
@Component({
    selector: 'app-grupos',
    standalone: true,
    imports: [PrimengModule, FormsModule, TablePrimengComponent],
    templateUrl: './grupos.component.html',
    styleUrl: './grupos.component.scss',
})
export class GruposComponent implements OnInit {
    private GeneralService = inject(GeneralService)
    constructor(
        private ConstantesService: ConstantesService,
        private messageService: MessageService
    ) {
        this.iSedeId = this.ConstantesService.iSedeId
        this.iIieeId = this.ConstantesService.iIieeId
        this.iYAcadId = this.ConstantesService.iYAcadId
        this.iPersId = this.ConstantesService.iPersId
    }
    miembrosAgregados = []
    iPersId: number
    iSedeId: string = ''
    iIieeId: string = ''
    iYAcadId: string = ''
    cGrupoNombre: string
    cGrupoDescripcion: string
    visible = false
    grupo: string
    data: any = []
    miembros: any = []
    columna = [
        {
            type: 'actions',
            width: '1rem',
            field: 'iEliminado',
            header: 'Elegir',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'item',
            width: '1rem',
            field: 'cItem',
            header: '#',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '1rem',
            field: 'documento',
            header: 'Documento',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '1rem',
            field: 'completos',
            header: 'Apellidos y Nombres',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '1rem',
            field: 'contacto',
            header: 'Numero Telf. del Contacto',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '1rem',
            field: 'domicilio',
            header: 'Direccion Domiciliaria',
            text_header: 'center',
            text: 'center',
        },
    ]
    columnaModal = [
        {
            type: 'actions',
            width: '1rem',
            field: 'iSeleccionado',
            header: 'Elegir',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'item',
            width: '1rem',
            field: 'cItem',
            header: '#',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '1rem',
            field: 'documento',
            header: 'Documento',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '1rem',
            field: 'completos',
            header: 'Apellidos y Nombres',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '1rem',
            field: 'contacto',
            header: 'Numero Telf. del Contacto',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '1rem',
            field: 'domicilio',
            header: 'Direccion Domiciliaria',
            text_header: 'center',
            text: 'center',
        },
    ]
    accion = [
        {
            labelTooltip: 'Seleccionar',
            icon: 'pi pi-user-minus',
            accion: 'setearDataxiEliminado',
            type: 'item',
            class: 'p-button-rounded p-button-success p-button-text',
        },
    ]

    accionModal = [
        {
            labelTooltip: 'Seleccionar',
            icon: 'pi pi-user-plus',
            accion: 'setearDataxiSeleccionado',
            type: 'item',
            class: 'p-button-rounded p-button-success p-button-text',
        },
    ]

    cities = [
        { grupo: 'Estudiantes', codigo: 1 },
        { grupo: 'Docentes', codigo: 2 },
    ]

    ngOnInit() {
        this.obtenerGrupos()
    }

    obtenerGrupos() {
        const params = {
            petition: 'post',
            group: 'com',
            prefix: 'miembros',
            ruta: 'obtener_grupos',
            data: {
                iPersId: this.iPersId,
            },
        }
        this.getInformation(params, 'obtenerGrupos')
    }

    mostrarModal() {
        this.visible = !this.visible
    }

    mostrarDocentes() {
        if (this.grupo) {
            this.obtenerMiembros(this.grupo['codigo'])
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Advertencia',
                detail: 'Debe Seleccionar Tipo de Persona',
            })
        }
    }

    obtenerMiembros(opcion: number | string) {
        const params = {
            petition: 'post',
            group: 'com',
            prefix: 'miembros',
            ruta: 'obtener_miembros',
            data: {
                opcion: opcion,
                iIieeId: this.iIieeId,
                iYAcadId: this.iYAcadId,
                iSedeId: this.iSedeId,
            },
        }
        this.getInformation(params, 'obtenerMiembros')
    }
    guardarMiembros() {
        const params = {
            petition: 'post',
            group: 'com',
            prefix: 'miembros',
            ruta: 'guardar_miembros',
            data: {
                iPersId: this.iPersId,
                cGrupoNombre: this.cGrupoNombre,
                cGrupoDescripcion: this.cGrupoDescripcion,
                miembros: JSON.stringify(this.miembros),
            },
        }
        this.getInformation(params, 'guardarMiembros')
    }

    getInformation(params, accion) {
        this.GeneralService.getGralPrefix(params).subscribe({
            next: (response: any) => {
                this.accionBtnItem({ accion, item: response?.data })
            },
            complete: () => {},
        })
    }
    accionBtnItem(event): void {
        const { accion } = event
        const { item } = event

        switch (accion) {
            case 'obtenerMiembros':
                this.data = []
                if (this.data == false) {
                    this.data = item
                } else {
                    const buscarMiembros = new Set(this.miembros)
                    this.data = this.data.filter(
                        (elemento) => !buscarMiembros.has(elemento)
                    )
                }

                break
            case 'guardarMiembros':
                this.miembrosAgregados = this.miembrosAgregados.concat(item)
                break
            case 'setearDataxiSeleccionado':
                this.miembros = this.miembros.concat(item)
                this.data = this.data.filter((elemento) => elemento != item)
                this.messageService.add({
                    severity: 'info',
                    summary: 'Info',
                    detail: 'Se agrego a : ' + item['completos'],
                })

                break
            case 'setearDataxiEliminado':
                item['iSeleccionado'] = 0
                this.data = this.data.concat(item)
                this.miembros = this.miembros.filter(
                    (elemento) => elemento != item
                )

                break
            case 'obtenerGrupos':
                this.miembrosAgregados = item
                break
        }
    }
}
