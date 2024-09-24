import { Component, inject, OnInit } from '@angular/core'
import { InputTextareaModule } from 'primeng/inputtextarea'
import {
    FormBuilder,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms'
import { InputSwitchModule } from 'primeng/inputswitch'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { ApiEvaluacionesService } from '@/app/sistema/evaluaciones/services/api-evaluaciones.service'
import { CommonInputComponent } from '@/app/shared/components/common-input/common-input.component'
import { ButtonModule } from 'primeng/button'
import { generarIdAleatorio } from '@/app/shared/utils/random-id'
@Component({
    selector: 'app-alternativas-form',
    standalone: true,
    imports: [
        InputTextareaModule,
        FormsModule,
        InputSwitchModule,
        ReactiveFormsModule,
        CommonInputComponent,
        ButtonModule,
    ],
    templateUrl: './alternativas-form.component.html',
    styleUrl: './alternativas-form.component.scss',
})
export class AlternativasFormComponent implements OnInit {
    private _config = inject(DynamicDialogConfig)
    private _ref = inject(DynamicDialogRef)
    private _formBuilder = inject(FormBuilder)
    private _evaluacionesService = inject(ApiEvaluacionesService)
    private pregunta
    private alternativa

    public alternativaFormGroup = this._formBuilder.group({
        iAlternativaId: [generarIdAleatorio()],
        iPreguntaId: [0],
        cAlternativaDescripcion: [null, Validators.required],
        cAlternativaLetra: [null, Validators.required],
        bAlternativaCorrecta: [false, Validators.required],
        cAlternativaExplicacion: [''],
        isLocal: [false],
    })

    ngOnInit() {
        this.pregunta = this._config.data.pregunta
        this.alternativa = this._config.data.alternativa
        if (this.alternativa != null) {
            this.alternativaFormGroup.patchValue(this.alternativa)
            this.alternativaFormGroup
                .get('bAlternativaCorrecta')
                .setValue(
                    this.alternativa.bAlternativaCorrecta == 1 ? true : false
                )
            console.log(this.alternativaFormGroup.value)
        }
    }

    closeModal(data) {
        this._ref.close(data)
    }

    guardarActualizarAlternativa() {
        if (this.alternativaFormGroup.invalid) {
            this.alternativaFormGroup.markAllAsTouched()
            return
        }

        const alternativa = this.alternativaFormGroup.value
        if (this.pregunta.iPreguntaId == 0) {
            alternativa.isLocal = true
            this.closeModal(alternativa)
            return
        }
        this._evaluacionesService
            .guardarActualizarAlternativa(alternativa)
            .subscribe({
                next: (resp: unknown) => {
                    alternativa.iAlternativaId = resp['data'].id
                    this.closeModal(alternativa)
                },
            })
    }
}
