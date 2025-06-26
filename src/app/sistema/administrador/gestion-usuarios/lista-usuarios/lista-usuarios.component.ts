import { PrimengModule } from '@/app/primeng.module'
import { Component } from '@angular/core'
import {
    LazyLoadEvent,
    MenuItem,
    MessageService,
    SelectItem,
} from 'primeng/api'
import { HttpParams } from '@angular/common/http'
import { debounceTime, Subject } from 'rxjs'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { EditarPerfilComponent } from '../editar-perfil/editar-perfil.component'
import { Usuario } from '../interfaces/usuario.interface'
import { AgregarUsuarioComponent } from '../agregar-usuario/agregar-ususario.component'
import { CambiarFechaCaducidadComponent } from '../cambiar-fecha-caducidad/cambiar-fecha-caducidad.component'
import { GestionUsuariosService } from '../services/gestion-usuarios.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

@Component({
    selector: 'app-lista-usuarios',
    standalone: true,
    imports: [
        PrimengModule,
        EditarPerfilComponent,
        AgregarUsuarioComponent,
        CambiarFechaCaducidadComponent,
    ],
    templateUrl: './lista-usuarios.component.html',
    styleUrl: './lista-usuarios.component.scss',
})
export class ListaUsuariosComponent {
    private searchChanged: Subject<void> = new Subject<void>()
    private lastLazyEvent: LazyLoadEvent | undefined
    formCriteriosBusqueda: FormGroup
    dataUsuarios: Usuario[] = []
    totalDataUsuarios: number = 0

    fechaServidor: Date
    listaBotones: MenuItem[]
    loading = false

    usuarioSeleccionado: Usuario | null = null
    breadCrumbItems: MenuItem[]
    breadCrumbHome: MenuItem

    modalAsignarRolVisible: boolean = false
    modalAgregarUsuariolVisible: boolean = false
    modalCambiarFechaCaducidadVisible: boolean = false
    modalPersonalVisible: boolean = false
    criterioBusqueda: string = ''
    //selectedPersonal: Usuario | null = null
    opcionesBusqueda: any[] = []
    opcionBusquedaSeleccionada: any

    dataInstituciones: SelectItem[] = []
    dataPerfiles: SelectItem[] = []
    dataIeSedes: SelectItem[] = []
    dataCursos: SelectItem[] = []
    dataModulosAdministrativos: SelectItem[] = []
    dataInstitucionesEducativas: SelectItem[] = []
    dataPerfilesUsuario: any[] = []
    dataUgeles: any[] = []
    //filtroInstitucionSeleccionada: any
    //filtrosRoles: any[] = []
    //filtroPerfilSeleccionado: any

    constructor(
        private messageService: MessageService,
        private usuariosService: GestionUsuariosService,
        private confirmationModalService: ConfirmationModalService,
        private fb: FormBuilder
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
            { label: 'Documento', value: 'documento' },
            { label: 'Apellidos', value: 'apellidos' },
            { label: 'Nombres', value: 'nombres' },
            { label: 'Perfil', value: 'perfil' },
        ]
        this.opcionBusquedaSeleccionada = this.opcionesBusqueda[0].value
        this.dataInstituciones = [
            { label: 'DREMO', value: 1 },
            { label: 'UGEL', value: 2 },
            { label: 'INSTITUCIONES EDUCATIVAS', value: 3 },
        ]
        //this.dataInstitucionSeleccionada = this.filtrosInstituciones[0]
        /*this.filtrosRoles = [
            { name: 'Todos', code: 'todos' },
            { name: 'Activos', code: 'activos' },
            { name: 'Inactivos', code: 'inactivos' },
        ]*/
        //this.filtroPerfilSeleccionado = this.filtrosRoles[0]

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

        this.formCriteriosBusqueda = this.fb.group({
            opcionSeleccionada: ['', [Validators.required]],
            criterioBusqueda: [''],
            institucionSeleccionada: [''],
            ieSeleccionada: [''],
            iModuloSeleccionado: [''],
            iUgelSeleccionada: [''],
            ieSedeSeleccionada: [''],
            iCursoSeleccionado: [''],
            perfilSeleccionado: [''],
        })

