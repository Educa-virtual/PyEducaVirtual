import { Component, inject, OnInit, OnDestroy } from '@angular/core'
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms'
import { DropdownModule } from 'primeng/dropdown'
import { InputSwitchChangeEvent, InputSwitchModule } from 'primeng/inputswitch'
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

import Quill from 'quill'
import { AutoCompleteModule } from 'primeng/autocomplete'
import { Subject, takeUntil } from 'rxjs'
import { EncabezadosPreguntasComponent } from '../encabezados-preguntas/encabezados-preguntas.component'

const ColorClass = Quill.import('attributors/class/color')
const SizeStyle = Quill.import('attributors/style/size')
Quill.register('attributors/class/color', ColorClass, true)
Quill.register('attributors/style/size', SizeStyle, true)

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
        AutoCompleteModule,
        EncabezadosPreguntasComponent,
    ],
    templateUrl: './banco-preguntas-form.component.html',
    styleUrl: './banco-preguntas-form.component.scss',
})
export class BancoPreguntasFormComponent implements OnInit, OnDestroy {
    public tipoPreguntas = []
    public customOptions = []
    public encabezadoSelected

    public mode: 'EDITAR' | 'CREAR' = 'CREAR'
    public pregunta
    public pasos = [
        {
            label: 'Encabezado',
        },
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
    private unsubscribe$: Subject<boolean> = new Subject()

    public encabezados = []

    public bancoPreguntasForm: FormGroup = this._formBuilder.group({
        0: this._formBuilder.group({
            iEncabPregId: [null],
            bConEncabezado: [false],
        }),
        1: this._formBuilder.group({
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
        2: this._formBuilder.group({
            alternativas: [
                [],
                [Validators.required, this.alternativasValidator()],
            ],
        }),
    })

    ngOnInit() {
        this.tipoPreguntas = this._config.data.tipoPreguntas.filter((item) => {
            return item.iTipoPregId !== 0
        })
        this.pregunta = this._config.data.pregunta

        this.patchForm(this.pregunta, this._config.data.iCursoId)

        if (this.pregunta?.iPreguntaId !== 0) {
            this.mode = 'EDITAR'
            this.obtenerAlternativas()
        }
        this.obtenerEncabezados()

        this.bancoPreguntasForm
            .get('1.iTipoPregId')
            ?.valueChanges.subscribe((value) => {
                this.handleTipoPreguntaChange(value)
            })
    }

    obtenerEncabezados() {
        const params = {
            iCursoId: this._config.data.iCursoId,
            iNivelGradoId: 1,
            iEspecialistaId: 1,
        }
        this._evaluacionesService
            .obtenerEncabezadosPreguntas(params)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (resp: unknown) => {
                    this.encabezados = resp['data']
                    this.encabezados = this.encabezados.map((enc) => {
                        if (enc.iEncabPregId == this.pregunta.iEncabPregId) {
                            enc.checked = true
                        }
                        return enc
                    })
                    this.encabezadoSelected = this.encabezados.find(
                        (enc) => enc.iEncabPregId == this.pregunta.iEncabPregId
                    )
                },
            })
    }

    // cambiar validaciones si selecciona con o sin cabecera.
    toggleValidationCabecera(event: InputSwitchChangeEvent) {
        if (event.checked) {
            this.bancoPreguntasForm
                .get('0.iEncabPregId')
                .setValidators([Validators.required])
        } else {
            this.bancoPreguntasForm.get('0.iEncabPregId').setValidators(null)
        }

        this.bancoPreguntasForm.get('0.iEncabPregId').updateValueAndValidity()
    }

    get alternativas() {
        return this.bancoPreguntasForm.get('2.alternativas').value
    }

    set alternativas(value) {
        this.bancoPreguntasForm.get('2.alternativas').setValue(value)
    }

    alternativasChange(alternativas) {
        console.log(alternativas)
        this.alternativas = alternativas
    }

    // avanzar pasos
    goStep(opcion: string) {
        switch (opcion) {
            case 'next':
                console.log(
                    this.bancoPreguntasForm.get(this.activeIndex.toString())
                        .invalid
                )

                if (
                    this.bancoPreguntasForm.get(this.activeIndex.toString())
                        .invalid
                ) {
                    this.bancoPreguntasForm.markAllAsTouched()
                    return
                }
                if (this.activeIndex !== 2) {
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
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (resp: unknown) => {
                    this.alternativas = resp['data']
                },
            })
    }

    patchForm(pregunta, iCursoId) {
        this.bancoPreguntasForm.get('0').patchValue(pregunta)
        this.bancoPreguntasForm.get('1').patchValue(pregunta)
        this.bancoPreguntasForm.get('1.iCursoId').setValue(iCursoId)

        if (
            pregunta.iEncabPregId &&
            parseInt(pregunta.iEncabPregId, 10) !== 0
        ) {
            this.bancoPreguntasForm.get('0.bConEncabezado').setValue(true)
        }
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

    setEncabezado(encabezado) {
        this.bancoPreguntasForm.get('0').patchValue(encabezado)
    }

    // validaciones alternativas
    alternativasValidator() {
        return (control: AbstractControl) => {
            let tipoPregunta =
                this.bancoPreguntasForm?.get('1.iTipoPregId')?.value
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

        const pregunta = this.bancoPreguntasForm.get('1').value
        const encabezado = this.bancoPreguntasForm.get('0').value
        pregunta.datosAlternativas = this.alternativas
        pregunta.iNivelGradoId = 1
        pregunta.iEspecialistaId = 1
        pregunta.encabezado = encabezado
        this._evaluacionesService
            .guardarActualizarPreguntaConAlternativas(pregunta)
            .subscribe({
                next: () => {
                    this.closeModal(pregunta)
                },
            })
    }

    ngOnDestroy() {
        this.unsubscribe$.next(true)
        this.unsubscribe$.complete()
    }
}
