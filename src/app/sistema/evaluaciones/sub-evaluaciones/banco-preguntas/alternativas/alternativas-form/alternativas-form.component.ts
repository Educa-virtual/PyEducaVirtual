import { Component, inject, OnInit } from '@angular/core'
import { InputTextareaModule } from 'primeng/inputtextarea'
import {
    FormBuilder,
    FormControl,
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
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
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
    private _confirmDialogService = inject(ConfirmationModalService)
    private pregunta
    private alternativa
    private alternativas

    public alternativaFormGroup = this._formBuilder.group({
        iAlternativaId: new FormControl<number | string>(0),
        iPreguntaId: [0],
        cAlternativaDescripcion: [null, Validators.required],
        cAlternativaLetra: [
            null,
            [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(1),
            ],
        ],
        bAlternativaCorrecta: [false, Validators.required],
        cAlternativaExplicacion: [''],
        isLocal: [false],
    })

    ngOnInit() {
        this.pregunta = this._config.data.pregunta
        this.alternativa = this._config.data.alternativa
        this.alternativas = this._config.data.alternativas

        if (this.pregunta.iPreguntaId != 0) {
            this.alternativaFormGroup
                .get('iPreguntaId')
                .setValue(this.pregunta.iPreguntaId)
        }
        // editando alternativa
        if (this.alternativa != null) {
            this.alternativaFormGroup.patchValue(this.alternativa)
            this.alternativaFormGroup
                .get('bAlternativaCorrecta')
                .setValue(
                    this.alternativa.bAlternativaCorrecta == 1 ? true : false
                )
        }
    }

    getNewAlternativas(alternativa) {
        const newAlternativas = [...this.alternativas]
        alternativa.bAlternativaCorrecta = alternativa.bAlternativaCorrecta
            ? 1
            : 0
        const existeAlternativa = newAlternativas.some((x) => {
            console.log(x.iAlternativaId, alternativa.iAlternativaId)

            return x.iAlternativaId == alternativa.iAlternativaId
        })

        // si existe actualizar alternativa
        if (existeAlternativa) {
            const index = newAlternativas.findIndex(
                (x) => x.iAlternativaId == alternativa.iAlternativaId
            )
            newAlternativas[index] = alternativa
        } else {
            newAlternativas.push(alternativa)
        }
        return newAlternativas
    }

    closeModal(data) {
        this._ref.close(data)
    }

    guardarActualizarAlternativa() {
        if (this.alternativaFormGroup.invalid) {
            this.alternativaFormGroup.markAllAsTouched()
            return
        }

        // const newAlternativas = this.getNewAlternativas(
        //     this.alternativaFormGroup.value
        // )

        // const invalidMessage = getAlternativaValidation(
        //     parseInt(this.pregunta.iTipoPregId, 10),
        //     newAlternativas
        // )

        // if (invalidMessage != null) {
        //     this._confirmDialogService.openAlert({ header: invalidMessage })
        //     return
        // }
        const alternativa = this.alternativaFormGroup.value

        if (this.pregunta.iPreguntaId == 0) {
            // generar id por defecto
            alternativa.iAlternativaId = generarIdAleatorio()
            if (this.alternativa != null) {
                // si estamos editando asignar el id inicial
                alternativa.iAlternativaId = this.alternativa.iAlternativaId
            }
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
