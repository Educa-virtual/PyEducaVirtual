import { CommonModule } from '@angular/common'
import { Component, inject, ViewChild } from '@angular/core'
import { DialogModule } from 'primeng/dialog'
import { TareaFormComponent } from '../tarea-form/tarea-form.component'
import { IActividad } from '@/app/sistema/aula-virtual/interfaces/actividad.interface'
import { ButtonModule } from 'primeng/button'
import {
    DialogService,
    DynamicDialogConfig,
    DynamicDialogRef,
} from 'primeng/dynamicdialog'
import { ApiAulaService } from '@/app/sistema/aula-virtual/services/api-aula.service'
import { ConstantesService } from '@/app/servicios/constantes.service'

@Component({
    selector: 'app-tarea-form-container',
    standalone: true,
    imports: [CommonModule, DialogModule, TareaFormComponent, ButtonModule],
    templateUrl: './tarea-form-container.component.html',
    styleUrl: './tarea-form-container.component.scss',
    providers: [DialogService],
})
export class TareaFormContainerComponent {
    @ViewChild(TareaFormComponent) tareaFormComponent: TareaFormComponent
    actividad: IActividad | undefined
    tarea
    action: string
    private ref = inject(DynamicDialogRef)
    private _aulaService = inject(ApiAulaService)
    private _constantsService = inject(ConstantesService)
    constructor(private dialogConfig: DynamicDialogConfig) {
        this.tarea = this.dialogConfig.data.actividad.iTareaId
            ? this.dialogConfig.data.actividad
            : null
        this.action = this.dialogConfig.data.action
    }

    submitFormulario(data) {
        data.opcion = this.action
        data.iDocenteId = 1
        data.iActTipoId = this.dialogConfig.data.iActTipoId
        data.iContenidoSemId = this.dialogConfig.data.iContenidoSemId
        this._aulaService.guardarActividad(data).subscribe({
            next: (resp) => {
                console.log(resp)
                this.closeModal()
            },
        })
    }

    cancelar() {
        this.tarea = null
        this.ref.close(null)
    }

    closeModal() {
        this.tarea = null
        this.ref.close(null)
    }
}
