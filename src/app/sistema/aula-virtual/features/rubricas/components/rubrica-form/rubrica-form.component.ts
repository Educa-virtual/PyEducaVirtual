import { Component, inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { RubricaFormService } from './rubrica-form.service'
import { DynamicDialogRef } from 'primeng/dynamicdialog'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { ApiEvaluacionesService } from '@/app/sistema/evaluaciones/services/api-evaluaciones.service'
import { Subject, takeUntil } from 'rxjs'

@Component({
    selector: 'app-rubrica-form',
    templateUrl: './rubrica-form.component.html',
    styleUrl: './rubrica-form.component.scss',
})
export class RubricaFormComponent implements OnInit {
    public rubricaForm: FormGroup
    public mode: 'EDITAR' | 'CREAR' = 'CREAR'

    private _formBuilder = inject(FormBuilder)
    private _ref = inject(DynamicDialogRef)
    private _constantesService = inject(ConstantesService)
    private _apiEvaluacionesServ = inject(ApiEvaluacionesService)
    private _unsubscribe$ = new Subject<boolean>()

    private _params = {
        iCursoId: 1,
        idDocCursoId: 1,
        iDocenteId: 1,
    }
    constructor(private _rubricaFormService: RubricaFormService) {}

    ngOnInit() {
        this.initForm()
    }

    initForm() {
        this._rubricaFormService.initRubricaForm()
        this.rubricaForm = this._rubricaFormService.rubricaForm

        console.log(this.rubricaForm)
    }

    guardarActualizarRubrica() {
        const data = this.rubricaForm.value
        data.iDocenteId = this._params.iDocenteId
        data.iCredId = this._constantesService.iCredId
        data.idDocCursoId = this._params.idDocCursoId
        data.iCursoId = this._params.iCursoId

        this._apiEvaluacionesServ
            .guardarActualizarRubrica(data)
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe({
                next: (data) => {
                    this.closeModal(data)
                },
            })
    }

    closeModal(data) {
        this._ref.close(data)
    }
}
