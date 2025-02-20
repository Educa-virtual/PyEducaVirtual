import { Component, inject, Input, OnDestroy } from '@angular/core'
import { FormArray, FormGroup } from '@angular/forms'
import { RubricaFormService } from '../rubrica-form.service'
import { ApiEvaluacionesService } from '@/app/sistema/aula-virtual/services/api-evaluaciones.service'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { Subject, takeUntil } from 'rxjs'

@Component({
    selector: 'app-rubrica-form-niveles',
    templateUrl: './rubrica-form-niveles.component.html',
    styleUrl: './rubrica-form-niveles.component.scss',
})
export class RubricaFormNivelesComponent implements OnDestroy {
    @Input() index: number

    @Input() escalasCalificativas = []
    @Input() criterioForm: FormGroup

    public rubricaFormGroup: FormGroup
    private _apiEvaluacionesService = inject(ApiEvaluacionesService)
    private _confirmService = inject(ConfirmationModalService)
    private _unsubscribe$ = new Subject<boolean>()

    constructor(private _rubricaFormService: RubricaFormService) {}

    get nivelesFormArray() {
        const niveles = this.criterioForm.get('niveles') as FormArray
        return niveles
    }

    agregarNivel() {
        this._rubricaFormService.addNivelToForm(this.index)
    }

    eliminarNivelLocal(index: number) {
        this._rubricaFormService.eliminarNivelFromForm(this.index, index)
    }

    confirmarEliminar(index) {
        const item = this.nivelesFormArray.at(index).value
        const esLocal = item.iNivelEvaId === 0
        this._confirmService.openConfirm({
            header: '¿Esta seguro de eliminar este nivel?',
            accept: () => {
                if (esLocal) {
                    this.eliminarNivelLocal(index)
                } else {
                    this.eliminarRubrica(item, index)
                }
            },
        })
    }

    eliminarRubrica(item, index) {
        this._apiEvaluacionesService
            .eliminarRubrica({ id: item.iNivelEvaId, tipo: 'NIVEL' })
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe({
                next: () => {
                    this.eliminarNivelLocal(index)
                },
            })
    }

    ngOnDestroy() {
        this._unsubscribe$.next(true)
        this._unsubscribe$.complete()
    }
}
