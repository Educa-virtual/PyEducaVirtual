import { ApiEvaluacionesService } from '@/app/sistema/aula-virtual/services/api-evaluaciones.service'
import { CommonModule } from '@angular/common'
import { Component, inject, OnDestroy, OnInit } from '@angular/core'
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms'
import { ButtonModule } from 'primeng/button'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { InputTextareaModule } from 'primeng/inputtextarea'
import { Subject, takeUntil } from 'rxjs'

@Component({
    selector: 'app-logro-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        InputTextareaModule,
        ButtonModule,
    ],
    templateUrl: './logro-form.component.html',
    styleUrl: './logro-form.component.scss',
})
export class LogroFormComponent implements OnDestroy, OnInit {
    public logroForm: FormGroup

    private data = {
        logro: null,
        iEvalPregId: null,
    }

    // injeccion de depedencias
    private _formBuilder = inject(FormBuilder)
    private _ref = inject(DynamicDialogRef)
    private _config = inject(DynamicDialogConfig)
    private _evaluacionApiService = inject(ApiEvaluacionesService)

    private _unsubscribe$ = new Subject<boolean>()

    constructor() {}

    ngOnInit() {
        this.data = this._config.data ?? { logro: null, iEvalPregId: null }
        this.initForm(this.data.logro)
    }

    initForm(logro) {
        this.logroForm = this._formBuilder.group({
            cNivelLogroEvaDescripcion: [
                logro?.cNivelLogroEvaDescripcion,
                Validators.required,
            ],
        })
    }

    guardarActualizarLogro() {
        const data = this.logroForm.value
        data.iNivelLogroEvaId = this.data.logro?.iNivelLogroEvaId
        data.iEvalPregId = this.data.iEvalPregId

        this._evaluacionApiService
            .guardarActualizarLogros(data)
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe({
                next: (resp) => {
                    this.logroForm.reset()
                    data.iNivelLogroEvaId = resp.id
                    this.closeModal(data)
                },
            })
    }

    closeModal(data) {
        this._ref.close(data)
    }

    // desuscribe de los observables
    ngOnDestroy() {
        this._unsubscribe$.next(true)
        this._unsubscribe$.complete()
    }
}
