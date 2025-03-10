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
    iGrupoId: number
    iSedeId: string = ''
    iIieeId: string = ''
    iYAcadId: string = ''
    cGrupoNombre: string
    cGrupoDescripcion: string
    visible = false
    grupo: string
    data = []
    miembros = []
    estadoEditar: boolean = true
    estadoGuardar: boolean = false
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
    actualizarDatosGrupo() {
        const params = {
            petition: 'post',
            group: 'com',
            prefix: 'miembros',
            ruta: 'actualizar_grupo',
            data: {
                iPersId: this.iPersId,
                iGrupoId: this.iGrupoId,
                cGrupoNombre: this.cGrupoNombre,
                cGrupoDescripcion: this.cGrupoDescripcion,
                miembros: JSON.stringify(this.miembros),
            },
        }
        this.getInformation(params, 'actualizarGrupo')
    }
    editarGrupo(id: number, nombre: string, descripcion: string, grupo: any[]) {
        this.iGrupoId = id
        this.cGrupoNombre = nombre
        this.cGrupoDescripcion = descripcion
        const convertir = grupo.toString()
        const jsonGrupo = JSON.parse(convertir)
        this.miembros = jsonGrupo
        this.estadoEditar = false
        this.estadoGuardar = true
    }
    // eliminarGrupo(id: string){
    //     console.log(id)
    // }

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
                iPersId: this.iPersId,
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
    // filtramos las 2 tablas para que no haya repetidos al momento de registrar nuevos miembros
    filtrarGrupo() {
        const capturarId = this.miembros.map((item) => item.id)
        const buscarMiembros = new Set(capturarId)
        this.data = this.data.filter((items) => !buscarMiembros.has(items.id))
    }
    accionBtnItem(event): void {
        const { accion } = event
        const { item } = event

        switch (accion) {
            case 'obtenerMiembros':
                this.data = []
                const json_datos = item
                this.data = JSON.parse(json_datos[0]['miembroGrupo'])
                this.filtrarGrupo()

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
            case 'actualizarGrupo':
                this.iPersId = undefined
                this.iGrupoId = undefined
                this.cGrupoNombre = ''
                this.cGrupoDescripcion = ''
                this.miembros = []
                this.estadoGuardar = false
                this.estadoEditar = true
                this.obtenerGrupos()
                break
        }
    }
}
