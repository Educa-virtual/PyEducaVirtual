import {
    Component,
    EventEmitter,
    Input,
    Output,
    OnInit,
    OnChanges,
    SimpleChanges,
} from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { DialogModule } from 'primeng/dialog'
import { Usuario } from '../interfaces/usuario.interface'
import { MessageService } from 'primeng/api'
import { UsuariosService } from '../services/usuarios.service'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { PerfilAsignado } from '../interfaces/perfil-asignado.interface'

interface Institucion {
    nombre: string
    codigo: string
}

interface Nivel {
    nombre: string
    codigo: string
}

interface Modulo {
    nombre: string
    codigo: string
}

interface Rol {
    nombre: string
    codigo: string
}

/*interface AsignacionRol {
    id: number
    rol: string
    nivel: string
    institucion: string
    fechaAsignacion: string
}*/

@Component({
    selector: 'app-editar-perfil',
    standalone: true,
    imports: [PrimengModule, DialogModule],
    templateUrl: './editar-perfil.component.html',
    styleUrls: ['./editar-perfil.component.scss'],
})
export class EditarPerfilComponent implements OnInit, OnChanges {
    @Input() visible: boolean = false
    @Input() usuario: Usuario = null
    @Output() visibleChange = new EventEmitter<boolean>()
    //@Output() perfilesAsignados = new EventEmitter<any>()
    dataPerfilesUsuario: any[] = []

    instituciones: Institucion[] = []
    niveles: Nivel[] = []
    modulos: Modulo[] = []
    roles: Rol[] = []

    institucionSeleccionada: Institucion | null = null
    nivelSeleccionado: Nivel | null = null
    moduloSeleccionado: Modulo | null = null
    perfilSeleccionado: PerfilAsignado | null = null

    // Propiedades para el diálogo

    ngOnInit() {
        this.inicializarDatos()
    }

    constructor(
        private messageService: MessageService,
        private usuariosService: UsuariosService,
        private confirmationModalService: ConfirmationModalService
    ) {}

    obtenerPerfilesUsuario() {
        this.usuariosService
            .obtenerPerfilesUsuario(this.usuario.iCredId)
            .subscribe({
                next: (respuesta: any) => {
                    this.dataPerfilesUsuario = respuesta.data
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Problema al obtener perfiles',
                        detail: error,
                    })
                },
            })
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['visible'] && changes['visible'].currentValue === true) {
            this.inicializarDatos()
            this.obtenerPerfilesUsuario()
        }
    }

    preguntarEliminarPerfil(perfil: PerfilAsignado) {
        this.confirmationModalService.openConfirm({
            header: 'Restablecer contraseña',
            message: `El perfil ${perfil.cPerfilNombre} será eliminado del usuario, ¿desea continuar?`,
            accept: () => {
                this.eliminarPerfil(perfil.iCredEntPerfId)
            },
        })
    }

    eliminarPerfil(iCredEntPerfId: number) {
        this.usuariosService
            .eliminarPerfilUsuario(this.usuario.iCredId, iCredEntPerfId)
            .subscribe({
                next: (respuesta: any) => {
                    this.dataPerfilesUsuario = this.dataPerfilesUsuario.filter(
                        (item) => item.iCredEntPerfId !== iCredEntPerfId
                    )
                    this.usuario.iCantidadPerfiles =
                        this.dataPerfilesUsuario.length
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Perfil eliminado',
                        detail: respuesta.message,
                    })
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Problema al eliminar perfil',
                        detail: error,
                    })
                },
            })
    }

    cerrarDialog() {
        /*this.perfilesAsignados.emit({
            cantidad: this.dataPerfilesUsuario.length,
        })*/

        this.visibleChange.emit(false)
    }

    inicializarDatos() {
        this.instituciones = [
            { nombre: 'I.E. Rafael Díaz', codigo: 'RAF' },
            { nombre: 'I.E. Simón Bolívar', codigo: 'SIM' },
        ]

        this.niveles = [
            { nombre: 'Primario', codigo: 'PRI' },
            { nombre: 'Secundario', codigo: 'SEC' },
            { nombre: 'Superior', codigo: 'SUP' },
        ]

        this.modulos = [
            { nombre: 'I.E. Rafael Díaz', codigo: 'RAF' },
            { nombre: 'I.E. Simón Bolívar', codigo: 'SIM' },
        ]

        this.roles = [
            { nombre: 'Docente', codigo: 'DOC' },
            { nombre: 'Estudiante', codigo: 'EST' },
            { nombre: 'Director', codigo: 'DIR' },
        ]

        /*if (this.personalData) {
            c*onsole.log('Cargando datos del usuario:', this.personalData)
        }*/

        /*this.asignaciones = [
            {
                id: 1,
                rol: 'Docente',
                nivel: 'Secundario',
                institucion: 'I.E. Rafael Díaz',
                fechaAsignacion: '04/07/2024',
            },
            {
                id: 2,
                rol: 'Estudiante',
                nivel: 'Superior',
                institucion: 'I.E. Simón Bolívar',
                fechaAsignacion: '04/07/2024',
            },
            {
                id: 3,
                rol: 'Director',
                nivel: 'Secundario',
                institucion: 'I.E. Rafael Díaz',
                fechaAsignacion: '04/07/2024',
            },
        ]*/
    }

    agregarAsignacion() {
        /*if (
            this.rolSeleccionado &&
            this.nivelSeleccionado &&
            this.institucionSeleccionada
        ) {
            const nuevoId =
                this.asignaciones.length > 0
                    ? Math.max(...this.asignaciones.map((a) => a.id)) + 1
                    : 1

            const nuevaAsignacion: AsignacionRol = {
                id: nuevoId,
                rol: this.rolSeleccionado.nombre,
                nivel: this.nivelSeleccionado.nombre,
                institucion: this.institucionSeleccionada.nombre,
                fechaAsignacion: '',
            }

            this.asignaciones = [...this.asignaciones, nuevaAsignacion]

            this.rolSeleccionado = null
        } else {
            console.error('Falta seleccionar algún campo')
        }*/
    }

    /*closeDialog() {
        this.visible = false
        this.visibleChange.emit(false)
    }*/

    /*guardarCambios() {
        this.rolAsignado.emit({
            //asignaciones: this.asignaciones,
            //personalData: this.personalData,
        })

        // Cerrar el diálogo
        this.closeDialog()
    }*/
}