        this.inicializarDatos()
    }

    inicializarDatos() {
        this.obtenerInstitucionesEducativas()
        this.obtenerUgeles()
        this.obtenerCursos()
        this.obtenerModulosAdministrativos()
        /*this.opciones = [
            { label: 'DREMO', value: 1 },
            { label: 'UGEL', value: 2 },
            { label: 'INSTITUCIONES EDUCATIVAS', value: 3 },
        ]*/
        //this.iniciarFormulario()
    }

    obtenerPerfilesPorTipo(tipo: string) {
        this.usuariosService.obtenerPerfilesPorTipo(tipo).subscribe({
            next: (respuesta: any) => {
                this.dataPerfiles = respuesta.data.map((perfil) => ({
                    value: perfil.iPerfilId,
                    label: perfil.cPerfilNombre,
                }))
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

    obtenerModulosAdministrativos() {
        this.usuariosService.obtenerModulosAdministrativos().subscribe({
            next: (respuesta: any) => {
                this.dataModulosAdministrativos = respuesta.data.map((mod) => ({
                    value: mod.iModuloId,
                    label: mod.cModuloNombre,
                }))
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Problema al obtener instituciones educativas',
                    detail: error,
                })
            },
        })
    }

    obtenerCursos() {
        this.usuariosService.obtenerCursos().subscribe({
            next: (respuesta: any) => {
                this.dataCursos = respuesta.data.map((curso) => ({
                    value: curso.iCursosNivelGradId,
                    label: curso.curso_grado,
                }))
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'danger',
                    summary: 'Mensaje',
                    detail: error,
                })
            },
        })
    }

    obtenerUgeles() {
        this.usuariosService.obtenerUgeles().subscribe({
            next: (respuesta: any) => {
                this.dataUgeles = respuesta.data.map((ugel) => ({
                    value: ugel.iUgelId,
                    label: ugel.cUgelNombre,
                }))
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'danger',
                    summary: 'Mensaje',
                    detail: error,
                })
            },
        })
    }

    obtenerInstitucionesEducativas() {
        this.usuariosService.obtenerInstitucionesEducativas().subscribe({
            next: (respuesta: any) => {
                this.dataInstitucionesEducativas = respuesta.data.map((ie) => ({
                    value: ie.iIieeId,
                    label: (
                        ie.cIieeCodigoModular +
                        ' - ' +
                        ie.cIieeNombre +
                        ' - ' +
                        (ie.iNivelTipoId == 3 ? 'PRIMARIA' : 'SECUNDARIA')
                    ).trim(),
                }))
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Problema al obtener instituciones educativas',
                    detail: error,
                })
            },
        })
    }

    reiniciarFiltrosPerfil() {
        const fields = [
            'ieSeleccionada',
            'iUgelSeleccionada',
            'ieSedeSeleccionada',
            'iCursoSeleccionado',
            'iModuloSeleccionado',
        ]

        // Limpiar valores y validadores
        fields.forEach((field) => {
            this.formCriteriosBusqueda.get(field)?.setValue('')
            this.formCriteriosBusqueda.get(field)?.clearValidators()
        })

        const opcion = this.formCriteriosBusqueda.get(
            'institucionSeleccionada'
        )?.value
        switch (opcion) {
            case 1:
                this.obtenerPerfilesPorTipo('dremo')
                if (
                    +this.formCriteriosBusqueda.get('perfilSeleccionado')
                        ?.value == 2
                ) {
                    this.formCriteriosBusqueda
                        .get('iCursoSeleccionado')
                        ?.setValidators([Validators.required])
                } else {
                    this.formCriteriosBusqueda
                        .get('iModuloSeleccionado')
                        ?.setValidators([Validators.required])
                }
                break
            case 2:
                this.obtenerPerfilesPorTipo('ugel')
                this.formCriteriosBusqueda
                    .get('iUgelSeleccionada')
                    ?.setValidators([Validators.required])
                this.formCriteriosBusqueda
                    .get('iCursoSeleccionado')
                    ?.setValidators([Validators.required])
                break
            case 3:
                this.obtenerPerfilesPorTipo('ie')
                this.formCriteriosBusqueda
                    .get('ieSeleccionada')
                    ?.setValidators([Validators.required])
                this.formCriteriosBusqueda
                    .get('ieSedeSeleccionada')
                    ?.setValidators([Validators.required])
                break
        }

        // Actualizar validadores
        fields.forEach((field) => {
            this.formCriteriosBusqueda.get(field)?.updateValueAndValidity()
        })
    }

    cambioOpcionBusqueda() {
        if (this.criterioBusqueda != '') {
            this.loadUsuariosLazy(this.lastLazyEvent)
        }
    }

    obtenerSedesIe() {
        this.usuariosService
            .obtenerSedesInstitucionEducativa(
                this.formCriteriosBusqueda.get('ieSeleccionada')?.value
            )
            .subscribe({
                next: (respuesta: any) => {
                    this.dataIeSedes = respuesta.data.map((sede) => ({
                        value: sede.iSedeId,
                        label: sede.cSedeNombre,
                    }))
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Problema al obtener sedes',
                        detail: error,
                    })
                },
            })
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
                    detail: error.error.message,
                })
            },
        })
    }

    usuarioRegistrado(data) {
        console.log('Usuario registrado:', data)
        this.modalAgregarUsuariolVisible = false
        this.modalAsignarRolVisible = true
        this.usuarioSeleccionado = data
        this.loadUsuariosLazy(this.lastLazyEvent)
    }

    loadUsuariosLazy(event: any) {
        this.lastLazyEvent = event
        this.loading = true
        const params = new HttpParams()
            .set('offset', event.first)
            .set('limit', event.rows)
            .set(
                'opcionBusquedaSeleccionada',
                this.opcionBusquedaSeleccionada.value
            )
            .set('criterioBusqueda', this.criterioBusqueda)
        /*.set(
            'filtroInstitucionSeleccionada',
            this.filtroInstitucionSeleccionada.value
        )*/
        //.set('filtroPerfilSeleccionado', this.filtroPerfilSeleccionado.value)
        this.obtenerListaUsuarios(params)
    }

    agregarUsuario() {
        this.usuarioSeleccionado = null
        this.modalAgregarUsuariolVisible = true
    }

    editarPerfilesUsuario(usuario: Usuario) {
        this.usuarioSeleccionado = usuario
        this.modalAsignarRolVisible = true
    }

    cambiarFechaCaducidad(usuario: Usuario) {
        this.usuarioSeleccionado = usuario
        this.modalCambiarFechaCaducidadVisible = true
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
