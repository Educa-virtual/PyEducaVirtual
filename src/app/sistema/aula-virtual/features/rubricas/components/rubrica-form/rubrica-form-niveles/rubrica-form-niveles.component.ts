import { Component, inject, Input, OnInit, OnDestroy } from '@angular/core'
import { ControlContainer, FormArray, FormGroup } from '@angular/forms'
import { RubricaFormService } from '../rubrica-form.service'
import { ApiEvaluacionesService } from '@/app/sistema/evaluaciones/services/api-evaluaciones.service'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { Subject, takeUntil } from 'rxjs'

@Component({
    selector: 'app-rubrica-form-niveles',
    templateUrl: './rubrica-form-niveles.component.html',
    styleUrl: './rubrica-form-niveles.component.scss',
})
export class RubricaFormNivelesComponent implements OnInit, OnDestroy {
    @Input() index: number

    @Input() escalasCalificativas = []
    @Input() criterioForm: FormGroup

    private _parentContainer = inject(ControlContainer)
    public rubricaFormGroup: FormGroup
    private _apiEvaluacionesService = inject(ApiEvaluacionesService)
    private _confirmService = inject(ConfirmationModalService)
    private _unsubscribe$ = new Subject<boolean>()

    constructor(private _rubricaFormService: RubricaFormService) {}

    ngOnInit() {
        console.log(this._parentContainer.control, this.index)
    }

    get nivelesFormArray() {
        return this.criterioForm.get('niveles') as FormArray
    }

    agregarNivel() {
        this._rubricaFormService.addNivelToForm(this.index)
    }

    eliminarNivel(index: number) {
        this._rubricaFormService.eliminarNivelFromForm(this.index, index)
    }

    confirmarEliminar(index) {
        const item = this.nivelesFormArray.at(index).value
        this._confirmService.openConfirm({
            header: '¿Esta seguro de eliminar este nivel?',
            accept: () => {
                this.eliminarRubrica(item, index)
            },
        })
    }

    eliminarRubrica(item, index) {
        this._apiEvaluacionesService
            .eliminarRubrica({ id: item.iNivelEvaId, tipo: 'NIVEL' })
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe({
                next: () => {
                    this.eliminarNivel(index)
                },
            })
    }

    ngOnDestroy() {
        this._unsubscribe$.next(true)
        this._unsubscribe$.complete()
    }
}
