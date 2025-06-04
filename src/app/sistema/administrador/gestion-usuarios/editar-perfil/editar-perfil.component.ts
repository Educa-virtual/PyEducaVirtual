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

    opciones: SelectItem[] = []
    //opcionSeleccionada: number
    institucionesEducativas: SelectItem[] = []
    //ieSeleccionada: number
    ieSedes: SelectItem[] = []
    //ieSedeSeleccionada: number
    perfiles: SelectItem[] = []
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

    obtenerPerfilesPorTipo(tipo: string) {
        this.usuariosService.obtenerPerfilesPorTipo(tipo).subscribe({
            next: (respuesta: any) => {
                //this.dataPerfilesUsuario = respuesta.data
                this.perfiles = respuesta.data.map((perfil) => ({
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

    obtenerSedesIe(iIieeId: number) {
        this.usuariosService
            .obtenerSedesInstitucionEducativa(iIieeId)
            .subscribe({
                next: (respuesta: any) => {
                    this.ieSedes = respuesta.data.map((sede) => ({
                        value: sede.iSedeId,
                        label: sede.cSedeNombre,
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
        this.dataPerfilesUsuario = []
        this.visibleChange.emit(false)
    }

    obtenerInstitucionesEducativas() {
        this.usuariosService.obtenerInstitucionesEducativas().subscribe({
            next: (respuesta: any) => {
                this.institucionesEducativas = respuesta.data.map((ie) => ({
                    value: ie.iIieeId,
                    label: (
                        ie.cIieeCodigoModular +
                        ' - ' +
                        ie.cIieeNombre +
                        ' - ' +
                        (ie.iNivelTipoId == 3 ? 'PRIMARIA' : 'SECUNDARIA')
                    ).trim(),
                }))
                //this.institucionesEducativas = respuesta.data
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

    inicializarDatos() {
        this.obtenerInstitucionesEducativas()
        this.opciones = [
            { label: 'DREMO', value: 1 },
            { label: 'UGEL', value: 2 },
            { label: 'INSTITUCIONES EDUCATIVAS', value: 3 },
        ]
        this.formAgregarPerfil = this.fb.group({
            opcionSeleccionada: ['', [Validators.required]],
            ieSeleccionada: [''],
            ieSedeSeleccionada: [''],
            perfilSeleccionado: ['', [Validators.required]],
            /*iEntId: ['', [Validators.required]],
                    iOption: ['', [Validators.required]],
                    iDremoId: [''],
                    iUgelId: [''],
                    iIieeId: [''],

                    iSedeId: [''],
                    iCursosNivelGradId: [''],

                    iPerfilId: ['', [Validators.required]],*/
        })
        /*this.instituciones = [
            { nombre: 'I.E. Rafael Díaz', codigo: 'RAF' },
            { nombre: 'I.E. Simón Bolívar', codigo: 'SIM' },
        ]*/

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
