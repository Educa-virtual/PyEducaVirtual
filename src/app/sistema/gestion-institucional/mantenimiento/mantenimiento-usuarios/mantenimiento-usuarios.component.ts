import { Component, inject, OnInit } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import {
    IActionTable,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MessageService } from 'primeng/api'
import { GeneralService } from '@/app/servicios/general.service'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import {
    ContainerPageComponent,
    IActionContainer,
} from '@/app/shared/container-page/container-page.component'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'

@Component({
    selector: 'app-mantenimiento-usuarios',
    standalone: true,
    imports: [PrimengModule, TablePrimengComponent, ContainerPageComponent],
    templateUrl: './mantenimiento-usuarios.component.html',
    styleUrl: './mantenimiento-usuarios.component.scss',
})
export class MantenimientoUsuariosComponent implements OnInit {
    form_usuario: FormGroup // formulario para gestionar mantenimiento-usuarios
    iSedeId: number
    iYAcadId: number
    lista_accesos: any[] = [] // lista de accesos
    perfiles = [] // lista de perfiles
    search_perfiles: any[] = [] // lista de perfiles
    form_perfil: FormGroup // formulario para gestionar perfiles
    selectRowData: any
    selectedItems = []
    selectedItemsPerfil = []

    //Informacion de usuario
    usuario: any //Informacion del usuario seleccionado
    perfil_usuario: any //Informacion del perfil seleccionado

    private _confirmService = inject(ConfirmationModalService)
    constructor(
        private fb: FormBuilder,
        private store: LocalStoreService,
        private messageService: MessageService,
        private query: GeneralService
    ) {
        const perfil = this.store.getItem('dremoPerfil')
        console.log(perfil, 'perfil dremo', this.store)
        this.iSedeId = perfil.iSedeId
    }

    ngOnInit(): void {
        this.form_usuario = this.fb.group({
            iPerfilId: ['', [Validators.required]],
            cContrasena: ['', [Validators.required]],
        })
        this.form_perfil = this.fb.group({
            iPerfilId: ['', [Validators.required]],
        })
        this.getAccesosSedes()
        this.getPerfilSedes()

        console.log(this.selectedItems, 'selectedItems')
    }
    getAccesosSedes() {
        //obtiene los accesos de la sede
        this.query
            .obtenerCredencialesSede({
                iSedeId: this.iSedeId,
            })
            .subscribe({
                next: (data: any) => {
                    const item = data.data
                    this.lista_accesos = item.map((persona) => ({
                        ...persona,
                        nombre_completo: (
                            persona.cPersPaterno +
                            ' ' +
                            persona.cPersMaterno +
                            ' ' +
                            persona.cPersNombre
                        ).trim(),
                    }))
                    console.log(this.lista_accesos, ' lista de cargos')
                },
                error: (error) => {
                    console.error('Error fetching Años Académicos:', error)
                    this.messageService.add({
                        severity: 'danger',
                        summary: 'Mensaje',
                        detail: 'Error en ejecución',
                    })
                },
                complete: () => {
                    console.log('Request completed')
                },
            })
    }

    getPerfilSedes() {
        // obtiene los perfiles para la sede
        this.query
            .searchCalAcademico({
                esquema: 'seg',
                tabla: 'perfiles',
                campos: '*',
                condicion:
                    'iTipoPerfilId = 7 or iTipoPerfilId = 4 or iTipoPerfilId = 10 or iTipoPerfilId = 12 or iTipoPerfilId = 9 or iTipoPerfilId = 8',
            })
            .subscribe({
                next: (data: any) => {
                    this.search_perfiles = data.data
                },
                error: (error) => {
                    console.error('Error fetching Años Académicos:', error)
                    this.messageService.add({
                        severity: 'danger',
                        summary: 'Mensaje',
                        detail: 'Error en ejecución',
                    })
                },
                complete: () => {
                    // this.search_perfiles.unshift({
                    //     iPerfilId: '0',
                    //     cPerfilNombre: 'Todos los perfiles',
                    // }) // console.log('Request completed')
                },
            })
    }
    // metodos

