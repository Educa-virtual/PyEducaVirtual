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
import { ConstantesService } from '@/app/servicios/constantes.service'
import { GeneralService } from '@/app/servicios/general.service'

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
    action: string
    contenidoSemana = []

    private ref = inject(DynamicDialogRef)
    private _generalService = inject(GeneralService)
    private _constantsService = inject(ConstantesService)
    constructor(private dialogConfig: DynamicDialogConfig) {
        this.contenidoSemana = this.dialogConfig.data.contenidoSemana
        this.action = this.dialogConfig.data.action
    }

    submitFormulario(data) {
        //OPCION: ACTUALIZAR O GUARDAR +xProgActxiTarea
        data.cTareaTitulo = !data.bReutilizarTarea
            ? data.cTareaTitulo
            : data.iProgActId
              ? data.cTareaTitulo.cTareaTitulo
              : data.cTareaTitulo
        data.cProgActTituloLeccion = !data.bReutilizarTarea
            ? data.cTareaTitulo
            : data.iProgActId
              ? data.cTareaTitulo.cTareaTitulo
              : data.cTareaTitulo
        data.opcion = this.action + 'xProgActxiTarea'
        data.iDocenteId = this._constantsService.iDocenteId
        data.iActTipoId = this.dialogConfig.data.iActTipoId
        data.iContenidoSemId =
            this.dialogConfig.data.contenidoSemana.iContenidoSemId
        console.log(data)
        const params = {
            petition: 'post',
            group: 'aula-virtual',
            prefix: !data.bReutilizarTarea
                ? 'programacion-actividades'
                : !data.iProgActId
                  ? 'programacion-actividades'
                  : 'tareas',
            ruta: 'store',
            data: data,
            params: { skipSuccessMessage: true },
        }

        this._generalService.getGralPrefix(params).subscribe({
            next: (resp) => {
                console.log(resp)
                //this.closeModal()
            },
        })
    }

    cancelar() {
        // this.tarea = null
        this.ref.close(null)
    }

    closeModal() {
        // this.tarea = null
        this.ref.close(null)
    }
}
