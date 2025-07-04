import {
    Component,
    EventEmitter,
    inject,
    Input,
    OnChanges,
    Output,
} from '@angular/core'
import { ModalPrimengComponent } from '../../../../../../../../shared/modal-primeng/modal-primeng.component'
import { PrimengModule } from '@/app/primeng.module'
import { MessageService } from 'primeng/api'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { EvaluacionPromediosService } from '@/app/servicios/eval/evaluacion-promedios.service'
import { ConstantesService } from '@/app/servicios/constantes.service'

@Component({
    selector: 'app-form-calificar-evaluacion',
    standalone: true,
    imports: [
        ModalPrimengComponent,
        PrimengModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    templateUrl: './form-calificar-evaluacion.component.html',
    styleUrl: './form-calificar-evaluacion.component.scss',
})
export class FormCalificarEvaluacionComponent implements OnChanges {
    private _MessageService = inject(MessageService)
    private _EvaluacionPromediosService = inject(EvaluacionPromediosService)
    private _ConstantesService = inject(ConstantesService)

    @Output() accionBtnItem = new EventEmitter()

    @Input() showFormCalificarEvaluacion: boolean = false
    @Input() name: string = ''
    @Input() estudiante

    cConclusionDescriptiva
    isLoading: boolean = false

    ngOnChanges(changes) {
        if (changes.showFormCalificarEvaluacion?.currentValue) {
            this.showFormCalificarEvaluacion =
                changes.showFormCalificarEvaluacion.currentValue
        }
        if (changes.estudiante?.currentValue) {
            this.estudiante = changes.estudiante.currentValue
            this.cConclusionDescriptiva =
                this.estudiante?.cConclusionDescriptiva
        }
    }
    accionBtn(elemento): void {
        const { accion } = elemento
        const { item } = elemento

        switch (accion) {
            case 'close-modal':
                this.accionBtnItem.emit({
                    accion: 'close-modal-preguntas-form',
                    item,
                })
                break
        }
    }

    guardarConclusionxiEvalPromId() {
        if (this.isLoading) return // evitar doble clic
        this.isLoading = true
        const data = {
            iEvaluacionId: this.estudiante.iEvaluacionId,
            iEstudianteId: this.estudiante.iEstudianteId,
            cConclusionDescriptiva: this.cConclusionDescriptiva,
            iCredId: this._ConstantesService.iCredId,
        }
        this._EvaluacionPromediosService
            .guardarConclusionxiEvaluacionIdxiEstudianteId(data)
            .subscribe({
                next: (resp) => {
                    if (resp.validated) {
                        this.mostrarMensajeToast({
                            severity: 'success',
                            summary: 'Genial!',
                            detail: resp.message,
                        })
                        this.cConclusionDescriptiva = null
                        this.accionBtn({ accion: 'close-modal', item: [] })
                    }
                    this.isLoading = false
                },
                error: (error) => {
                    const errores = error?.error?.errors
                    if (error.status === 422 && errores) {
                        // Recorre y muestra cada mensaje de error
                        Object.keys(errores).forEach((campo) => {
                            errores[campo].forEach((mensaje: string) => {
                                this.mostrarMensajeToast({
                                    severity: 'error',
                                    summary: 'Error de validación',
                                    detail: mensaje,
                                })
                            })
                        })
                    } else {
                        // Error genérico si no hay errores específicos
                        this.mostrarMensajeToast({
                            severity: 'error',
                            summary: 'Error',
                            detail:
                                error?.error?.message ||
                                'Ocurrió un error inesperado',
                        })
                    }
                    this.isLoading = false
                },
            })
    }

    mostrarMensajeToast(message) {
        this._MessageService.add(message)
    }
}
