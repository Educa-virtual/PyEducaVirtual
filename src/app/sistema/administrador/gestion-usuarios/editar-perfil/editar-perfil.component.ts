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
import { MessageService, SelectItem } from 'primeng/api'
import { UsuariosService } from '../services/usuarios.service'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { PerfilAsignado } from '../interfaces/perfil-asignado.interface'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

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
    formAgregarPerfil: FormGroup
    //@Output() perfilesAsignados = new EventEmitter<any>()
    dataPerfilesUsuario: any[] = []
    dataUgeles: any[] = []
    opciones: SelectItem[] = []
    dataIeSedes: SelectItem[] = []
    dataPerfiles: SelectItem[] = []
    dataCursos: SelectItem[] = []
    dataModulosAdministrativos: SelectItem[] = []
    iDremoId: number

    ENTIDAD: number = 10 // DREMO

    dataInstitucionesEducativas: SelectItem[] = []
    //ieSeleccionada: number

    //ieSedeSeleccionada: number

    //perfilSeleccionado: number

    niveles: Nivel[] = []
    modulos: Modulo[] = []
    roles: Rol[] = []

    nivelSeleccionado: Nivel | null = null
    moduloSeleccionado: Modulo | null = null
    perfilUsuarioSeleccionado: PerfilAsignado | null = null

    // Propiedades para el diálogo

    ngOnInit() {
        this.inicializarDatos()
    }

    constructor(
        private messageService: MessageService,
        private usuariosService: UsuariosService,
        private confirmationModalService: ConfirmationModalService,
        private fb: FormBuilder
    ) {}

    obtenerPerfilesUsuario() {
        this.usuariosService
            .obtenerPerfilesUsuario(this.usuario.iCredId)
            .subscribe({
                next: (respuesta: any) => {
                    this.dataPerfilesUsuario = respuesta.data
                    this.usuario.iCantidadPerfiles =
                        this.dataPerfilesUsuario.length
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Problema al obtener perfiles de usuario',
                        detail: error,
                    })
                },
            })
    }

    obtenerPerfilesPorTipo(tipo: string) {
        this.usuariosService.obtenerPerfilesPorTipo(tipo).subscribe({
            next: (respuesta: any) => {
                //this.dataPerfilesUsuario = respuesta.data
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

    obtenerSedesIe() {
        this.usuariosService
            .obtenerSedesInstitucionEducativa(
                this.formAgregarPerfil.get('ieSeleccionada')?.value
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
        /*this.query
            .searchCalAcademico({
                esquema: 'acad',
                tabla: 'sedes',
                campos: 'iSedeId, iIieeId, cSedeNombre, iEstado',
                condicion: 'iIieeId= ' + id,
            })
            .subscribe({
                next: (data: any) => {
                    this.lista_sedes = data.data
                },
                error: (error) => {
                    console.error('Error lista de Sedes:', error)
                    this.messageService.add({
                        severity: 'danger',
                        summary: 'Mensaje de error de Sedes',
                        detail: error,
                    })
                },
                complete: () => {
                    console.log('Request completed')
                },
            })*/
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['visible'] && changes['visible'].currentValue === true) {
            //this.inicializarDatos()
            this.obtenerPerfilesUsuario()
        }
    }

    reiniciarFiltros() {
        const fields = [
            'ieSeleccionada',
            'iUgelSeleccionada',
            'ieSedeSeleccionada',
            'iCursoSeleccionado',
            'iModuloSeleccionado',
        ]

        // Limpiar valores y validadores
        fields.forEach((field) => {
            this.formAgregarPerfil.get(field)?.setValue('')
            this.formAgregarPerfil.get(field)?.clearValidators()
        })

        const opcion = this.formAgregarPerfil.get('opcionSeleccionada')?.value
        switch (opcion) {
            case 1:
                this.obtenerPerfilesPorTipo('dremo')
                if (
                    +this.formAgregarPerfil.get('perfilSeleccionado')?.value ==
                    2
                ) {
                    this.formAgregarPerfil
                        .get('iCursoSeleccionado')
                        ?.setValidators([Validators.required])
                } else {
                    this.formAgregarPerfil
                        .get('iModuloSeleccionado')
                        ?.setValidators([Validators.required])
                }
                break
            case 2:
                this.obtenerPerfilesPorTipo('ugel')
                this.formAgregarPerfil
                    .get('iUgelSeleccionada')
                    ?.setValidators([Validators.required])
                this.formAgregarPerfil
                    .get('iCursoSeleccionado')
                    ?.setValidators([Validators.required])
                break
            case 3:
                this.obtenerPerfilesPorTipo('ie')
                this.formAgregarPerfil
                    .get('ieSeleccionada')
                    ?.setValidators([Validators.required])
                this.formAgregarPerfil
                    .get('ieSedeSeleccionada')
                    ?.setValidators([Validators.required])
                break
        }

        // Actualizar validadores
        fields.forEach((field) => {
            this.formAgregarPerfil.get(field)?.updateValueAndValidity()
        })
    }

    inicializarDatos() {
        this.obtenerInstitucionesEducativas()
        this.obtenerUgeles()
        this.obtenerCursos()
        this.obtenerModulosAdministrativos()
        this.opciones = [
            { label: 'DREMO', value: 1 },
            { label: 'UGEL', value: 2 },
            { label: 'INSTITUCIONES EDUCATIVAS', value: 3 },
        ]
        this.formAgregarPerfil = this.fb.group({
            opcionSeleccionada: ['', [Validators.required]],
            ieSeleccionada: [''],
            iModuloSeleccionado: [''],
            iUgelSeleccionada: [''],
            ieSedeSeleccionada: [''],
            iCursoSeleccionado: [''],
            perfilSeleccionado: ['', [Validators.required]],
        })
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
        this.dataPerfilesUsuario = []
        this.visibleChange.emit(false)
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

    agregarPerfil() {
        let param: any = {}
        switch (this.formAgregarPerfil.get('opcionSeleccionada')?.value) {
            case 1: //DREMO
                param = {
                    json: JSON.stringify({
                        iEntId: this.ENTIDAD,
                        iPerfilId:
                            this.formAgregarPerfil.get('perfilSeleccionado')
                                ?.value,
                        iPersId: this.usuario.iPersId,
                        iCursosNivelGradId:
                            this.formAgregarPerfil.get('iCursoSeleccionado')
                                ?.value,
                        cTipo:
                            +this.formAgregarPerfil.get('perfilSeleccionado')
                                ?.value == 2
                                ? 'EspecialistaDre'
                                : 'PerfilModuloDre',
                    }),
                    _opcion: 'addPerfilDremo',
                }
                break
            case 2: //UGEL
                param = {
                    json: JSON.stringify({
                        iUgelId:
                            this.formAgregarPerfil.get('iUgelSeleccionada')
                                ?.value,
                        iEntId: this.ENTIDAD,
                        iPerfilId:
                            this.formAgregarPerfil.get('perfilSeleccionado')
                                ?.value,
                        iPersId: this.usuario.iPersId,
                        iCursosNivelGradId:
                            this.formAgregarPerfil.get('iCursoSeleccionado')
                                ?.value,
                    }),
                    _opcion: 'addPerfilUgel',
                }
                break
            case 3: //IIEE
                param = {
                    json: JSON.stringify({
                        iSedeId:
                            this.formAgregarPerfil.get('ieSedeSeleccionada')
                                ?.value, //this.form_perfil.value.iSedeId,
                        iPersId: this.usuario.iPersId,
                        iEntId: this.ENTIDAD,
                        iPerfilId:
                            this.formAgregarPerfil.get('perfilSeleccionado')
                                ?.value, //this.form_perfil.value.iPerfilId,
                    }),
                    _opcion: 'addPerfilSede',
                }
                break
        }

        this.usuariosService.registrarPerfil(param).subscribe({
            next: (data: any) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: data.message,
                })
                this.obtenerPerfilesUsuario()
            },
            error: (error) => {
                console.error('Error al agregar perfil:', error)
                this.messageService.add({
                    severity: 'error',
                    summary: 'Mensaje',
                    detail: error.error.message,
                })
            },
        })
    }
}
