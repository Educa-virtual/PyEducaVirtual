import { PrimengModule } from '@/app/primeng.module'
import { Component } from '@angular/core'
import { LazyLoadEvent, MenuItem, MessageService } from 'primeng/api'
import { UsuariosService } from '../services/usuarios.service'
import { HttpParams } from '@angular/common/http'
import { debounceTime, Subject } from 'rxjs'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { EditarPerfilComponent } from '../editar-perfil/editar-perfil.component'
import { Usuario } from '../interfaces/usuario.interface'

@Component({
    selector: 'app-lista-usuarios',
    standalone: true,
    imports: [PrimengModule, EditarPerfilComponent],
    templateUrl: './lista-usuarios.component.html',
    styleUrl: './lista-usuarios.component.scss',
})
export class ListaUsuariosComponent {
    private searchChanged: Subject<void> = new Subject<void>()
    private lastLazyEvent: LazyLoadEvent | undefined
    dataUsuarios: Usuario[] = []
    totalDataUsuarios: number = 0

    fechaServidor: Date
    listaBotones: MenuItem[]
    loading = false

    usuarioSeleccionado: Usuario | null = null
    breadCrumbItems: MenuItem[]
    breadCrumbHome: MenuItem

    modalAsignarRolVisible: boolean = false
    modalAgregarPersonalVisible: boolean = false
    modalPersonalVisible: boolean = false
    criterioBusqueda: string = ''
    selectedPersonal: Usuario | null = null
    opcionesBusqueda: any[] = []
    opcionBusquedaSeleccionada: any
    filtrosInstituciones: any[] = []
    filtroInstitucionSeleccionada: any
    filtrosRoles: any[] = []
    filtroPerfilSeleccionado: any

    constructor(
        private messageService: MessageService,
        private usuariosService: UsuariosService,
        private confirmationModalService: ConfirmationModalService
    ) {
        this.breadCrumbItems = [
            {
                label: 'Gestión de usuarios',
            },
        ]
        this.breadCrumbHome = {
            icon: 'pi pi-home',
            routerLink: '/',
        }

        this.opcionesBusqueda = [
            { name: 'Documento', code: 'documento' },
            { name: 'Apellidos', code: 'apellidos' },
            { name: 'Nombres', code: 'nombres' },
        ]
        this.opcionBusquedaSeleccionada = this.opcionesBusqueda[0]
        this.filtrosInstituciones = [
            { name: 'Dremo', code: 'dremo' },
            { name: 'UGEL', code: 'ugel' },
            { name: 'Institución', code: 'institucion' },
        ]
        this.filtroInstitucionSeleccionada = this.filtrosInstituciones[0]
        this.filtrosRoles = [
            { name: 'Todos', code: 'todos' },
            { name: 'Activos', code: 'activos' },
            { name: 'Inactivos', code: 'inactivos' },
        ]
        this.filtroPerfilSeleccionado = this.filtrosRoles[0]

        this.listaBotones = [
            {
                label: 'Restablecer contraseña',
                command: () => {
                    this.preguntarCambiarClave(this.usuarioSeleccionado)
                },
            },
        ]
        // Configurar debounce para el input
        this.searchChanged.pipe(debounceTime(400)).subscribe(() => {
            if (this.lastLazyEvent) {
                this.loadUsuariosLazy(this.lastLazyEvent) // reutiliza último evento
            }
        })
    }

    cambioOpcionBusqueda() {
        if (this.criterioBusqueda != '') {
            this.loadUsuariosLazy(this.lastLazyEvent)
        }
    }

    cambioCriterioBusqueda() {
        this.searchChanged.next() // activa debounce
    }

    usuarioExpirado(fechaCaducidadString: string) {
        const fechaCaducidad = new Date(fechaCaducidadString)
        return fechaCaducidad < this.fechaServidor
    }

    obtenerListaUsuarios(params: any) {
        this.usuariosService.obtenerListaUsuarios(params).subscribe({
            next: (respuesta: any) => {
                this.totalDataUsuarios = respuesta.data.totalFilas
                this.dataUsuarios = respuesta.data.dataUsuarios
                this.fechaServidor = new Date(respuesta.data.fechaServidor)
                this.loading = false
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Problema al obtener usuarios',
                    detail: error,
                })
            },
        })
    }

    loadUsuariosLazy(event: any) {
        this.lastLazyEvent = event
        this.loading = true
        const params = new HttpParams()
            .set('offset', event.first)
            .set('limit', event.rows)
            .set(
                'opcionBusquedaSeleccionada',
                this.opcionBusquedaSeleccionada.code
            )
            .set('criterioBusqueda', this.criterioBusqueda)
            .set(
                'filtroInstitucionSeleccionada',
                this.filtroInstitucionSeleccionada.code
            )
            .set('filtroPerfilSeleccionado', this.filtroPerfilSeleccionado.code)
        this.obtenerListaUsuarios(params)
    }

    agregarNuevoPersonal() {
        this.usuarioSeleccionado = null
        this.modalAgregarPersonalVisible = true
    }

    editarPerfilesUsuario(usuario: Usuario) {
        this.usuarioSeleccionado = usuario
        this.modalAsignarRolVisible = true
    }
    /*
    abrirDialogoAsignarRol(usuario: Usuario) {
        this.selectedUser = usuario
        this.modalRolVisible = true
    }
    */

    /*editarUsuario(usuario: Usuario) {
        console.log('Editar usuario:', usuario)
    }

    verUsuario(usuario: Usuario) {
        console.log('Ver usuario:', usuario)
    }*/

    preguntarDesactivarUsuario(usuario: Usuario) {
        this.confirmationModalService.openConfirm({
            header: 'Desactivar usuario',
            message: `¿Está seguro de que desea desactivar el usuario de ${usuario.cApellidosNombres}?`,
            accept: () => {
                this.cambiarEstadoUsuario(usuario, '0')
            },
        })
    }

    preguntarReactivarUsuario(usuario: Usuario) {
        this.confirmationModalService.openConfirm({
            header: 'Activar usuario',
            message: `¿Está seguro de que desea activar el usuario de ${usuario.cApellidosNombres}?`,
            icon: 'pi pi-check-circle',
            accept: () => {
                this.cambiarEstadoUsuario(usuario, '1')
            },
        })
    }

    cambiarEstadoUsuario(usuario: Usuario, activo: string) {
        this.usuariosService
            .cambiarEstadoUsuario(usuario.iCredId, activo)
            .subscribe({
                next: (respuesta: any) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: `Cambio realizado`,
                        detail: respuesta.message,
                    })
                    usuario.iCredEstado = activo
                    //this.loadUsuariosLazy(this.lastLazyEvent);
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Problema al realizar el cambio',
                        detail: error,
                    })
                },
            })
    }

    preguntarCambiarClave(usuario: Usuario) {
        this.confirmationModalService.openConfirm({
            header: 'Restablecer contraseña',
            message: `La contraseña de ${usuario.cApellidosNombres} será su usuario, ¿desea continuar?`,
            accept: () => {
                this.cambiarClaveUsuario(usuario)
            },
        })
    }

    cambiarClaveUsuario(usuario: Usuario) {
        this.usuariosService
            .restablecerClaveUsuario(usuario.iCredId)
            .subscribe({
                next: (respuesta: any) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: `Contraseña restablecida`,
                        detail: respuesta.message,
                    })
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Problema al restablecer contraseña',
                        detail: error,
                    })
                },
            })
    }
}
