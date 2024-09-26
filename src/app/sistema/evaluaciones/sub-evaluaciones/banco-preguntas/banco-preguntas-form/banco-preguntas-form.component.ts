import { Component, inject, OnInit } from '@angular/core'
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms'
import { DropdownModule } from 'primeng/dropdown'
import { InputSwitchModule } from 'primeng/inputswitch'
import { EditorModule } from 'primeng/editor'
import { TabViewModule } from 'primeng/tabview'
import { InputTextModule } from 'primeng/inputtext'
import { AlternativasComponent } from '../alternativas/alternativas.component'
import { AccordionModule } from 'primeng/accordion'
import { ButtonModule } from 'primeng/button'
import { CommonInputComponent } from '@/app/shared/components/common-input/common-input.component'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { ApiEvaluacionesService } from '../../../services/api-evaluaciones.service'
import { StepsModule } from 'primeng/steps'
import { getAlternativaValidation } from '../alternativas/get-alternativa-validation'

@Component({
    selector: 'app-banco-preguntas-form',
    standalone: true,
    imports: [
        DropdownModule,
        InputSwitchModule,
        EditorModule,
        TabViewModule,
        InputTextModule,
        AlternativasComponent,
        ButtonModule,
        AccordionModule,
        ReactiveFormsModule,
        CommonInputComponent,
        StepsModule,
    ],
    templateUrl: './banco-preguntas-form.component.html',
    styleUrl: './banco-preguntas-form.component.scss',
})
export class BancoPreguntasFormComponent implements OnInit {
    public tipoPreguntas = []
    customOptions = [
        {
            import: 'attributors/style/size',
            whitelist: ['12px', '20px', '24px'],
        },
        // You can import additional attributors for alignments, colors etc. here
    ]
    // public alternativas = []
    public mode: 'EDITAR' | 'CREAR' = 'CREAR'
    public pregunta
    public pasos = [
        {
            label: 'Información Pregunta',
        },
        {
            label: 'Alternativas',
        },
    ]
    public activeIndex = 0

    private _formBuilder = inject(FormBuilder)
    private _config = inject(DynamicDialogConfig)
    private _evaluacionesService = inject(ApiEvaluacionesService)
    private _ref = inject(DynamicDialogRef)

    public bancoPreguntasForm: FormGroup = this._formBuilder.group({
        0: this._formBuilder.group({
            iPreguntaId: [0],
            iTipoPregId: [null, [Validators.required]],
            iCursoId: [null, [Validators.required]],
            cPregunta: [null, [Validators.required]],
            cPreguntaTextoAyuda: [''],
            iPreguntaNivel: [null, [Validators.required]],
            iPreguntaPeso: [null, [Validators.required]],
            // dtPreguntaTiempo: [null, [Validators.required]],
            iHoras: [0, [Validators.required]],
            iMinutos: [0, [Validators.required]],
            iSegundos: [0, [Validators.required]],
            cPreguntaClave: [
                null,
                [
                    Validators.required,
                    Validators.minLength(1),
                    Validators.maxLength(1),
                ],
            ],
        }),
        1: this._formBuilder.group({
            alternativas: [
                [],
                [Validators.required, this.alternativasValidator()],
            ],
        }),
    })

    ngOnInit() {
        this.bancoPreguntasForm
            .get('0.cPregunta')
            .valueChanges.subscribe((value) => {
                console.log(value)
            })

        this.tipoPreguntas = this._config.data.tipoPreguntas.filter((item) => {
            return item.iTipoPregId !== 0
        })
        this.pregunta = this._config.data.pregunta

        this.patchForm(this.pregunta, this._config.data.iCursoId)

        if (this.pregunta?.iPreguntaId !== 0) {
            this.mode = 'EDITAR'
            this.obtenerAlternativas()
        }

        this.bancoPreguntasForm
            .get('0.iTipoPregId')
            ?.valueChanges.subscribe((value) => {
                this.handleTipoPreguntaChange(value)
            })
    }

    get alternativas() {
        return this.bancoPreguntasForm.get('1.alternativas').value
    }

    set alternativas(value) {
        this.bancoPreguntasForm.get('1.alternativas').setValue(value)
    }

    alternativasChange(alternativas) {
        console.log(alternativas)
        this.alternativas = alternativas
    }

    // avanzar steps
    goStep(opcion: string) {
        switch (opcion) {
            case 'next':
                if (
                    this.activeIndex === 0 &&
                    this.bancoPreguntasForm.get(this.activeIndex.toString())
                        .invalid
                ) {
                    this.bancoPreguntasForm.markAllAsTouched()
                    return
                }
                if (this.activeIndex !== 1) {
                    this.activeIndex++
                }
                break
            case 'back':
                if (this.activeIndex !== 0) {
                    this.activeIndex--
                }
                break
        }
    }

    obtenerAlternativas() {
        this._evaluacionesService
            .obtenerAlternativaByPreguntaId(this.pregunta.iPreguntaId)
            .subscribe({
                next: (resp: unknown) => {
                    this.alternativas = resp['data']
                },
            })
    }

    patchForm(pregunta, iCursoId) {
        this.bancoPreguntasForm.get('0').patchValue(pregunta)
        this.bancoPreguntasForm.get('0.iCursoId').setValue(iCursoId)
    }

    // escuchar cambio de tipo de preguntas y activar validaciones de las alternativas
    handleTipoPreguntaChange(tipoPregunta: number): void {
        console.log(tipoPregunta)

        const alternativasControl =
            this.bancoPreguntasForm.get('1.alternativas')
        if (alternativasControl) {
            // Reaplicar las validaciones personalizadas según el tipo de pregunta
            alternativasControl.updateValueAndValidity()
        }
    }

    // validaciones alternativas
    alternativasValidator() {
        return (control: AbstractControl) => {
            let tipoPregunta =
                this.bancoPreguntasForm?.get('0.iTipoPregId')?.value
            const alternativas = control.value
            tipoPregunta = parseInt(tipoPregunta, 10)

            const errorMessage = getAlternativaValidation(
                tipoPregunta,
                alternativas
            )
            if (errorMessage) {
                return {
                    alternativasInvalidas: errorMessage,
                }
            }
            return errorMessage
        }
    }

    closeModal(data) {
        this._ref.close(data)
    }

    guardarActualizarBancoPreguntas() {
        if (this.bancoPreguntasForm.invalid) {
            this.bancoPreguntasForm.markAllAsTouched()
            return
        }

        if (this.alternativas.length == 0) {
            return
        }

        const pregunta = this.bancoPreguntasForm.get('0').value
        pregunta.datosAlternativas = this.alternativas
        this._evaluacionesService
            .guardarActualizarPreguntaConAlternativas(pregunta)
            .subscribe({
                next: () => {
                    this.closeModal(pregunta)
                },
            })
    }
}