    getPerfilUsuario() {
        // obtiene los perfiles de los usuarios
        this.query
            .searchCalendario({
                json: JSON.stringify({
                    iCredEntId: this.usuario.iCredEntId,
                }),
                _opcion: 'getPerfilesUsuarioSede',
            })
            .subscribe({
                next: (data: any) => {
                    this.perfil_usuario = data.data

                    console.log(data.data, 'perfil_usuario')
                },
                error: (error) => {
                    console.error(
                        'Error fetching Servicios de Atención:',
                        error
                    )
                },
                complete: () => {
                    //   console.log('Request completed')
                },
            })
    }

    accionBtnItemTable({ accion, item }) {
        console.log(this.selectedItems, 'selectedItems')
        if (accion === 'editar') {
            console.log(item, 'btnTable')
        }
        if (accion === 'asignar_perfil') {
            // envia la informacion del perfil seleccionado
            this.usuario = item
            this.getPerfilUsuario()
        }
        if (accion === 'habilitar_usuario') {
            this.btnItem(
                'Habilitar_usuario',
                '¿Desea habilitar los accesos de los usuarios seleccionados?'
            )
        }
        if (accion === 'Deshabilitar_usuario') {
            this.btnItem(
                'Deshabilitar_usuario',
                '¿Desea deshabilitar los accesos de los usuarios seleccionados?'
            )
        }

        if (accion === 'resetear_contrasena') {
            this.btnItem(
                'Resetea_contrasena',
                '¿Desea resetear la contraseña de los usuarios seleccionados?'
            )
        }

        if (accion === 'eliminar_perfiles') {
            this.btnItem(
                'eliminar_perfiles',
                '¿Desea eliminar todos los perfiles del usuario seleccionado?'
            )
        }

        if (accion === 'eliminar_perfil') {
            // elimina perfil seleccionado
            this.selectedItemsPerfil = item
            this.btnItem(
                'eliminar_perfil',
                '¿Desea eliminar el perfil seleccionado?'
            )
        }
    }
    btnItem(accion: string, mensaje: string) {
        console.log(accion, 'accion_btn', mensaje)

        this._confirmService.openConfiSave({
            header: 'Advertencia de procesamiento',
            message: mensaje,
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                if (accion === 'agregar') {
                    // agregar
                    console.log('agregar')
                }
                if (accion === 'perfil') {
                    // agrega perfil seleccionado
                    this.asignar_perfil()
                    console.log('perfil', this.form_perfil.value.iPerfilId)
                }
                if (accion === 'Habilitar_usuario') {
                    // habilita usuario
                    this.habilitar_usuario('updateHabilitarAccesosIE')
                }
                if (accion === 'Deshabilitar_usuario') {
                    // deshabilita usuario
                    this.habilitar_usuario('updateDeshabilitarAccesosIE')
                }
                if (accion === 'Resetea_contrasena') {
                    // resetea contraseña
                    this.resetear_contrasena('resetear_contrasena')
                }

                if (accion === 'eliminar_perfiles') {
                    // elimina todos los perfiles del usuario seleccionado
                    this.eliminar_perfiles(0)
                }
                if (accion === 'eliminar_perfil') {
                    // elimina perfil seleccionado del usuario
                    this.eliminar_perfiles(
                        this.selectedItemsPerfil['iPerfilId']
                    )
                }
            },
            reject: () => {
                // Mensaje de cancelación (opcional)
                this.messageService.add({
                    severity: 'error',
                    summary: 'Cancelado',
                    detail: 'Acción cancelada',
                })
            },
        })
    }

    habilitar_usuario(option: string) {
        // Extraer los iCredEntId
        const ids = this.selectedItems.map((item) => ({
            iCredEntId: Number(item.iCredEntId),
        }))

        this.query
            .updateCalAcademico({
                json: JSON.stringify(ids),
                _opcion: option,
            })
            .subscribe({
                next: (data: any) => {
                    console.log(data)
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Mensaje',
                        detail: 'Error. No se proceso petición ' + error,
                    })
                },
                complete: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Mensaje',
                        detail: 'Proceso exitoso',
                    })
                    this.selectedItems = []
                    this.getAccesosSedes()
                },
            })
    }

    resetear_contrasena(option: string) {
        console.log(option, 'resetear_contrasena')
    }

    eliminar_perfiles(id: number) {
        let params = {}
        if (id === 0) {
            params = {
                esquema: 'seg',
                tabla: 'credenciales_entidades_perfiles',
                campo: 'iCredEntId',
                valorId: this.usuario.iCredEntId,
            }
        } else {
            params = {
                esquema: 'seg',
                tabla: 'credenciales_entidades_perfiles',
                campo: 'iPerfilId',
                valorId: id,
            }
        }

        this.query.deleteAcademico(params).subscribe({
            next: (data: any) => {
                console.log(data.data)
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Mensaje',
                    detail: 'Error. No se proceso petición ' + error,
                })
            },
            complete: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Mensaje',
                    detail: 'Proceso exitoso',
                })
                console.log('Request completed')
                this.getPerfilUsuario()
            },
        })
    }

    asignar_perfil() {
        this.query
            .addCalAcademico({
                json: JSON.stringify({
                    iCredEntId: this.usuario.iCredEntId,
                    iPerfilId: this.form_perfil.value.iPerfilId,
                }),
                _opcion: 'addPerfil',
            })
            .subscribe({
                next: (data: any) => {
                    console.log(data, 'addPerfil')
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Mensaje',
                        detail: 'Error. No se proceso petición ' + error,
                    })
                },
                complete: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Mensaje',
                        detail: 'Proceso exitoso',
                    })
                    console.log('Request completed')
                    this.getPerfilUsuario()
                },
            })
    }

    // container
    accionesPrincipal: IActionContainer[] = [
        {
            labelTooltip: 'Habilitar usuarios',
            text: 'Habilitar',
            icon: 'pi pi-check-square',
            accion: 'habilitar_usuario',
            class: 'p-button-primary',
        },
        {
            labelTooltip: 'Resetear contraseña',
            text: 'Resetear',
            icon: 'pi pi-refresh',
            accion: 'habilitar_usuario',
            class: 'p-button-success',
        },
        {
            labelTooltip: 'Deshabilitar usuarios',
            text: 'Deshabilitar',
            icon: 'pi pi-ban',
            accion: 'Deshabilitar_usuario',
            class: 'p-button-danger',
        },
    ]
    accionesPerfil: IActionContainer[] = [
        {
            labelTooltip: 'Eliminar todos los perfiles',
            text: 'Eliminar perfiles',
            icon: 'pi pi-trash',
            accion: 'eliminar_perfiles',
            class: 'p-button-danger',
        },
    ]

    // variables para table-primeng
    actionsUsuario: IActionTable[] = [
        {
            labelTooltip: 'Asignar perfil',
            icon: 'pi pi-plus',
            accion: 'asignar_perfil',
            type: 'item',
            class: 'p-button-rounded p-button-primary p-button-text',
        },
    ]

    actionsPerfil: IActionTable[] = [
        {
            labelTooltip: 'Eliminar perfil',
            icon: 'pi pi-trash', // pi pi-ban
            accion: 'eliminar_perfil',
            type: 'item',
            class: 'p-button-rounded p-button-warning p-button-text',
        },
    ]

    columns = [
        {
            type: 'checkbox',
            width: '2%',
            field: 'item',
            header: '',
            text_header: 'left',
            text: 'left',
        },

        {
            type: 'text',
            width: '20%',
            field: 'cPersDocumento',
            header: 'Documento',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '40%',
            field: 'nombre_completo',
            header: 'Nombre y apellidos',
            text_header: 'center',
            text: 'left',
        },
        {
            type: 'estado-activo',
            width: '18%',
            field: 'iCredEntEstado',
            header: 'Estado',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'actions',
            width: '20%',
            field: 'actions',
            header: 'Acciones',
            text_header: 'center',
            text: 'center',
        },
    ]

    columa_perfil = [
        {
            type: 'item',
            width: '10%',
            field: 'item',
            header: 'N°',
            text_header: 'left',
            text: 'left',
        },

        {
            type: 'text',
            width: '60%',
            field: 'cPerfilNombre',
            header: 'Perfil',
            text_header: 'center',
            text: 'center',
        },

        {
            type: 'actions',
            width: '20%',
            field: 'actions',
            header: 'Acciones',
            text_header: 'center',
            text: 'center',
        },
    ] // iCredEntId  iCredEntEstado
}
