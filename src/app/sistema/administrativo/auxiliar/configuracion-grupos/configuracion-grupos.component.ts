import { Component, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { PrimengModule } from '@/app/primeng.module'
import { MessageService } from 'primeng/api'
import { GeneralService } from '@/app/servicios/general.service'
import { ConstantesService } from '@/app/servicios/constantes.service'

@Component({
    selector: 'app-configuracion-grupos',
    standalone: true,
    imports: [CommonModule, FormsModule, PrimengModule],
    templateUrl: './configuracion-grupos.component.html',
    styleUrl: './configuracion-grupos.component.scss',
})
export class ConfiguracionGruposComponent implements OnInit {
    // @Input() datosGrupos: any = [];
    idGrupo: number = undefined
    accion: boolean = false
    buscar: any = ''
    horario: any[] = []
    personal: any[] = []
    grupoSeleccionado: any[] = []
    selHorario: any
    configHoario: any = []
    elegir: boolean = false
    seleccionarTodo = false
    visible: boolean = false
    ingreso: Date = new Date() // hora de ingreso para registrarse
    salida: Date = new Date() // hora de salida para registrarse
    inicio: Date = new Date() // fecha de ingreso al grupo
    fin: Date = new Date() // fecha de salida al grupo
    time: Date[] | undefined
    datosGrupos: any = []
    iSedeId: string
    iYAcadId: string
    nombreGrupo: string | undefined
    descripcionGrupo: string | undefined

    private generalService = inject(GeneralService)
    private constantesService = inject(ConstantesService)

    constructor(private messageService: MessageService) {
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
            severity: 'sueccess',
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
    guardarGrupo() {
        this.selHorario = !this.elegir ? this.selHorario : 0
        if (this.grupoSeleccionado.length === 0)
            return this.mensajeAlerta(
                'Falta Registral el personal de la Institucion'
            )
        if (!this.inicio || !this.fin)
            return this.mensajeAlerta(
                'Falta Ingresar la fecha de Ingreso y Salida'
            )

        const params = {
            petition: 'post',
            group: 'asi',
            prefix: 'grupos',
            ruta: 'guardar-grupo-asistencia',
            data: {
                cGrupoNombre: this.nombreGrupo,
                cGrupoDescripcion: this.descripcionGrupo,
                iSedeId: this.iSedeId,
                iConfHorarioId: this.selHorario,
                tConfHorarioEntTur: this.ingreso.toLocaleTimeString(),
                tConfHorarioSalTur: this.salida.toLocaleTimeString(),
                grupoPersonal: JSON.stringify(this.grupoSeleccionado),
                dtFechaIncio: this.inicio,
                dtFechaFin: this.fin,
            },
        }
        this.getInformation(params, 'guardar_grupos')
    }

    actualizarGrupo() {
        this.selHorario = !this.elegir ? this.selHorario : 0
        if (this.grupoSeleccionado.length === 0)
            return this.mensajeAlerta(
                'Falta Registral el personal de la Institucion'
            )
        if (!this.inicio || !this.fin)
            return this.mensajeAlerta(
                'Falta Ingresar la fecha de Ingreso y Salida'
            )

        const params = {
            petition: 'post',
            group: 'asi',
            prefix: 'grupos',
            ruta: 'editar-grupos-ie',
            data: {
                iGrupoId: this.idGrupo,
                cGrupoNombre: this.nombreGrupo,
                cGrupoDescripcion: this.descripcionGrupo,
                iConfHorarioId: this.selHorario,
                tConfHorarioEntTur: this.ingreso.toLocaleTimeString(),
                tConfHorarioSalTur: this.salida.toLocaleTimeString(),
                grupoPersonal: JSON.stringify(this.grupoSeleccionado),
                dtFechaIncio: this.inicio,
                dtFechaFin: this.fin,
                iSedeId: this.iSedeId,
                iYAcadId: this.iYAcadId,
            },
        }
        this.getInformation(params, 'editar_grupos')
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
            // Encontramos el valor de iPersIeId para incluirlo en grupoSeleccionado
            const seleccionado = this.personal.find((item) => {
                return item.iPersIeId === iPersIeId
            })
            if (!seleccionado) return
            // buscamos si el objeto existe en grupoSeleccionado
            const verificar = this.grupoSeleccionado.some(
                (item) => item.iPersIeId === iPersIeId
            )
            if (!verificar) {
                // Si no existe, lo incluimos en grupoSeleccionado
                this.grupoSeleccionado.push({
                    iPersIeId: iPersIeId,
                    iPersId: iPersId,
                })
            } else {
                // caso contrario lo excluimos
                this.grupoSeleccionado = this.grupoSeleccionado.filter(
                    (item) => item['iPersIeId'] !== iPersIeId
                )
            }
            seleccionado.seleccionar = seleccionado.seleccionar === 1 ? 0 : 1
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

    limpiarFormulario() {
        this.nombreGrupo = undefined
        this.descripcionGrupo = undefined
        this.seleccionarTodo = false
        this.elegir = false
        this.selHorario = undefined
        this.ingreso = new Date()
        this.salida = new Date()
        this.inicio = new Date()
        this.fin = new Date()
        this.grupoSeleccionado = []
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
                    summary: 'Sin Grupos',
                    detail: mensaje,
                })
            },
            complete: () => {},
        })
    }

    editarGrupo(grupo: any) {
        this.idGrupo = Number(grupo.iGrupoId)
        const administrativo = JSON.parse(grupo.personal)
        this.nombreGrupo = grupo.cGrupoNombre
        this.descripcionGrupo = grupo.cGrupoDescripcion
        this.elegir = false
        this.ingreso = new Date(grupo.tConfHorarioEntTur)
        this.salida = new Date(grupo.tConfHorarioSalTur)
        this.inicio = new Date()
        this.fin = new Date()
        this.selHorario = grupo.iConfHorarioId
        this.grupoSeleccionado = administrativo
        this.personal = this.grupoSeleccionado.concat(this.personal)
        this.accion = false
        this.visible = true
    }

    accionBtnItem(elemento): void {
        const { accion } = elemento
        const { item } = elemento

        switch (accion) {
            case 'guardar_grupos':
                const idGrupo = Number(item[0]['idGrupo'])
                const idConfiguracion = Number(item[0]['idConfiguracion'])
                if (idGrupo != 0) {
                    let etiquetaIngreso: Date = undefined
                    let etiquetaSalida: Date = undefined
                    if (this.selHorario == 0) {
                        const ingreso = this.ingreso.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                        })
                        const salida = this.salida.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                        })

                        etiquetaIngreso = new Date(`1900-01-01 ${ingreso}:00`)
                        etiquetaSalida = new Date(`1900-01-01 ${salida}:00`)

                        const agregar = {
                            iConfHorarioId: idConfiguracion,
                            horario: ingreso + ' - ' + salida,
                        }
                        this.horario.push(agregar)
                    } else {
                        const hora = this.horario.find(
                            (item) => item.iConfHorarioId === this.selHorario
                        )
                        const configuracion = hora.horario.split(' - ')
                        etiquetaIngreso = new Date(
                            `1900-01-01 ${configuracion[0]}:00`
                        )
                        etiquetaSalida = new Date(
                            `1900-01-01 ${configuracion[1]}:00`
                        )
                    }

                    // Una vez que se registre se debe agregar a la lista de grupos
                    const buscar = this.datosGrupos.some(
                        (item) => item.iGrupoId === idGrupo
                    )
                    if (!buscar) {
                        this.datosGrupos.push({
                            iGrupoId: idGrupo,
                            cGrupoNombre: this.nombreGrupo,
                            cGrupoDescripcion: this.descripcionGrupo,
                            iConfHorarioId: idConfiguracion,
                            tConfHorarioEntTur: etiquetaIngreso,
                            tConfHorarioSalTur: etiquetaSalida,
                            administrativos: this.grupoSeleccionado.length,
                        })
                    }

                    const idEliminar = new Set(
                        this.grupoSeleccionado.map((lista) => lista.iPersIeId)
                    )
                    this.personal = this.personal.filter(
                        (sublista) => !idEliminar.has(sublista.iPersIeId)
                    )

                    this.limpiarFormulario()

                    this.visible = false
                    this.mensajeExito('Se ha Creado un nuevo Grupo')
                } else {
                    this.visible = false
                    this.mensajeAlerta('El Nombre del Grupo ya existe')
                }

                break
            case 'verificar_grupos':
                if (item) {
                    this.datosGrupos = item
                }
                break
            case 'buscar_horario_institucion':
                this.horario = item
                break
            case 'buscar_personal_institucion':
                this.personal = item
                break
            default:
                break
        }
    }
}
