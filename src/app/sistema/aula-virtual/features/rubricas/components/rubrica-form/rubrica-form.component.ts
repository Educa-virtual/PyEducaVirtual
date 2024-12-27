import { Component, inject, OnInit, OnDestroy } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { RubricaFormService } from './rubrica-form.service'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { ApiEvaluacionesService } from '@/app/sistema/aula-virtual/services/api-evaluaciones.service'
import { Subject, takeUntil } from 'rxjs'
import { ActivatedRoute, Router } from '@angular/router'

@Component({
    selector: 'app-rubrica-form',
    templateUrl: './rubrica-form.component.html',
    styleUrl: './rubrica-form.component.scss',
})
export class RubricaFormComponent implements OnInit, OnDestroy {
    rubricas
    public rubricaForm: FormGroup
    public mode: 'EDITAR' | 'CREAR' | 'VIEW' = 'CREAR'

    public escalasCalificativas: any[] = []

    private rubrica = null
    private _formBuilder = inject(FormBuilder)
    private _ref = inject(DynamicDialogRef)
    private _constantesService = inject(ConstantesService)
    private _apiEvaluacionesServ = inject(ApiEvaluacionesService)
    private _unsubscribe$ = new Subject<boolean>()
    public _config = inject(DynamicDialogConfig)

    public route = inject(ActivatedRoute)

    private _params = {
        iCursoId: null,
        idDocCursoId: null,
    }
    constructor(
        private _rubricaFormService: RubricaFormService,
        private router: Router
    ) {}

    ngOnInit() {
        console.log('this.mode en form rubrica')
        console.log(this._config.data.mode)

        this.rubricas = this._config.data.rubricas
        this.rubrica = this._config.data.rubrica
        this._params.iCursoId = this._config.data.iCursoId
        this._params.idDocCursoId = this._config.data.idDocCursoId
        if (!this._params.iCursoId) {
            throw new Error('Error el iCursoId es requerido')
        }

        if (!this._params.idDocCursoId) {
            throw new Error('Error el idDocCursoId es requerido')
        }
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

    patchValuesSelection(rubrica: any) {
        this._rubricaFormService.patchRubricaFormSelection(rubrica)
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
        console.log(this.rubricaForm)
        this._rubricaFormService.initRubricaForm()
        this.rubricaForm = this._rubricaFormService.rubricaForm
        console.log(this.rubricaForm)
    }

    async guardarActualizarRubrica() {
        // validar formulario
        if (this.rubricaForm.invalid) {
            this.rubricaForm.markAllAsTouched()
            return
        }

        const data = this.rubricaForm.value

        data.iDocenteId = this._constantesService.iDocenteId
        data.iCredId = this._constantesService.iCredId
        data.idDocCursoId = this._params.idDocCursoId
        data.iCursoId = this._params.iCursoId

        const instrumento =
            await this._apiEvaluacionesServ.guardarActualizarRubrica(data)

        console.log(instrumento)

        if (this.route.queryParams['_value']?.iEvaluacionId) {
            await this._apiEvaluacionesServ.actualizarRubricaEvaluacion({
                data: JSON.stringify({
                    iInstrumentoId:
                        instrumento.iInstrumentoId ?? data.iInstrumentoId,
                }),
                iEvaluacionId: this.route.queryParams['_value'].iEvaluacionId,
            })
        }

        this.router.navigate([], {
            queryParams: {
                iInstrumentoId:
                    instrumento.iInstrumentoId ?? data.iInstrumentoId,
            },
            queryParamsHandling: 'merge',
            replaceUrl: true,
        })

        this.closeModal('obtenerRubricas')
    }

    closeModal(data) {
        this._ref.close(data)
    }
    ngOnDestroy() {
        this._unsubscribe$.next(true)
        this._unsubscribe$.complete()
    }
}
