import { Component, inject, OnInit } from '@angular/core'
/*Droodwn*/
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms'
import { DropdownModule } from 'primeng/dropdown'
import { InputSwitchModule } from 'primeng/inputswitch'

//EDITOR
import { EditorModule } from 'primeng/editor'

/*Tab */
import { TabViewModule } from 'primeng/tabview'

/*Input text */
import { InputTextModule } from 'primeng/inputtext'
/*import alternativa*/
import { AlternativasComponent } from '../alternativas/alternativas.component'
/*acordion */
import { AccordionModule } from 'primeng/accordion'

import { ButtonModule } from 'primeng/button'
import { CommonInputComponent } from '@/app/shared/components/common-input/common-input.component'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { ApiEvaluacionesService } from '../../../services/api-evaluaciones.service'
import { StepsModule } from 'primeng/steps'
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

    handleTipoPreguntaChange(tipoPregunta: number): void {
        console.log(tipoPregunta)

        const alternativasControl =
            this.bancoPreguntasForm.get('1.alternativas')
        if (alternativasControl) {
            // Reaplicar las validaciones personalizadas según el tipo de pregunta
            alternativasControl.updateValueAndValidity()
        }
    }

    alternativasValidator() {
        return (control: AbstractControl) => {
            let tipoPregunta =
                this.bancoPreguntasForm?.get('0.iTipoPregId')?.value
            const alternativas = control.value
            tipoPregunta = parseInt(tipoPregunta, 10)

            // Dependiedo al tipo pregunta
            // pregunta unica
            //  debe seleccionar al menos 1 alternativa correcta
            //  al menos 2 alternativas
            // pregunta multiple
            // debe de tener 2 alternativas
            // debe seleccionar al menos 1 alternativa incorrecta

            // si sellecciona debe de reaccionar la validacion.

            // Cualquier preguntadebe tener al menos 2 alternativas
            console.log(alternativas, tipoPregunta)

            if (alternativas.length < 2) {
                return {
                    alternativasInvalidas: 'Debe haber almenos 2 alternativas',
                }
            }

            if (tipoPregunta === 1 && alternativas.length >= 2) {
                // Una de sus respuestas debe ser correcta
                if (
                    alternativas.filter(
                        (alternativa) => alternativa.bAlternativaCorrecta === 1
                    ).length < 1
                ) {
                    return {
                        alternativasInvalidas:
                            'Debe haber al menos una alternativa correcta',
                    }
                }
            }

            if (tipoPregunta === 1 && alternativas.length >= 2) {
                // Una de sus respuestas debe ser incorrecta
                if (
                    alternativas.filter(
                        (alternativa) => alternativa.bAlternativaCorrecta === 1
                    ).length > 1
                ) {
                    return {
                        alternativasInvalidas:
                            'Debe haber solo una alternativa correcta',
                    }
                }
            }

            // if (tipoPregunta === 2 && alternativas.length !== 2) {
            //     // Pregunta de opción múltiple necesita al menos una alternativa incorrecta
            //     return { minAlternativas: 'Debe haber al menos 2 alternativas' }
            // }

            // if (tipoPregunta === 3 && alternativas.length > 0) {
            //     // Pregunta de respuesta abierta no debe tener alternativas
            //     return {
            //         noAlternativas:
            //             'No se deben agregar alternativas a una pregunta abierta',
            //     }
            // }

            return null // No hay errores
        }
    }

    closeModal(data) {
        this._ref.close(data)
    }

    guardarActualizarBancoPreguntas() {
        console.log(this.alternativas, this.bancoPreguntasForm.value)

        return
        if (this.bancoPreguntasForm.invalid) {
            this.bancoPreguntasForm.markAllAsTouched()
            return
        }

        if (this.alternativas.length == 0) {
            return
        }

        const pregunta = this.bancoPreguntasForm.value
        pregunta.datosAlternativas = this.alternativas
        if (this.mode == 'CREAR') {
            this._evaluacionesService
                .guardarPreguntaConAlternativas(pregunta)
                .subscribe({
                    next: () => {
                        this.closeModal(pregunta)
                    },
                })
        }
        if (this.mode == 'EDITAR') {
            this._evaluacionesService
                .actualizarBancoPreguntas(pregunta)
                .subscribe({
                    next: () => {
                        this.closeModal(pregunta)
                    },
                })
        }
    }
}
