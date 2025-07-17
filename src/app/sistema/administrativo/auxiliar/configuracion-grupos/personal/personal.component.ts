import { Component, inject, Input } from '@angular/core'
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
export class PersonalComponent {
    @Input() personal: any[] = []
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

    // Agregar grupo Seleccionado
    cambiarSeleccion(lista: any) {
        const encontrado = this.grupoSeleccionado.some(
            (item) => item.iPersId == lista.iPersId
        )

        if (!encontrado) {
            lista.seleccionar = 1
            this.grupoSeleccionado.push(lista)
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
            this.personal.push(lista)
        }

        this.grupoSeleccionado = this.grupoSeleccionado.filter(
            (item) => item.iPersId != lista.iPersId
        )
    }

    guardarPersonal() {
        if (!this.iGrupoId || this.grupoSeleccionado.length == 0) return

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
        this.getInformation(params, 'guardar_persona_grupo')
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

    verPersonal(personal: any) {
        this.iGrupoId = Number(personal.iGrupoId)
        const persona = JSON.parse(personal.personal || '[]')
        this.grupoSeleccionado = persona
    }
}
