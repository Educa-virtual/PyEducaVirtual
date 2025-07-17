import { Component, OnInit, ViewChild, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { PrimengModule } from '@/app/primeng.module'
import { ConfirmationService, MessageService } from 'primeng/api'
import { GeneralService } from '@/app/servicios/general.service'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { HorarioComponent } from './horario/horario.component'
import { PersonalComponent } from './personal/personal.component'
@Component({
    selector: 'app-configuracion-grupos',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        PrimengModule,
        HorarioComponent,
        PersonalComponent,
    ],
    templateUrl: './configuracion-grupos.component.html',
    styleUrl: './configuracion-grupos.component.scss',
    providers: [MessageService, ConfirmationService],
})
export class ConfiguracionGruposComponent implements OnInit {
    @ViewChild(HorarioComponent) horarioModulo!: HorarioComponent
    @ViewChild(PersonalComponent) personalModulo!: PersonalComponent
    // @Input() datosGrupos: any = [];
    opcion: number = 0
    ocultarAccion: number = 0
    horarioRecibir: any
    visibleGuardar: boolean = false
    visibleConfiguracion: boolean = false
    deshabilitar: boolean = false
    idGrupo: number = undefined
    accion: boolean = false
    buscar: any = ''
    horario: any[] = []
    personal: any[] = []
    grupoSeleccionado: any[] = []
    grupoEliminado: any[] = []
    selHorario: any
    configHoario: any = []
    elegir: boolean = false
    seleccionarTodo = false
    visible: boolean = false
    time: Date[] | undefined
    datosGrupos: any = []
    iSedeId: string
    iYAcadId: string
    private generalService = inject(GeneralService)
    private constantesService = inject(ConstantesService)

    constructor(
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) {
        this.iSedeId = this.constantesService.iSedeId
        this.iYAcadId = this.constantesService.iYAcadId
    }

    ngOnInit() {
        this.buscarGrupos()
        this.buscarHorarioInstitucion()
        this.buscarPersonal()
    }

    buscarHorarioInstitucion() {
        const params = {
            petition: 'post',
            group: 'asi',
            prefix: 'grupos',
            ruta: 'buscar-horario-ie',
            data: {
                iSedeId: this.iSedeId,
            },
        }
        this.getInformation(params, 'buscar_horario_institucion')
    }

    buscarPersonal() {
        const params = {
            petition: 'post',
            group: 'asi',
            prefix: 'grupos',
            ruta: 'buscar-personal-ie',
            data: {
                iSedeId: this.iSedeId,
                iYAcadId: this.iYAcadId,
            },
        }
        this.getInformation(params, 'buscar_personal_institucion')
    }

    mensajeExito(mensaje: any) {
        this.messageService.add({
            severity: 'success',
            summary: 'Existo en el Registro',
            detail: mensaje,
        })
    }

    mensajeAlerta(mensaje: any) {
        this.messageService.add({
            severity: 'error',
            summary: 'Error de Registro',
            detail: mensaje,
        })
    }

    guardarPersonalGrupo() {
        const params = {
            petition: 'post',
            group: 'asi',
            prefix: 'grupos',
            ruta: 'guardar-persona-grupo',
            data: {
                iGrupoId: this.idGrupo,
                grupoPersonal: JSON.stringify(this.grupoSeleccionado),
                // dtFechaIncio: this.inicio,
                // dtFechaFin: this.fin,
            },
        }
        this.getInformation(params, 'guardar_persona_grupo')
    }

    buscarGrupos() {
        const params = {
            petition: 'post',
            group: 'asi',
            prefix: 'grupos',
            ruta: 'verificar-horario',
            data: {
                iSedeId: this.iSedeId,
                iYAcadId: this.iYAcadId,
            },
        }
        this.getInformation(params, 'verificar_grupos')
    }

