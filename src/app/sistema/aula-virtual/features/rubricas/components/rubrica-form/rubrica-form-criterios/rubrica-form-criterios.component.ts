import { Component, inject, Input, OnDestroy } from '@angular/core'
import { FormArray, FormGroup } from '@angular/forms'
import { RubricaFormService } from '../rubrica-form.service'
import { MenuItem } from 'primeng/api'
import { ApiEvaluacionesService } from '@/app/sistema/evaluaciones/services/api-evaluaciones.service'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { Subject, takeUntil } from 'rxjs'

@Component({
    selector: 'app-rubrica-form-criterios',
    templateUrl: './rubrica-form-criterios.component.html',
    styleUrl: './rubrica-form-criterios.component.scss',
})
export class RubricaFormCriteriosComponent implements OnDestroy {
    @Input() rubricaForm: FormGroup
    @Input() escalasCalificativas = []
    public criterioIndex = -1
    public accionesCriterio: MenuItem[] = [
        {
            label: 'Duplicar',
            icon: 'pi pi-copy',
            command: () => {
                this.duplicarCriterio()
            },
        },
        {
            label: 'Eliminar',
            icon: 'pi pi-trash',
            command: () => {
                this.confirmarEliminar()
            },
        },
    ]

    private _apiEvaluacionesService = inject(ApiEvaluacionesService)
    private _confirmService = inject(ConfirmationModalService)
    private _unsubscribe$ = new Subject<boolean>()

    constructor(private _rubricaFormService: RubricaFormService) {}

    get criterios() {
        return this.rubricaForm.get('criterios') as FormArray
    }

    agregarCriterio() {
        this._rubricaFormService.addCriterioToForm()
    }

    duplicarCriterio() {
        console.log(this.criterioIndex, 'index a duplicar')
    }

    eliminarCriterioLocal() {
        this._rubricaFormService.eliminarCriteriofromForm(this.criterioIndex)
    }

    confirmarEliminar() {
        const item = this.criterios.at(this.criterioIndex).value
        this._confirmService.openConfirm({
            header: '¿Esta seguro de eliminar este criterio?',
            accept: () => {
                this.eliminarCriterio(item)
            },
        })
    }

    eliminarCriterio(item) {
        this._apiEvaluacionesService
            .eliminarRubrica({ id: item.iCriterioId, tipo: 'CRITERIO' })
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe({
                next: () => {
                    this.eliminarCriterioLocal()
                },
            })
    }

    ngOnDestroy() {
        this._unsubscribe$.next(true)
        this._unsubscribe$.complete()
    }
}
