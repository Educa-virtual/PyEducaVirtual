import { CommonModule } from '@angular/common'
import { Component, inject, ViewChild } from '@angular/core'
import { DialogModule } from 'primeng/dialog'
import { TareaFormComponent } from '../tarea-form/tarea-form.component'
import { IActividad } from '@/app/sistema/aula-virtual/interfaces/actividad.interface'
import { ButtonModule } from 'primeng/button'
import { DynamicDialogRef } from 'primeng/dynamicdialog'
import { ApiAulaService } from '@/app/sistema/aula-virtual/services/api-aula.service'
import { ConstantesService } from '@/app/servicios/constantes.service'

@Component({
    selector: 'app-tarea-form-container',
    standalone: true,
    imports: [CommonModule, DialogModule, TareaFormComponent, ButtonModule],
    templateUrl: './tarea-form-container.component.html',
    styleUrl: './tarea-form-container.component.scss',
})
export class TareaFormContainerComponent {
    @ViewChild(TareaFormComponent) tareaFormComponent: TareaFormComponent
    actividad: IActividad | undefined

    private ref = inject(DynamicDialogRef)
    private _aulaService = inject(ApiAulaService)
    private _constantsService = inject(ConstantesService)

    submitFormulario(data) {
        console.log('form', data)
        data.iDocenteId = 1
        this._aulaService.guardarActividad(data).subscribe({
            next: (resp) => {
                console.log(resp)
            },
        })
    }

    cancelar() {
        this.ref.close(null)
    }

    closeModal() {
        this.ref.close(null)
    }
}
