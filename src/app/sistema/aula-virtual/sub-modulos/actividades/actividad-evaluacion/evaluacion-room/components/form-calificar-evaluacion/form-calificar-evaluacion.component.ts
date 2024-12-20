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
import { GeneralService } from '@/app/servicios/general.service'
import { MessageService } from 'primeng/api'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

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
    private _GeneralService = inject(GeneralService)
    private _MessageService = inject(MessageService)

    @Output() accionBtnItem = new EventEmitter()

    @Input() showFormCalificarEvaluacion: boolean = false
    @Input() name: string = ''
    @Input() estudiante

    cConclusionDescriptiva

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
        const params = {
            petition: 'post',
            group: 'evaluaciones',
            prefix: 'evaluacion-promedios',
            ruta: 'guardarConclusionxiEvalPromId',
            data: {
                iEvalPromId: this.estudiante.iEvalPromId,
                cConclusionDescriptiva: this.cConclusionDescriptiva,
            },
        }

        this._GeneralService.getGralPrefix(params).subscribe({
            next: (response) => {
                if (response.validated) {
                    this.cConclusionDescriptiva = null
                    this.accionBtn({ accion: 'close-modal', item: [] })
                }
            },
            complete: () => {},
            error: (error) => {
                console.log(error)
                this._MessageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error,
                })
            },
        })
    }
}
