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
    criterioBusqueda: string = ''
    //form: FormGroup
    loading = false
    modalAsignarRolVisible: boolean = false
    usuarioSeleccionado: Usuario | null = null
    breadCrumbItems: MenuItem[]
    breadCrumbHome: MenuItem

    // modal 2
    modalAgregarPersonalVisible: boolean = false
    modalPersonalVisible: boolean = false
    selectedPersonal: Usuario | null = null

    opcionesBusqueda = [
        { name: 'Documento', code: 'documento' },
        { name: 'Apellidos', code: 'apellidos' },
        { name: 'Nombres', code: 'nombres' },
    ]
    opcionBusquedaSeleccionada: any = this.opcionesBusqueda[0]
    filtrosInstituciones = [
        { name: 'Dremo', code: 'dremo' },
        { name: 'UGEL', code: 'ugel' },
        { name: 'Institución', code: 'institucion' },
    ]
    filtroInstitucionSeleccionada: any = this.filtrosInstituciones[0]
    filtrosRoles = [
        { name: 'Todos', code: 'todos' },
        { name: 'Activos', code: 'activos' },
        { name: 'Inactivos', code: 'inactivos' },
    ]
    filtroPerfilSeleccionado: any = this.filtrosRoles[0]

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

        // Configurar debounce para el input
        this.searchChanged.pipe(debounceTime(400)).subscribe(() => {
            if (this.lastLazyEvent) {
                this.loadUsuariosLazy(this.lastLazyEvent) // reutiliza último evento
            }
        })
    }

    cambioOpcionBusqueda() {
        this.loadUsuariosLazy(this.lastLazyEvent)
    }

    cambioCriterioBusqueda() {
        this.searchChanged.next() // activa debounce
    }

    obtenerListaUsuarios(params: any) {
        this.usuariosService.obtenerListaUsuarios(params).subscribe({
            next: (respuesta: any) => {
                this.totalDataUsuarios = respuesta.data.total
                this.dataUsuarios = respuesta.data.data
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

    editarRolesUsuario(usuario: Usuario) {
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
                this.cambiarEstadoUsuario(usuario, 0)
            },
        })
    }

    preguntarReactivarUsuario(usuario: Usuario) {
        this.confirmationModalService.openConfirm({
            header: 'Activar usuario',
            message: `¿Está seguro de que desea activar el usuario de ${usuario.cApellidosNombres}?`,
            icon: 'pi pi-check-circle',
            accept: () => {
                this.cambiarEstadoUsuario(usuario, 1)
            },
        })
    }

    cambiarEstadoUsuario(usuario: Usuario, activo: number) {
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
                        summary: 'Problema al obtener usuarios',
                        detail: error,
                    })
                },
            })
    }

    mostrarDialogCambiarClave(usuario: Usuario) {
        console.log(usuario)
    }
}
