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
// Selector que se utiliza para referenciar este componente en la plantilla de otros componentes.
@Component({
    selector: 'app-tarea-form-container',
    standalone: true,
    imports: [CommonModule, DialogModule, TareaFormComponent, ButtonModule],
    templateUrl: './tarea-form-container.component.html',
    styleUrl: './tarea-form-container.component.scss',
    providers: [DialogService],
})
// Clase principal que gestiona el contenedor del formulario de tareas.
export class TareaFormContainerComponent {
    @ViewChild(TareaFormComponent) tareaFormComponent: TareaFormComponent
    // Propiedad para almacenar la actividad actual (opcional).
    actividad: IActividad | undefined
    action: string
    contenidoSemana = []

    tarea = []
    idDocCursoId: any
    private ref = inject(DynamicDialogRef)
    private _generalService = inject(GeneralService)
    private _constantsService = inject(ConstantesService)
    constructor(private dialogConfig: DynamicDialogConfig) {
        this.contenidoSemana = this.dialogConfig.data.contenidoSemana
        this.action = this.dialogConfig.data.action
        this.actividad = this.dialogConfig.data.actividad
        this.idDocCursoId = this.dialogConfig.data.idDocCursoId
        // Verifica si hay una actividad específica y si la acción es 'ACTUALIZAR'
        if (this.actividad?.ixActivadadId && this.action === 'ACTUALIZAR') {
            this.getTareasxiTareaId(this.actividad.ixActivadadId)
        }
    }
    /*Esta función se utiliza para enviar un formulario con datos relacionados con
una tarea o actividad a un servicio backend, con la finalidad de guardarla o actualizarla en la base de datos.*/
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
        data.idDocCursoId = this.idDocCursoId
        let prefix = ''
        if (this.action === 'GUARDAR') {
            data.iContenidoSemId =
                this.dialogConfig.data.contenidoSemana.iContenidoSemId
            prefix = !data.bReutilizarTarea
                ? 'programacion-actividades'
                : !data.iProgActId
                  ? 'programacion-actividades'
                  : 'tareas'
        } else {
            prefix = 'tareas'
        }

        const params = {
            petition: 'post',
            group: 'aula-virtual',
            prefix: prefix,
            ruta: 'store',
            data: data,
            params: { skipSuccessMessage: true },
        }

        this._generalService.getGralPrefix(params).subscribe({
            next: (resp) => {
                this.closeModal(resp.validated)
            },
        })
    }
    // funcio  cancelar
    cancelar() {
        // this.tarea = null
        this.ref.close(null)
    }
    // funcion que cierra el  modal
    closeModal(resp: boolean) {
        // this.tarea = null
        this.ref.close(resp)
    }
    // Método para obtener una tarea específica por su ID (iTareaId)
    getTareasxiTareaId(iTareaId) {
        const params = {
            petition: 'post',
            group: 'aula-virtual',
            prefix: 'tareas',
            ruta: 'list',
            data: {
                opcion: 'CONSULTARxiTareaId',
                iTareaId: iTareaId,
            },
            params: { skipSuccessMessage: true },
        }
        this._generalService.getGralPrefix(params).subscribe({
            next: (resp) => {
                this.tarea = resp.data.length
                    ? resp.data[0]
                    : this.closeModal(resp.validated)
            },
        })
    }
}
