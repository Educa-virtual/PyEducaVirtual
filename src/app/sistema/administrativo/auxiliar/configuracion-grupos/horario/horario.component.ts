import { Component, OnInit, inject, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { PrimengModule } from '@/app/primeng.module'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { GeneralService } from '@/app/servicios/general.service'
import { MessageService } from 'primeng/api'
@Component({
    selector: 'app-horario',
    standalone: true,
    imports: [CommonModule, FormsModule, PrimengModule],
    templateUrl: './horario.component.html',
    styleUrl: './horario.component.scss',
})
export class HorarioComponent implements OnInit {
    @Input() datosGrupos: any[] = []
    // @Output() selHorario = new EventEmitter<any>();
    idGrupo: number = undefined
    nombreGrupo: string | undefined
    descripcionGrupo: string | undefined
    ingreso: Date = new Date() // hora de ingreso para registrarse
    salida: Date = new Date() // hora de salida para registrarse
    horario: any[] = []
    selHorario: any
    iSedeId: string
    iYAcadId: string
    visibleHorario: boolean = true
    private constantesService = inject(ConstantesService)
    private generalService = inject(GeneralService)

    constructor(private messageService: MessageService) {
        this.iSedeId = this.constantesService.iSedeId
        this.iYAcadId = this.constantesService.iYAcadId
    }

    ngOnInit() {
        // this.buscarGrupos()
        this.buscarHorarioInstitucion()
        // this.buscarPersonal()
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

    /**
     * Retorna los valores a configuracion-grupos.component
     */
    datosHorario() {
        return {
            nombreGrupo: this.nombreGrupo,
            descripcionGrupo: this.descripcionGrupo,
            ingreso: this.ingreso,
            salida: this.salida,
            selHorario: this.selHorario,
            visibleHorario: this.visibleHorario,
        }
    }

    guardarGrupo() {
        this.selHorario = this.visibleHorario ? 0 : this.selHorario

        if (this.nombreGrupo == undefined)
            return this.mensajeAlerta('Ingrese un Nombre')
        if (this.selHorario == undefined)
            return this.mensajeAlerta('Seleccione un Horario')

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
            },
        }
        this.getInformation(params, 'guardar_grupos')
    }

    editarGrupo(grupo: any) {
        this.idGrupo = Number(grupo.iGrupoId)
        this.nombreGrupo = grupo.cGrupoNombre
        this.descripcionGrupo = grupo.cGrupoDescripcion
        this.ingreso = new Date(grupo.tConfHorarioEntTur)
        this.salida = new Date(grupo.tConfHorarioSalTur)
        this.visibleHorario = false
        this.selHorario = grupo.iConfHorarioId

        // this.elegir             = false
        // this.inicio             = new Date()
        // this.fin                = new Date()
        // const administrativo    = JSON.parse(grupo.personal)
        // this.grupoSeleccionado  = administrativo
        // this.personal           = this.grupoSeleccionado.concat(this.personal)
        // this.accion             = false
    }

    /**
     *
     * @param selHorario capturamos el checkbox para cambiar el estado de iConfHorarioId
     */
    actualizarGrupo() {
        this.selHorario = this.visibleHorario ? 0 : this.selHorario

        if (this.nombreGrupo == undefined)
            return this.mensajeAlerta('Ingrese un Nombre')
        if (this.selHorario == undefined)
            return this.mensajeAlerta('Seleccione un Horario')
        const params = {
            petition: 'post',
            group: 'asi',
            prefix: 'grupos',
            ruta: 'actualizar-grupo-asistencia',
            data: {
                iGrupoId: this.idGrupo,
                cGrupoNombre: this.nombreGrupo,
                cGrupoDescripcion: this.descripcionGrupo,
                iSedeId: this.iSedeId,
                iConfHorarioId: this.selHorario,
                tConfHorarioEntTur: this.ingreso.toLocaleTimeString(),
                tConfHorarioSalTur: this.salida.toLocaleTimeString(),
            },
        }
        this.getInformation(params, 'actualizar_grupo')
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

    /**
   *  Se le cambia el formato a la fecha para extraer la hora
      Si es nuevo el horario se añade al parametro horario
  */

    agregarHorario(iConfHorarioId: any) {
        let etiquetaIngreso: any
        let etiquetaSalida: any
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

            etiquetaIngreso = `1900-01-01 ${ingreso}:00`
            etiquetaSalida = `1900-01-01 ${salida}:00`

            const agregar = {
                iConfHorarioId: iConfHorarioId,
                horario: ingreso + ' - ' + salida,
            }
            this.horario.push(agregar)
        } else {
            const hora = this.horario.find(
                (item) => item.iConfHorarioId === this.selHorario
            )
            const configuracion = hora.horario.split(' - ')
            console.log('observar: ', configuracion)
            etiquetaIngreso = `1900-01-01 ${configuracion[0]}:00`
            etiquetaSalida = `1900-01-01 ${configuracion[1]}:00`
        }

        const respuesta = {
            ingreso: etiquetaIngreso,
            salida: etiquetaSalida,
        }

        return respuesta
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
                            administrativos: 0,
                        })
                    }

                    // const idEliminar = new Set(
                    //     this.grupoSeleccionado.map((lista) => lista.iPersIeId)
                    // )
                    // this.personal = this.personal.filter(
                    //     (sublista) => !idEliminar.has(sublista.iPersIeId)
                    // )

                    this.limpiarFormulario()

                    //this.visible = false
                    this.mensajeExito('Se ha Creado un nuevo Grupo')
                } else {
                    //this.visible = false
                    this.mensajeAlerta('El Nombre del Grupo ya existe')
                }

                break
            case 'buscar_horario_institucion':
                this.horario = item
                break
            case 'actualizar_grupo':
                console.log('ver #1 ', this.datosGrupos)
                const iGrupoId = Number(item[0]['idGrupo'])
                const iConfHorarioId = Number(item[0]['iConfHorarioId'])

                const grupo = this.datosGrupos.find(
                    (item) => item.iGrupoId == iGrupoId
                )
                grupo.iConfHorarioId = iConfHorarioId
                grupo.cGrupoNombre = this.nombreGrupo
                grupo.cGrupoDescripcion = this.descripcionGrupo

                const respuesta = this.agregarHorario(iConfHorarioId)

                grupo.tConfHorarioEntTur = respuesta.ingreso
                grupo.tConfHorarioSalTur = respuesta.salida

                console.log('revisar #2', respuesta)
                console.log('ver #2 ', this.datosGrupos)
                break
        }
    }

    limpiarFormulario() {
        this.nombreGrupo = undefined
        this.descripcionGrupo = undefined
        // this.seleccionarTodo = false
        // this.elegir = false
        this.selHorario = undefined
        this.ingreso = new Date()
        this.salida = new Date()
        // this.inicio = new Date()
        // this.fin = new Date()
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
}
