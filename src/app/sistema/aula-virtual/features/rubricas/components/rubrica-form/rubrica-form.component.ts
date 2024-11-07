import { Component, inject, OnInit, OnDestroy } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { RubricaFormService } from './rubrica-form.service'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { ApiEvaluacionesService } from '@/app/sistema/aula-virtual/services/api-evaluaciones.service'
import { Subject, takeUntil } from 'rxjs'

@Component({
    selector: 'app-rubrica-form',
    templateUrl: './rubrica-form.component.html',
    styleUrl: './rubrica-form.component.scss',
})
export class RubricaFormComponent implements OnInit, OnDestroy {
    public rubricaForm: FormGroup
    public mode: 'EDITAR' | 'CREAR' | 'VIEW' = 'CREAR'

    public escalasCalificativas: any[] = []

    private rubrica = null
    private _formBuilder = inject(FormBuilder)
    private _ref = inject(DynamicDialogRef)
    private _constantesService = inject(ConstantesService)
    private _apiEvaluacionesServ = inject(ApiEvaluacionesService)
    private _unsubscribe$ = new Subject<boolean>()
    private _config = inject(DynamicDialogConfig)

    private _params = {
        iCursoId: 1,
        idDocCursoId: 1,
    }
    constructor(private _rubricaFormService: RubricaFormService) {}

    ngOnInit() {
        this.rubrica = this._config.data.rubrica
        this._params.iCursoId = this._config.data.iCursoId
        this._params.idDocCursoId = this._config.data.idDocCursoId
        this.initForm()
        this.getData()
        this.handleMode()
    }

    handleMode() {
        if (this.rubrica != null) {
            this.mode = 'EDITAR'
            this.patchValues()
        }
    }

    patchValues() {
        this._rubricaFormService.patchRubricaForm(this.rubrica)
    }

    getData() {
        this.obtenerEscalaCalificaciones()
    }

    obtenerEscalaCalificaciones() {
        this._apiEvaluacionesServ
            .obtenerEscalaCalificaciones()
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe({
                next: (data) => {
                    this.escalasCalificativas = data
                },
            })
    }

    initForm() {
        this._rubricaFormService.initRubricaForm()
        this.rubricaForm = this._rubricaFormService.rubricaForm
    }

    guardarActualizarRubrica() {
        // validar formulario
        if (this.rubricaForm.invalid) {
            this.rubricaForm.markAllAsTouched()
            return
        }
        const data = this.rubricaForm.value
        data.iDocenteId = this._constantesService.iDocenteId
        data.iCredId = this._constantesService.iCredId
        data.idDocCursoId = this._constantesService.idDocCursoId
        data.iCursoId = this._constantesService.iCursoId

        this._apiEvaluacionesServ
            .guardarActualizarRubrica(data)
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe({
                next: () => {
                    this.closeModal('obtenerRubricas')
                },
            })
    }

    closeModal(data) {
        this._ref.close(data)
    }
    ngOnDestroy() {
        this._unsubscribe$.next(true)
        this._unsubscribe$.complete()
    }
}
