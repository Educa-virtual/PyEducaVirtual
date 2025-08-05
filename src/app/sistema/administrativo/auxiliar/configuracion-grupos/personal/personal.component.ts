import {
    Component,
    inject,
    Input,
    SimpleChanges,
    OnChanges,
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { PrimengModule } from '@/app/primeng.module'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { GeneralService } from '@/app/servicios/general.service'
import { MessageService } from 'primeng/api'

@Component({
    selector: 'app-personal',
    standalone: true,
    imports: [CommonModule, FormsModule, PrimengModule],
    templateUrl: './personal.component.html',
    styleUrl: './personal.component.scss',
})
export class PersonalComponent implements OnChanges {
    @Input() personal: any[] = []
    @Input() datosGrupos: any[] = []
    inicio: Date = new Date()
    fin: Date = new Date()
    seleccionarTodo = false
    iSedeId: string
    iYAcadId: string
    grupoEliminado: any[] = []
    grupoSeleccionado: any[] = []
    iGrupoId: any
    private constantesService = inject(ConstantesService)
    private generalService = inject(GeneralService)

    constructor(
        // private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) {
        this.iSedeId = this.constantesService.iSedeId
        this.iYAcadId = this.constantesService.iYAcadId
    }
    ngOnChanges(changes: SimpleChanges): void {
        // if (changes['datosGrupos']) {
        //     console.log('dato cambió:', changes['datosGrupos'].currentValue);
        // }
        if (changes['personal']) {
            console.log('personal cambió:', changes['personal'].currentValue)
            this.personal = [...changes['personal'].currentValue]
        }
    }

    // Agregar grupo Seleccionado
    cambiarSeleccion(lista: any) {
        const encontrado = this.grupoSeleccionado.some(
            (item) => item.iPersId == lista.iPersId
        )

        if (!encontrado) {
            lista.seleccionar = 1
            this.grupoSeleccionado = [...this.grupoSeleccionado, lista]
        }

        this.personal = this.personal.filter(
            (item) => item.iPersId != lista.iPersId
        )
    }

    // Remover personal Seleccionado
    quitarSeleccion(lista: any) {
        const encontrado = this.personal.some(
            (item) => item.iPersId == lista.iPersId
        )

        if (!encontrado) {
            lista.seleccionar = 0
            this.personal = [...this.personal, lista]
        }

        this.grupoSeleccionado = this.grupoSeleccionado.filter(
            (item) => item.iPersId != lista.iPersId
        )
    }

    guardarPersonal() {
        console.log(this.grupoSeleccionado)
        /*if (!this.iGrupoId || this.grupoSeleccionado.length == 0) return

        const grupoPersona = JSON.stringify(this.grupoSeleccionado)
        const params = {
            petition: 'post',
            group: 'asi',
            prefix: 'grupos',
            ruta: 'guardar-persona-grupo',
            data: {
                iGrupoId: this.iGrupoId,
                grupoPersonal: grupoPersona,
            },
        }
        this.getInformation(params, 'guardar_persona_grupo')*/
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

    accionBtnItem(elemento): void {
        const { accion } = elemento
        const { item } = elemento

        switch (accion) {
            case 'guardar_persona':
                if (item) {
                    console.log(item)
                }
                break
            case 'guardar_persona_grupo':
                const resultado = item.respuesta
                if (resultado == 1) {
                    const nuevoPersonal = item.persona
                    this.grupoSeleccionado.push(nuevoPersonal)
                    this.datosGrupos.forEach((item) => {
                        if (item.iGrupoId == this.iGrupoId) {
                            item.personal = this.grupoSeleccionado
                        }
                    })

                    this.reestablecerValores()
                    this.mensajeExito('Se registraron los personales')
                } else {
                    this.mensajeAlerta('No se pudo registrar el personal')
                }
                break
        }
    }

    reestablecerValores() {
        this.iGrupoId = null
        this.grupoSeleccionado = []
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

    // Captura el grupo seleccionado
    verPersonal(personal: any) {
        this.iGrupoId = Number(personal.iGrupoId)
        const persona = JSON.parse(personal.personal || '[]')
        this.grupoSeleccionado = persona
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