    cambiarSeleccion(iPersIeId: any, iPersId: any) {
        if (iPersIeId == 0) {
            const cambiar = this.seleccionarTodo ? 1 : 0
            this.personal.forEach((item) => (item.seleccionar = cambiar))
            const filtrarGrupos = this.personal.map(
                ({ iPersIeId, iPersId }) => ({ iPersIeId, iPersId })
            )
            this.grupoSeleccionado = this.seleccionarTodo ? filtrarGrupos : []
        } else {
            const seleccionado =
                this.grupoEliminado.find(
                    (item) => item.iPersIeId == iPersIeId
                ) ?? this.personal.find((item) => item.iPersIeId == iPersIeId)
            // buscamos si el objeto existe en grupoSeleccionado
            const verificar = this.grupoSeleccionado.some(
                (item) => item.iPersIeId == iPersIeId
            )
            if (!verificar) {
                // Si no existe, lo incluimos en grupoSeleccionado
                const agregar = seleccionado.iPersonaGrupoId
                    ? seleccionado
                    : { iPersIeId, iPersId }
                this.grupoSeleccionado.push(agregar)
            } else {
                // caso contrario lo excluimos
                this.grupoSeleccionado = this.grupoSeleccionado.filter(
                    (item) => item.iPersIeId != iPersIeId
                )
            }

            seleccionado.seleccionar = seleccionado.seleccionar === 1 ? 0 : 1
            this.filtrarGrupoEliminado(seleccionado, iPersIeId)
        }
    }

    /**
     * Seleccionar grupos eliminados (grupoEliminado)
     * @param grupoEliminado
     */
    filtrarGrupoEliminado(datos, iPersIeId) {
        if (!datos.iPersonaGrupoId) return

        if (datos.seleccionar === 0) {
            this.grupoEliminado.push(datos)
        } else {
            this.grupoEliminado = this.grupoEliminado.filter(
                (item) => item.iPersIeId != iPersIeId
            )
        }
    }

    get filtrarGrupos(): any[] {
        if (!this.buscar) {
            return this.datosGrupos
        }
        return this.datosGrupos.filter((item) =>
            item.cGrupoNombre.toLowerCase().includes(this.buscar.toLowerCase())
        )
    }

    getInformation(params, accion) {
        this.generalService.getGralPrefix(params).subscribe({
            next: (response: any) => {
                this.accionBtnItem({ accion, item: response?.data })
            },
            error: (error) => {
                const mensaje = error.error.message
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error de Consulta',
                    detail: mensaje,
                })
            },
            complete: () => {},
        })
    }

    confirmar(event: Event) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message:
                '¿Quiere Guardar Cambios Recuerde que si agregar personal Nuevo y la fecha se ingreso y salida del personal afectara a todo el personal del grupo?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptIcon: 'none',
            rejectIcon: 'none',
            rejectButtonStyleClass: 'p-button-text',
            accept: () => {
                const titulo = 'Confirmado'
                const subtitulo = 'Ha sido Aceptado tu Peticion'
                this.mensajeInformacion(titulo, subtitulo)
            },
            reject: () => {
                const titulo = 'Rechazado'
                const subtitulo = 'Ha sido Rechazado tu Peticion'
                this.mensajeError(titulo, subtitulo)
            },
        })
    }

    mensajeInformacion(titulo, subtitulo) {
        this.messageService.add({
            severity: 'info',
            summary: titulo,
            detail: subtitulo,
            life: 5000,
        })
    }

    mensajeError(titulo, subtitulo) {
        this.messageService.add({
            severity: 'error',
            summary: titulo,
            detail: subtitulo,
            life: 5000,
        })
    }

    accionBtnItem(elemento): void {
        const { accion } = elemento
        const { item } = elemento

        switch (accion) {
            case 'verificar_grupos':
                if (item) {
                    this.datosGrupos = item
                }
                break
            case 'buscar_horario_institucion':
                if (item) {
                    this.horario = item
                }

                break
            case 'buscar_personal_institucion':
                if (item) {
                    this.personal = item
                }
                break
            default:
                break
        }
    }
}
